const express = require('express')
const router = express.Router()

router.post('/datacomplete',async(req,res)=>{
    console.log(req.body.Id);
    res.send(`/dashboard/${req.body.Id}`)
})

router.post('/missioncomplete', async (req, res) => {
    console.log(req.body.Id);
    res.send(`/dashboard/${req.body.Id}`)
})

router.post('/managecomplete', async (req, res) => {
    console.log(req.body.Id);
    res.send(`/dashboard/${req.body.Id}`)

})

router.post('/mindingcomplete', async (req, res) => {
    console.log(req.body.Id);
    res.send(`/dashboard/${req.body.Id}`)

})

router.post('/responsecomplete', async (req, res) => {
    console.log(req.body.Id);
    res.send(`/dashboard/${req.body.Id}`)
})

module.exports = router;