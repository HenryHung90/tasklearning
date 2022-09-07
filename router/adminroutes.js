const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../database/passportjs')(passport)

const studentsConfig = require('../models/studentsconfig')

const datacontentmodel = require('../models/datacontentmodel')
const missioncontentmodel = require('../models/missioncontentmodel')
const responsecontentmodel = require('../models/responsecontentmodel')

const studentmission = require('../models/studentmission')
const studentmanage = require('../models/studentmanage')
const studentminding = require('../models/studentminding')

// router.use((req, res, next) => {
//     if (req.user != undefined) {
//         if (req.user.studentId == "admin") {
//             next()
//             return
//         }
//         res.send("fall")
//     } else {
//         res.send("fall")
//     }
// })
router.post(process.env.ROUTER_ADMIN_READSTUDENTSTATUS, async (req, res) => {
    const returnData = {
        studentsStatus: [],
        studentsMission: [],
        studentsMinding: [],
        studentsResponse: []
    }

    await studentsConfig.find({}).then(response => {
        response.map((value, index) => {
            if (value.studentName != 'Admin') {
                returnData.studentsStatus.push(value.studentDetail)
            }
        })
    })
    await missioncontentmodel.find({}).then(response => {
        response.map((value, index) => {
            const missionData = {
                week: value.week,
                mission: value.mission
            }
            returnData.studentsMission.push(missionData)
        })
    })
    await studentminding.find({}).then(response => {
        response.map((value, index) => {
            const mindingData = {
                week: value.week,
                studentMinding: value.studentMinding,
                studentRanking: value.studentRanking
            }
            returnData.studentsMinding.push(mindingData)
        })
    })
    await responsecontentmodel.find({}).then(response => {
        response.map((value, index) => {
            const responseData = {
                studentId: value.studentId,
                week: value.week,
                studentResponse: value.studentResponse,
                teacherResponse: value.teacherResponse
            }
            returnData.studentsResponse.push(responseData)
        })
    })

    res.send(returnData)
})
router.post(process.env.ROUTER_ADMIN_READSTUDENTS, async (req, res) => {
    studentsConfig.find({}).then(response => {
        const returnData = []
        response.map((value, index) => {
            if (value.studentName != "Admin") {
                const studentData = {
                    studentId: value.studentId,
                    studentName: value.studentName,
                    studentEmail: value.studentEmail,
                    studentDetail: value.studentDetail
                }
                returnData.push(studentData)
            }
        })
        res.send(returnData)
    })
})
router.post(process.env.ROUTER_ADMIN_READMANAGESTATUS, async (req, res) => {
    const returnData = {
        mission: [],
        manage: [],
    }
    await missioncontentmodel.find({}).then(response => {
        response.map((value, index) => {
            const missionData = {
                week: value.week,
                mission: value.mission
            }
            returnData.mission.push(missionData)
        })
    })

    await studentmission.find({}).then(response => {
        response.map((value, index) => {
            const selectData = {
                week: value.week,
                studentId: value.studentId,
                select: value.studentSelect
            }
            returnData.manage.push(selectData)
        })
    })
    await studentmanage.find({}).then(response => {
        response.map((value, index) => {
            returnData.manage[index]["manage"] = value.studentManage
        })
    })
    res.send(returnData)
})

router.post(process.env.ROUTER_ADMIN_ADDSTUDENT, async (req, res) => {
    await studentsConfig.find({ studentId: req.body.studentId }).then(response => {
        console.log(response.length)
        if (response.length == 0) {
            const saltRound = 15
            bcrypt.hash(req.body.studentPassword, saltRound, (err, hashedPassword) => {
                const studentDetailInit = new Array()
                const availableWeek = 7

                for (let i = 1; i <= availableWeek; i++) {
                    studentDetailInit.push({
                        Week: i,
                        Status: {
                            Data: false,
                            Mission: false,
                            Manage: false,
                            Minding: false,
                            Response: false
                        }
                    })
                }
                const newStudent = new studentsConfig({
                    studentId: req.body.studentId,
                    studentPassword: hashedPassword,
                    studentName: req.body.studentName,
                    studentEmail: req.body.studentEmail,
                    studentDetail: studentDetailInit
                })
                newStudent.save()
                res.send(true)
            })
        } else {
            res.send('user exist')
        }
    })

})
router.post(process.env.ROUTER_ADMIN_DELETESTUDENT, async (req, res) => {
    let returnData = {
        deleteStatus: {
            "學生帳號": false,
            "學生Feedback": false,
            "學生Task": false,
            "學生Plan": false,
            "學生Reflection": false,
        },
        newStudentData: []
    }

    await studentsConfig.deleteOne({ studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生帳號"] = response.acknowledged
    })
    await responsecontentmodel.deleteMany({ studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生回饋"] = response.acknowledged
    })
    await studentmission.deleteMany({ studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生Task"] = response.acknowledged
    })
    await studentmanage.deleteMany({ studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生Plan"] = response.acknowledged
    })
    await studentminding.deleteMany({ studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生Reflection"] = response.acknowledged
    })
    await studentsConfig.find({}).then(response => {
        response.map((value, index) => {
            if (value.studentName != "Admin") {
                const studentData = {
                    studentId: value.studentId,
                    studentName: value.studentName,
                    studentEmail: value.studentEmail,
                    studentDetail: value.studentDetail
                }
                returnData.newStudentData.push(studentData)
            }
        })
    })

    res.send(returnData)
})
router.post(process.env.ROUTER_ADMIN_CHANGEPASSWORD, async (req, res) => {
    const saltRound = 15
    bcrypt.hash(req.body.studentPassword, saltRound, (err, hashedPassword) => {
        studentsConfig.updateOne({ studentId: req.body.studentId }, 
            { studentPassword:hashedPassword }).then(response=>{
            res.send(response.acknowledged)
        })
    })
})

router.post(process.env.ROUTER_ADMIN_ADDDATA, async (req, res) => {
    const addWeek = req.body.week
    const checkWeek = datacontentmodel.findOne({ week: addWeek })

    await checkWeek.then(isAdded => {
        try {
            //若尚未新增該周資料
            if (isAdded === null) {
                const newWeekData = new datacontentmodel({
                    week: addWeek,
                    content: req.body.content
                })
                newWeekData.save()
            }
            //已經新增過，欲進行更改
            else {
                datacontentmodel.updateOne({ week: addWeek }, { content: req.body.content }).then(result => {
                    console.log(result)
                })
            }
        } catch {
            console.log("mongodb has error")
        }
    })
    res.send('success')
})

router.post(process.env.ROUTER_ADMIN_ADDMISSION, async (req, res) => {
    const addWeek = req.body.week
    const checkWeek = missioncontentmodel.findOne({ week: addWeek })

    await checkWeek.then(isAdded => {
        try {
            if (isAdded === null) {
                const newWeekMission = new missioncontentmodel({
                    week: addWeek,
                    mission: req.body.mission
                })
                newWeekMission.save()
            } else {
                missioncontentmodel.updateOne({ week: addWeek }, { mission: req.body.mission }).then(result => {
                    console.log(result)
                })
            }
        }
        catch {
            console.log("mongodb has error")
        }
    })
    res.send('success')
})

router.post(process.env.ROUTER_ADMIN_ADDRESPONSE, async (req, res) => {

})

module.exports = router