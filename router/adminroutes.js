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
router.post(process.env.ROUTER_ADMIN_READMINDINGSTATUS, async (req, res) => {

})
router.post(process.env.ROUTER_ADMIN_READSTUDENTDATA, async (req, res) => {
    const returnData = {
        studentData: [],
        dataTitle: []
    }
    let missionName = {}
    await studentsConfig.findOne({ studentId: req.body.studentId }).then(response => {
        returnData.studentData.push(
            [{
                "學號": response.studentId,
                "姓名": response.studentName,
                "信箱": response.studentEmail
            }]
        )
        returnData.dataTitle.push("學生基本資料")
    })
    //儲存Task
    await missioncontentmodel.find({}).then(response => {
        response.map((value, index) => {
            missionName[value.week] = value.mission
        })
    })
    await studentmission.find({ studentId: req.body.studentId }).then(response => {
        if (response == null) {
            return
        }
        let missionData = []
        response.map((value, index) => {
            let weekMission = {
                "星期": value.week
            }
            missionName[value.week].map((missionValue, missionIndex) => {
                weekMission[value.week + " " + missionValue.title] = value.studentSelect[missionIndex] ? value.studentSelect[missionIndex].join(" -> ") : "沒有選擇"
            })
            missionData.push(weekMission)
        })
        returnData.studentData.push(missionData)
        returnData.dataTitle.push("Task")
    })
    //儲存Plan
    await studentmanage.find({ studentId: req.body.studentId }).then(response => {
        if (response == null) {
            return
        }
        let manageData = []
        response.map((value, index) => {
            let weekManage = {
                "星期": value.week
            }
            missionName[value.week].map((missionValue, missionIndex) => {
                weekManage[value.week + " " + missionValue.title] = value.studentManage[missionIndex] ? value.studentManage[missionIndex].join(" -> ") : "沒有選擇"
            })
            manageData.push(weekManage)
        })
        returnData.studentData.push(manageData)
        returnData.dataTitle.push("Plan")
    })
    //儲存Reflection
    await studentminding.find({ studentId: req.body.studentId }).then(response => {
        if (response == null) {
            return
        }
        let mindingData = []
        response.map((value, index) => {
            let weekMinding = {
                "星期": value.week,
                "自我修正": value.studentFixing,
                "自我評價": value.studentRanking
            }
            missionName[value.week].map((missionValue, missionIndex) => {
                if (value.studentMinding[missionIndex]) {
                    weekMinding[value.week + " " + missionValue.title] = value.studentMinding[missionIndex].missionComplete ? "完成" : value.studentMinding[missionIndex].missionReason
                }
            })
            mindingData.push(weekMinding)
        })
        returnData.studentData.push(mindingData)
        returnData.dataTitle.push("Reflection")
    })
    //儲存Response
    await responsecontentmodel.find({ studentId: req.body.studentId }).then(response => {
        if (response == null) {
            return
        }
        let responseData = []
        response.map((value, index) => {
            responseData.push({
                "星期": value.week,
                "老師回饋": value.teacherResponse,
                "學生回饋": value.studentResponse
            })
        })
        returnData.studentData.push(responseData)
        returnData.dataTitle.push("Feedback")
    })

    res.send(returnData)
})
router.post(process.env.ROUTER_ADMIN_READDATA, async (req, res) => {
    res.send(true)
})

router.post(process.env.ROUTER_ADMIN_UPLOADMANYSTUDENTS, async (req, res) => {
    req.body.studentList.map(async (studentValue, studentIndex) => {
        //studentValue[0] = newStudentId
        //studentValue[1] = currentStudentId
        //studentValue[2] = studentName
        //studentValue[3] = studentPassword
        //studentValue[4] = studentEmail
        if (studentValue[3] != '') {
            const saltRound = 15
            bcrypt.hash(studentValue[3], saltRound, async (err, hashedPassword) => {
                await studentsConfig.updateOne({ studentId: studentValue[1] },
                    {
                        studentId: studentValue[0] == '' ? studentValue[1] : studentValue[0],
                        studentPassword: hashedPassword,
                        studentName: studentValue[2],
                        studentEmail: studentValue[4]
                    })
            })
        } else {
            await studentsConfig.updateOne({ studentId: studentValue[1] },
                {
                    studentId: studentValue[0] == '' ? studentValue[1] : studentValue[0],
                    studentName: studentValue[2],
                    studentEmail: studentValue[4]
                })
        }
        //學生Task
        await studentmission.updateMany({ studentId: studentValue[1] },
            { studentId: studentValue[0] == '' ? studentValue[1] : studentValue[0] })

        //學生Plan
        await studentmanage.updateMany({ studentId: studentValue[1] },
            { studentId: studentValue[0] == '' ? studentValue[1] : studentValue[0] })

        //學生Reflection
        await studentminding.updateMany({ studentId: studentValue[1] },
            { studentId: studentValue[0] == '' ? studentValue[1] : studentValue[0] })
        //學生Feedback
        await responsecontentmodel.updateMany({ studentId: studentValue[1] },
            { studentId: studentValue[0] == '' ? studentValue[1] : studentValue[0] })
    })

    await studentsConfig.find({}).then(response => {
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
            { studentPassword: hashedPassword }).then(response => {
                res.send(response.acknowledged)
            })
    })
})
router.post(process.env.ROUTER_ADMIN_UPDATESTUDENTCONFIG, async (req, res) => {
    const returnData = {
        studentConfig: false,
        studentMission: false,
        studentManage: false,
        studentMinding: false,
        studentResponse: false,
        newStudentData: []
    }

    //學生資料
    await studentsConfig.updateOne({ studentId: req.body.originStudentId },
        { studentId: req.body.studentId, studentName: req.body.studentName })
        .then(response => {
            returnData.studentConfig = response.acknowledged
        })
    //學生Task
    await studentmission.updateMany({ studentId: req.body.originStudentId },
        { studentId: req.body.studentId })
        .then(response => {
            returnData.studentMission = response.acknowledged
        })
    //學生Plan
    await studentmanage.updateMany({ studentId: req.body.originStudentId },
        { studentId: req.body.studentId })
        .then(response => {
            returnData.studentManage = response.acknowledged
        })
    //學生Reflection
    await studentminding.updateMany({ studentId: req.body.originStudentId }, {
        studentId: req.body.studentId
    }).then(response => {
        returnData.studentMinding = response.acknowledged
    })
    //學生Feedback
    await responsecontentmodel.updateMany({ studentId: req.body.originStudentId },
        { studentId: req.body.studentId })
        .then(response => {
            returnData.studentResponse = response.acknowledged
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