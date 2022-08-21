const express = require('express')
const router = express.Router()

const studentConfig = require('../models/studentsconfig')

//從資料庫抓取學生Detail
async function findStudentDetail(studentId) {
    let studentDetail
    await studentConfig.findOne({ studentId: studentId }).then(response => {
        studentDetail = response.studentDetail
    })
    return studentDetail
}

//更新資料庫
async function updateStudentDetail(studentId, uploadData) {
    let isSuccess = false
    await studentConfig.updateOne({ studentId: studentId }, {
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
            if(data[week].Status.Response === 1){
                data[week].Status.Response = 2
            }
            break
    }
    return data
}

//完整更新stage function
const studentStageComplete = async (studentId, changeWeek, stage) => {

    //儲存更改之week
    const weekTemp = changeWeek.split(" ")
    const week = parseInt(weekTemp[1]) - 1

    //存取studentDetil
    let studentDetail
    //查找目前雲端之studentDetail
    await findStudentDetail(studentId).then(cloudData => { studentDetail = cloudData })

    //更新stage狀態
    const localData = editStudentDetailStage(studentDetail, week, stage)

    if (updateStudentDetail(studentId, localData)) {
        return `/dashboard/${studentId}`
    } else {
        return 'upload failed'
    }
}


router.post(process.env.ROUTER_STUDENTSTAGE_CHECK, async (req, res) => {
    studentConfig.findOne({ studentId: req.body.studentId }).then(response => {
        res.send(response.studentDetail)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_DATACHECK, async (req, res) => {
    studentStageComplete(req.body.studentId, req.body.week,"Data").then(response=>{
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_MISSIONCHECK, async (req, res) => {
    studentStageComplete(req.body.studentId, req.body.week, "Mission").then(response => {
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_MANAGECHECK, async (req, res) => {
    studentStageComplete(req.body.studentId, req.body.week, "Manage").then(response => {
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_MINDINGCHECK, async (req, res) => {
    studentStageComplete(req.body.studentId, req.body.week, "Minding").then(response => {
        res.send(response)
    })
})

router.post(process.env.ROUTER_STUDENTSTAGE_RESPONSECHECK, async (req, res) => {
    studentStageComplete(req.body.studentId, req.body.week, "Response").then(response => {
        res.send(response)
    })
})

module.exports = router;