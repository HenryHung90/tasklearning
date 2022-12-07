const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../database/passportjs')(passport)
const { v4: uuidv4 } = require('uuid');

const multer = require('multer')
const fs = require('fs')
const uploadLocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/media/pdf')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '.pdf')
    }
})
const upload = multer({
    storage: uploadLocation
})
const studentsConfig = require('../models/studentsconfig')
const sessionconfig = require('../models/sessionconfig')
const studentlistenconfig = require('../models/studentlistenconfig')

const datacontentmodel = require('../models/datacontentmodel')
const missioncontentmodel = require('../models/missioncontentmodel')
const responsecontentmodel = require('../models/responsecontentmodel')

const studentmission = require('../models/studentmission')
const studentmanage = require('../models/studentmanage')
const studentminding = require('../models/studentminding')


const availableWeek = 5
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

//取得所有學生各項數據
router.post(process.env.ROUTER_ADMIN_READSTUDENTSTATUS, async (req, res) => {
    const returnData = {
        studentsStatus: [],
        studentsMission: [],
        studentsMinding: [],
        studentsResponse: []
    }

    await studentsConfig.find({ studentSession: req.body.session }).then(response => {
        response.map((value, index) => {
            if (value.studentName != 'Admin') {
                returnData.studentsStatus.push(value.studentDetail)
            }
        })
    })
    await missioncontentmodel.find({ studentSession: req.body.session }).then(response => {
        response.map((value, index) => {
            const missionData = {
                week: value.week,
                mission: value.mission
            }
            returnData.studentsMission.push(missionData)
        })
    })
    await studentminding.find({ studentSession: req.body.session }).then(response => {
        response.map((value, index) => {
            const mindingData = {
                week: value.week,
                studentMinding: value.studentMinding,
                studentRanking: value.studentRanking
            }
            returnData.studentsMinding.push(mindingData)
        })
    })
    await responsecontentmodel.find({ studentSession: req.body.session }).then(response => {
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
//取得學生列表
router.post(process.env.ROUTER_ADMIN_READSTUDENTS, async (req, res) => {
    studentsConfig.find({ studentSession: req.body.studentSession }).then(response => {
        const returnData = []
        response.map((value, index) => {
            if (value.studentName != "Admin") {
                const studentData = {
                    studentSession: value.studentSession,
                    studentId: value.studentId,
                    studentName: value.studentName,
                    studentEmail: value.studentEmail,
                    studentDetail: value.studentDetail
                }
                returnData.push(studentData)
            }
        })
        returnData.sort((a,b)=>{
            if(a.studentId == 'TEST' || a.studentId =='1090001'){
                return b.studentId - a.studentId
            }else{
                return a.studentId - b.studentId
            }
        })
        res.send(returnData)
    })
})
//取得所有學生Manage資訊
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
//取得所有學生Minding資訊
router.post(process.env.ROUTER_ADMIN_READMINDINGSTATUS, async (req, res) => {

})
//取得 單一學生 單周 學習資訊 用於Response
router.post(process.env.ROUTER_ADMIN_READSTUDENTSTATUSDETAIL, async (req, res) => {
    const returnData = {
        missionName: [],
        missionContent: [],
        manageContent: [],
        mindingContent: {}
    }
    await missioncontentmodel.findOne({ session: req.body.studentSession, week: req.body.week }).then(response => {
        if (response == null) {
            return
        }
        response.mission.map((missionValue) => {
            returnData.missionName.push(missionValue.title)
        })
    })
    await studentmission.findOne({ session: req.body.studentSession, studentId: req.body.studentId, week: req.body.week }).then(response => {
        if (response == null) {
            return
        }
        const studentSelect = Object.values(response.studentSelect)
        studentSelect.map((missionSelect) => {
            returnData.missionContent.push(missionSelect)
        })
    })
    await studentmanage.findOne({ session: req.body.studentSession, studentId: req.body.studentId, week: req.body.week }).then(response => {
        if (response == null) {
            return
        }
        if (typeof response == 'object') {
            response.studentManage = Object.values(response.studentManage)
        }
        response.studentManage.map((studentManage) => {
            returnData.manageContent.push(studentManage)
        })
    })
    await studentminding.findOne({ session: req.body.studentSession, studentId: req.body.studentId, week: req.body.week }).then(response => {
        if (response == null) {
            return
        }
        if(response.studentMinding != undefined){
            response.studentMinding = Object.values(response.studentMinding)
            returnData.mindingContent = {
                studentRanking: response.studentRanking,
                studentFixing: response.studentFixing,
                studentMinding: response.studentMinding,
            }
        }
    })
    res.send(returnData)
})
//取得 單一學生 單周 Response 用於 Response
router.post(process.env.ROUTER_ADMIN_READTEACHERRESPONSE, async (req, res) => {
    await responsecontentmodel.findOne({ studentId: req.body.studentId, week: req.body.week }).then(response => {
        const returnData = {
            teacherResponse: response ? response.teacherResponse : '',
            teacherResponseTime: response ? response.teacherResponseTime : '',
            studentResponse: response ? response.studentResponse : '',
            studentResponseTime: response ? response.studentResponseTime : '',

        }
        res.send(returnData)
    })
})
//取得 單一學生 全部 學習資訊 用於StudentList
router.post(process.env.ROUTER_ADMIN_READSTUDENTDATA, async (req, res) => {
    const returnData = {
        studentData: [],
        dataTitle: []
    }
    let missionName = {}
    await studentsConfig.findOne({studentSession:req.body.studentSession, studentId: req.body.studentId }).then(response => {
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
    await studentmission.find({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
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
    await studentmanage.find({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
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
    await studentminding.find({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
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
    await responsecontentmodel.find({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
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
//取得 DATA MISSION 當周 內容
router.post(process.env.ROUTER_ADMIN_READDATA, async (req, res) => {
    const returnData = {
        dataContent: {},
        missionContent: {},
    }
    await datacontentmodel.findOne({ week: req.body.week, session: req.body.session }).then(response => {
        returnData.dataContent = response
    })
    await missioncontentmodel.findOne({ week: req.body.week, session: req.body.session }).then(response => {
        returnData.missionContent = response
    })
    res.send(returnData)
})
//批量修改學生 用於Upload Student
router.post(process.env.ROUTER_ADMIN_UPLOADMANYSTUDENTS, async (req, res) => {
    req.body.studentList.map(async (studentValue, studentIndex) => {
        //studentSession
        //newStudentId
        //currentStudentId
        //studentName
        //studentPassword
        //studentEmail
        studentValue.studentAccess == "TRUE" ? studentValue.studentAccess = true : studentValue.studentAccess = false
        await studentsConfig.findOne({ studentSession: studentValue.studentSession, studentId: studentValue.currentStudentId }).then(async response => {
            console.log(response)
            if (response != null) {
                if (studentValue.studentPassword != '') {
                    const saltRound = 15
                    bcrypt.hash(studentValue.studentPassword, saltRound, async (err, hashedPassword) => {
                        await studentsConfig.updateOne({ studentSession: studentValue.studentSessionn, studentId: studentValue.currentStudentId },
                            {
                                studentSession: studentValue.studentSession,
                                studentId: studentValue.newStudentId == '' ? studentValue.currentStudentId : studentValue.newStudentId,
                                studentPassword: hashedPassword,
                                studentName: studentValue.studentName,
                                studentAccess: studentValue.studentAccess
                            })
                    })
                } else {
                    await studentsConfig.updateOne({ studentSession: studentValue.studentSession, studentId: studentValue.currentStudentId },
                        {
                            studentId: studentValue.newStudentId == '' ? studentValue.currentStudentId : studentValue.newStudentId,
                            studentName: studentValue.studentName,
                            studentAccess: studentValue.studentAccess
                        })
                }
                //學生Task
                if (studentValue.newStudentId != '') {
                    await studentmission.updateMany({ studentSession: studentValue.studentSession, studentId: studentValue.currentStudentId },
                        { studentSession: studentValue.studentSession, studentId: studentValue.newStudentId })

                    //學生Plan
                    await studentmanage.updateMany({ studentSession: studentValue.studentSession, studentId: studentValue.currentStudentId },
                        { studentSession: studentValue.studentSession, studentId: studentValue.newStudentId })

                    //學生Reflection
                    await studentminding.updateMany({ studentSession: studentValue.studentSession, studentId: studentValue.currentStudentId },
                        { studentSession: studentValue.studentSession, studentId: studentValue.newStudentId })

                    //學生Feedback
                    await responsecontentmodel.updateMany({ studentSession: studentValue.studentSession, studentId: studentValue.currentStudentId },
                        { studentSession: studentValue.studentSession, studentId: studentValue.newStudentId })
                }


            } else {
                const saltRound = 15
                studentValue.studentPassword == '' ? studentValue.studentPassword = studentValue.currentStudentId : null
                bcrypt.hash(studentValue.studentPassword, saltRound, (err, hashedPassword) => {
                    const studentDetailInit = new Array()

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
                        studentSession: studentValue.studentSession,
                        studentId: studentValue.currentStudentId,
                        studentPassword: hashedPassword,
                        studentName: studentValue.studentName,
                        studentAccess: studentValue.studentAccess,
                        studentDetail: studentDetailInit
                    })
                    newStudent.save()
                })
            }
        })

    })
    res.send(true)
})
//刪除學生(刪除所有資料)
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

    await studentsConfig.deleteOne({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生帳號"] = response.acknowledged
    })
    await responsecontentmodel.deleteMany({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生回饋"] = response.acknowledged
    })
    await studentmission.deleteMany({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生Task"] = response.acknowledged
    })
    await studentmanage.deleteMany({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生Plan"] = response.acknowledged
    })
    await studentminding.deleteMany({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
        returnData.deleteStatus["學生Reflection"] = response.acknowledged
    })
    await studentsConfig.find({ studentSession: req.body.studentSession }).then(response => {
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
//變更學生密碼
router.post(process.env.ROUTER_ADMIN_CHANGEPASSWORD, async (req, res) => {
    const saltRound = 15
    bcrypt.hash(req.body.studentPassword, saltRound, (err, hashedPassword) => {
        studentsConfig.updateOne({ studentId: req.body.studentId },
            { studentPassword: hashedPassword }).then(response => {
                res.send(response.acknowledged)
            })
    })
})
//變更學生基本資料
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
    await studentsConfig.updateOne({ studetnSession: req.body.studentSession, studentId: req.body.originStudentId },
        { studentId: req.body.studentId, studentName: req.body.studentName, studentAccess: req.body.studentAccess })
        .then(response => {
            returnData.studentConfig = response.acknowledged
        })
    //學生Task
    await studentmission.updateMany({ studetnSession: req.body.studentSession, studentId: req.body.originStudentId },
        { studetnSession: req.body.studentSession, studentId: req.body.studentId })
        .then(response => {
            returnData.studentMission = response.acknowledged
        })
    //學生Plan
    await studentmanage.updateMany({ studetnSession: req.body.studentSession, studentId: req.body.originStudentId },
        { studetnSession: req.body.studentSession, studentId: req.body.studentId })
        .then(response => {
            returnData.studentManage = response.acknowledged
        })
    //學生Reflection
    await studentminding.updateMany({ studetnSession: req.body.studentSession, studentId: req.body.originStudentId }, {
        studetnSession: req.body.studentSession, studentId: req.body.studentId
    }).then(response => {
        returnData.studentMinding = response.acknowledged
    })
    //學生Feedback
    await responsecontentmodel.updateMany({ studetnSession: req.body.studentSession, studentId: req.body.originStudentId },
        { studetnSession: req.body.studentSession, studentId: req.body.studentId })
        .then(response => {
            returnData.studentResponse = response.acknowledged
        })

    await studentsConfig.find({ studentSession: req.body.studentSession }).then(response => {
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
//新增學生
router.post(process.env.ROUTER_ADMIN_ADDSTUDENT, async (req, res) => {
    await studentsConfig.find({ studentSession: req.body.studentSession, studentId: req.body.studentId }).then(response => {
        if (response.length == 0) {
            const saltRound = 15
            bcrypt.hash(req.body.studentPassword, saltRound, (err, hashedPassword) => {
                const studentDetailInit = new Array()
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
                    studentSession: req.body.studentSession,
                    studentId: req.body.studentId,
                    studentPassword: hashedPassword,
                    studentName: req.body.studentName,
                    studentAccess: req.body.studentAccess,
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
//新增教學資料
router.post(process.env.ROUTER_ADMIN_ADDDATA, async (req, res) => {
    const checkWeek = datacontentmodel.findOne({ week: req.body.week, session: req.body.session })

    await checkWeek.then(async isAdded => {
        try {
            //若尚未新增該周資料
            if (isAdded === null) {
                const newWeekData = new datacontentmodel({
                    session: req.body.session,
                    week: req.body.week,
                    content: req.body.content
                })
                newWeekData.save()
            }
            //已經新增過，欲進行更改
            else {
                await datacontentmodel.updateOne({ week: req.body.week, session: req.body.session }, { content: req.body.content })
            }
        } catch {
            console.log("mongodb has error")
        }
    })
    res.send('success')
})
//上傳PDF
router.post(process.env.ROUTER_ADMIN_ADDPDF, upload.single('uploadPDF'), async (req, res) => {
    if (req.file != null) {
        const returnData = {
            title: req.file.fieldname,
            link: 'http://ccj.infocom.yzu.edu.tw/checkdata/' + req.file.filename
        }
        res.send(returnData)
    } else {
        res.send("error")
    }

})
//刪除PDF
router.post(process.env.ROUTER_ADMIN_DELTEPDF, async (req, res) => {
    try {
        const fileLocation = req.body.link.split('/')[4]
        fs.unlinkSync('./public/media/pdf/' + fileLocation)

        res.send('success')
    } catch (err) {
        console.error(err)
    }
})
//編輯任務
router.post(process.env.ROUTER_ADMIN_ADDMISSION, async (req, res) => {
    const checkWeek = missioncontentmodel.findOne({ week: req.body.week, session: req.body.session, })

    await checkWeek.then(isAdded => {
        try {
            if (isAdded === null) {
                const newWeekMission = new missioncontentmodel({
                    session: req.body.session,
                    week: req.body.week,
                    mission: req.body.mission
                })
                newWeekMission.save()
                res.send('success')
            } else {
                missioncontentmodel.updateOne({ session: req.body.session, week: req.body.week }, { mission: req.body.mission }).then(response => {
                    res.send(response.acknowledged)
                })
            }
        }
        catch {
            console.log("mongodb has error")
        }
    })
})
//新增回覆
router.post(process.env.ROUTER_ADMIN_ADDRESPONSE, async (req, res) => {
    let isFirstResponse = false
    let isSuccess = false
    let cloudStudentDetail = []
    await responsecontentmodel.findOne({ session: req.body.session, studentId: req.body.studentId, week: req.body.week }).then(response => {
        response == undefined ? isFirstResponse = true : null
    })

    if (isFirstResponse) {
        const newResponse = new responsecontentmodel({
            session:req.body.session,
            studentId: req.body.studentId,
            week: req.body.week,
            teacherResponse: req.body.teacherResponse,
            teacherResponseTime:req.body.teacherResponseTime,
        })
        await newResponse.save()
        isSuccess = true
    } else {
        await responsecontentmodel.updateOne({ studentId: req.body.studentId, week: req.body.week }, { teacherResponse: req.body.teacherResponse, teacherResponseTime:req.body.teacherResponseTime }).then(response => {
            isSuccess = response.acknowledged + ' response'
        })
    }

    await studentsConfig.findOne({ session: req.body.session, studentId: req.body.studentId }).then(response => {
        cloudStudentDetail = response.studentDetail
        cloudStudentDetail[req.body.week - 1].Status.Response = 1
    })
    await studentsConfig.updateOne({ session: req.body.session, studentId: req.body.studentId }, { studentDetail: cloudStudentDetail }).then(response => {
        isSuccess = response.acknowledged + ' done'
    })
    res.send(isSuccess)
})
//新增 / 變更 session active
router.post(process.env.ROUTER_ADMIN_CHANGESESSION, async (req, res) => {
    await sessionconfig.updateMany({}, { active: false })
    await studentsConfig.updateMany({}, { studentAccess: false })

    await sessionconfig.find({ session: req.body.session }).then(async response => {
        if (response.length == 0) {
            const newSessionconfig = new sessionconfig({
                session: req.body.session,
                active: true,
            })
            await newSessionconfig.save()
        } else {
            await sessionconfig.updateOne({ session: req.body.session }, { active: true })
        }
        await studentsConfig.updateMany({ studentSession: req.body.session }, { studentAccess: true })
        await studentsConfig.updateOne({ studentId:"admin" }, { studentAccess: true })
        res.send('success')
    })
})
//讀取 session
router.post(process.env.ROUTER_ADMIN_READESESSION, async (req, res) => {
    await sessionconfig.find({}).then(response => {
        const returnData = []
        for (let session of response) {
            returnData.push({
                session: session.session,
                active: session.active,
            })
        }
        res.send(returnData)
    })
})
//讀取 monitor
router.post(process.env.ROUTER_ADMIN_READSTUDENTMONITOR, async (req, res) => {
    studentlistenconfig.findOne({studentId:req.body.studentId,sesion:req.body.session}).then(response=>{
        const returnData = []
        for (let listenConfig of response.studentMonitor){
            returnData.push({
                "學號":req.body.studentId,
                "時間":listenConfig.operationTime,
                "行為":listenConfig.operationName,
                "描述":listenConfig.operationIntro,
            })
        }
    })
})


module.exports = router