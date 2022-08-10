const express = require('express')
const router = express.Router()
const passport = require('passport')

const studentConfig = require('../models/studentsconfig')


router.get('/:user/:week/:page', (req, res) => {
    let Id = req.params.user.toString()
    let Week = "Week " + req.params.week;

    studentConfig.findOne({ studentId: Id }).then((response) => {
        if (response == undefined || response == null) {
            res.status(404).send("無此用戶")
        }
        User = response.studentName
    }).then(() => {
        res.render(`stagepage/${req.params.page}`, { Id: Id, User: User, Week: Week });
    })

})
//進入主畫面 學生
router.get('/:user', (req, res) => {
    let Id = req.params.user.toString()
    let User , Week 

    studentConfig.findOne({studentId:Id}).then((response)=>{
        if (response == undefined || response == null) {
            res.status(404).send("無此用戶")
        }
        User = response.studentName
        Week = "Week 3"
    }).then(()=>{
        res.render('dashboard/student', { Id: Id, User: User, Week: Week });
    })
})


module.exports = router;