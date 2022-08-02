const express = require('express');
const task = express();

//.env環境檔案
const dotenv = require('dotenv');
dotenv.config();
//cors 跨來源資源共用
const cors = require('cors');
//設定port 與 host
const host = "127.0.0.1"
const port = process.env.PORT || 3000
//用於解析json row txt URL-encoded格式
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false})
//bcrypt加密
const bcrypt = require("bcryptjs");
const saltRound = 15

task.use(express.json())
//靜態物件取得從public
task.use(express.static('public'))
task.set("view engine","pug")

task.use(bodyParser.json());
task.use(urlencodedParser);
// task.use(
//     cors({
//         origin:process.env.CORS_ROUTER,
//         credentials:true,
//     })
// )

task.get('/',(req,res)=>{
    let isLogin = false
    if(isLogin == false){
        res.render('index')
    }else{
        res.render('error')
    }
})



// task.get('/:name',async(req,res)=>{
//     //params => /????
//     let myName = req.params.name;
//     //query => ?limit=
//     let limit = req.query.limit;
// })

//可以用此方式確認登入狀態
const login = (req,res,next)=>{
    console.log("登入狀態")
    next()
}
task.get('/user', login, (req, res) => {
    res.send("Is user")
})

task.post('/login',urlencodedParser,(req,res)=>{
    let isUserAccount = '1082020'
    let isUserPassword = '1082020'

    if(isUserAccount == req.body.Account && isUserPassword == req.body.Password){
        res.send(`/dashboard/${req.body.Account}`)
    }
})


//守門員用法use
task.use((req,res,next)=>{
    next()
})

//進入主畫面 學生
task.get('/dashboard/:user',(req,res)=>{
    let User = req.params.user.toString() + " 洪立恒";

    res.render('dashboard/student',{Id:User});
})
//Stagepage
task.get('/dashboard/:user/:page', (req, res) => {
    let User = req.params.user.toString() + " 洪立恒";

    res.render(`stagepage/${req.params.page}`, { Id: User });
})

//登出
task.get('/logout', (req, res) => {
    res.send("/")
})

//無此路由
task.use((req,res,next)=>{
    res.status(404).send("找不到");
})

//程式錯誤
task.use((err,req,res,next)=>{
    console.error(err.stack)
    res.status(500).send("程式有問題 請檢查")
})



task.listen(port,()=>{console.log("Server is runing at " + host + " : " + port)})