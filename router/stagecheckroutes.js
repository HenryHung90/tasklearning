const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../database/passportjs')(passport)

const studentConfig = require('../models/studentsconfig')

//從資料庫抓取學生Detail
async function findStudentDetail(studentId, studentSession) {
    let studentDetail
    await studentConfig.findOne({ studentSession: studentSession, studentId: studentId }).then(response => {
        studentDetail = response.studentDetail
    })
    return studentDetail
}

//更新資料庫
async function updateStudentDetail(studentId, studentSession, uploadData) {
    let isSuccess = false
    await studentConfig.updateOne({ studentSession: studentSession, studentId: studentId }, {
        studentDetail: uploadData
    }).then((err, result) => {
        if (err) isSuccess == err
        else isSuccess = true
    })
    return true
}

//更改stage狀態
function editStudentDetailStage(data, week, stage) {

    switch (stage) {
        case "Data":
            data[week].Status.Data = true
            break
        case "Mission":
            data[week].Status.Mission = true
            break
        case "Manage":
            data[week].Status.Manage = true
            break
        case "Minding":
            data[week].Status.Minding = true
            break
        case "Response":
            if (data[week].Status.Response == 1) {
                data[week].Status.Response = 2
            }
            break
    }
    return data
}

//完整更新stage function
const studentStageComplete = async (studentId, studentSession, changeWeek, stage) => {

    //儲存更改之week
    const weekTemp = changeWeek.split(" ")
    const week = parseInt(weekTemp[1]) - 1

    //存取studentDetil
    let studentDetail
    //查找目前雲端之studentDetail
    await findStudentDetail(studentId, studentSession).then(cloudData => { studentDetail = cloudData })

    //更新stage狀態
    const localData = editStudentDetailStage(studentDetail, week, stage)

    if (updateStudentDetail(studentId, studentSession, localData)) {
        return `/dashboard/${studentId}`
    } else {
        return 'upload failed'
    }
}

//檢查Student 的 Stage 狀態
router.post(process.env.ROUTER_STUDENTSTAGE_CHECK, async (req, res) => {
    studentConfig.findOne({ studentSession: req.user.studentSession, studentId: req.user.studentId }).then(response => {
        res.send(response.studentDetail)
    })
})

//動過 Mission 之後 重新設定 Mission Manage Minding 之State
router.post(process.env.ROUTER_STUDENTSTAGE_MISSIONUNCHECK, async (req, res) => {
    //存取studentDetil
    let studentDetail
    let isSuccess = false
    //查找目前雲端之studentDetail
    await findStudentDetail(req.user.studentId, req.user.studentSession).then(cloudData => { studentDetail = cloudData })
    if (studentDetail[req.body.week - 1].Status.Manage = false) {
        res.send(true)
    } else {
        studentDetail[req.body.week - 1].Status.Mission = false
        studentDetail[req.body.week - 1].Status.Manage = false
        studentDetail[req.body.week - 1].Status.Minding = false

        await studentConfig.updateOne({ studentId: req.user.studentId }, {
            studentDetail: studentDetail
        }).then((result) => {
            isSuccess = result.acknowledged
        })
        res.send(isSuccess)
    }

})

//各項任務階段的Check動作
router.post(process.env.ROUTER_STUDENTSTAGE_DATACHECK, async (req, res) => {
    studentStageComplete(req.user.studentId, req.user.studentSession, req.body.week, "Data").then(response => {
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_MISSIONCHECK, async (req, res) => {
    studentStageComplete(req.user.studentId, req.user.studentSession, req.body.week, "Mission").then(response => {
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_MANAGECHECK, async (req, res) => {
    studentStageComplete(req.user.studentId, req.user.studentSession, req.body.week, "Manage").then(response => {
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_MINDINGCHECK, async (req, res) => {
    studentStageComplete(req.user.studentId, req.user.studentSession, req.body.week, "Minding").then(response => {
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_RESPONSECHECK, async (req, res) => {
    studentStageComplete(req.user.studentId, req.user.studentSession, req.body.week, "Response").then(response => {
        res.send(response)
    })
})

module.exports = router;