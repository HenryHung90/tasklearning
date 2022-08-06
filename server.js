const express = require('express');
const task = express();

//.env環境檔案
const dotenv = require('dotenv');
dotenv.config();
//cors 跨來源資源共用
const cors = require('cors');
task.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
}))
//設定port 與 host
const host = "127.0.0.1 "
const port = process.env.PORT || 3000
//用於解析json row txt URL-encoded格式
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false})
//bcrypt加密
const bcrypt = require("bcryptjs");
const saltRound = 15
//Mongodb
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Henry:yzuic1082020@task.o3vc0w3.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
},()=>{
    console.log("Connect to mongoDB")
})
//Router
const stageCheckRoutes = require('./router/stagecheckroutes')
const dashboardRoutes = require('./router/dashboardroutes')
const adminRoutes = require('./router/adminroutes')

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

//登入
task.post('/login',urlencodedParser,(req,res)=>{
    let isUserAccount = '1082020'
    let isUserPassword = '1082020'

    if(isUserAccount == req.body.Account && isUserPassword == req.body.Password){
        res.send(`/dashboard/${req.body.Account}`)
    }
})
//登出
task.get('/logout', (req, res) => {
    res.send("/")
})


//守門員用法use
task.use((req,res,next)=>{
    next()
})
//Stagepage
task.use('/dashboard',dashboardRoutes)
//stageCheck
task.use('/student/stage',stageCheckRoutes);
//admin
task.use('/admin',adminRoutes);

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