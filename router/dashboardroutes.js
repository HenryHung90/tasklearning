const express = require('express')
const router = express.Router()

router.get('/:user/:week/:page', (req, res) => {
    let Id = req.params.user.toString()
    let User = "洪立恒"
    let Week = "Week " + req.params.week;

    if (req.params.user !== '1082020') {
        res.status(404).send("找不到");
    }

    res.render(`stagepage/${req.params.page}`, { Id: Id, User: User, Week: Week });
})
//進入主畫面 學生
router.get('/:user', (req, res) => {
    let Id = req.params.user.toString()
    let User = "洪立恒"
    let Week = "Week " + 3;

    if (req.params.user !== '1082020') {
        res.status(404).send("找不到");
    }

    res.render('dashboard/student', { Id: Id, User: User, Week: Week });
})


module.exports = router;