const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const studentsConfig = require('../models/studentsconfig')



router.post('/addstudent',async (req,res)=>{   
    const saltRound = 15
    bcrypt.hash(req.body.studentPassword, saltRound,(err,hashedPassword)=>{
        const studentDetailInit = new Array()
        const availableWeek = 7

        for(let i = 1;i<= availableWeek;i++){
            studentDetailInit.push({
                Week: i ,
                Status:{
                    Data:false,
                    Mission:false,
                    Manage:false,
                    Minding:false,
                    Response:false
                }
            })
        }

        const newStudent = new studentsConfig({
            studentId: req.body.studentId,
            studentPassword: hashedPassword,
            studentName:req.body.studentName,
            studentEmail: req.body.studentEmail,
            studentDetail: studentDetailInit
        })
        newStudent.save()
        res.send('success')
    })
        

    
})


module.exports = router