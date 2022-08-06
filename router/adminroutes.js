const express = require('express')
const router = express.Router()


router.post('/addstudent',async (req,res)=>{
    console.log(req.body);
    res.send("success")
})


module.exports = router