const express = require('express');
const task = express();

//.env環境檔案
const dotenv = require('dotenv');
dotenv.config();
//cors 跨來源資源共用
const cors = require('cors');
task.use(cors({
    origin: 'process.env.ROUTER_CORS',
    credentials: true,
}))
//設定port 與 host
const host = process.env.ROUTER_HOST
const port = process.env.PORT || 3000
//用於解析json row txt URL-encoded格式
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
//mongodb
const mongoose = require('mongoose');
const mongodbconfig = require('./database/mongodb')

const mongoDbStatus = mongoose.connection
mongoDbStatus.on('error', err => console.error('connection error', err))
mongoDbStatus.once('open', (db) => console.log('Connection to mongodb'))

//passport
const passport = require('passport')
const session = require('express-session')
//引入passport的Model
const cookieParser = require('cookie-parser')
task.use(cookieParser())
//配置seesion passport
task.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

//初始化passport
task.use(passport.initialize())
task.use(passport.session())
require('./database/passportjs')(passport)


//Router
const stageCheckRoutes = require('./router/stagecheckroutes')
const dashboardRoutes = require('./router/dashboardroutes')
const adminRoutes = require('./router/adminroutes')
const studentRoutes = require('./router/studentroutes')


task.use(express.json())
//靜態物件取得從public
task.use(express.static('public'))
task.set("view engine", "pug")

task.use(bodyParser.json());
task.use(urlencodedParser);
// task.use(
//     cors({
//         origin:process.env.CORS_ROUTER,
//         credentials:true,
//     })
// )

// task.get('/:name',async(req,res)=>{
//     //params => /????
//     let myName = req.params.name;
//     //query => ?limit=
//     let limit = req.query.limit;
// })

//可以用此方式確認登入狀態
// const login = (req, res, next) => {
//     console.log("登入狀態")
//     next()
// }
// task.get('/user', login, (req, res) => {
//     res.send("Is user")
// })

//登入
task.post(process.env.ROUTER_MAIN_LOGIN, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err
        if (!user) {
            res.send("login failed")
        }
        else {
            req.logIn(user, (err) => {
                if (err) throw err
                res.send(`/dashboard/${req.body.username}`)
            })
        }
    })(req, res, next)
})
task.get('/', (req, res) => {
    res.render('index')
})
//登出
task.get(process.env.ROUTER_MAIN_LOGOUT, (req, res,next) => {
    req.logout((err)=>{
        if(err)return next(err)
        res.send('/')
    })
})


//守門員用法use
// task.use((req, res, next) => {
//     next()
// })
let isAuthenticated = function (req, res, next) {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}
//Stagepage
task.use(process.env.ROUTER_MAIN_DASHBOARD,/*isAuthenticated,*/ dashboardRoutes)
//stageCheck
task.use(process.env.ROUTER_MAIN_STUDENTSTAGE, /*isAuthenticated,*/ stageCheckRoutes);
//students
task.use(process.env.ROUTER_MAIN_STUDENT, /*isAuthenticated,*/ studentRoutes)
//admin
task.use(process.env.ROUTER_MAIN_ADMIN, adminRoutes);


//無此路由
task.use((req, res, next) => {
    res.status(404).send("找不到");
})

//程式錯誤
task.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("程式有問題 請檢查")
})



task.listen(port, () => { console.log("Server is runing at " + host + " : " + port) })