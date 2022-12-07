const express = require("express")
const task = express()

//.env環境檔案
const dotenv = require("dotenv")
dotenv.config()
//cors 跨來源資源共用
const cors = require("cors")
task.use(
    cors({
        origin: process.env.ROUTER_CORS,
        credentials: true,
    })
)
//設定port 與 host
const host = process.env.ROUTER_HOST
const port = process.env.ROUTER_PORT || 3000
//用於解析json row txt URL-encoded格式
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({ extended: false })
//mongodb
const mongoose = require("mongoose")
const mongodbconfig = require("./database/mongodb")

const mongoDbStatus = mongoose.connection
mongoDbStatus.on("error", err => console.error("connection error", err))
mongoDbStatus.once("open", db => console.log("Connection to mongodb"))

//express helmet
// const helmet = require("helmet")

// // //開啟DNS預讀取
// task.use(helmet({ dnsPrefetchControl: { allow: true } }))
// //CSP
// task.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             "script-src": [
//                 "https://code.jquery.com",
//                 "https://cdn.jsdelivr.net",
//                 "https://cdnjs.cloudflare.com",
//                 "http://ccj.infocom.yzu.edu.tw",
//             ],
//         },
//     })
// )

//passport
const passport = require("passport")
const session = require("express-session")
//引入passport的Model
const cookieParser = require("cookie-parser")
task.use(cookieParser())
//配置seesion passport
task.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

//初始化passport
task.use(passport.initialize())
task.use(passport.session())
require("./database/passportjs")(passport)

//Router
const stageCheckRoutes = require("./router/stagecheckroutes")
const dashboardRoutes = require("./router/dashboardroutes")
const adminRoutes = require("./router/adminroutes")
const studentRoutes = require("./router/studentroutes")

task.use(express.json())
//靜態物件取得從public
task.use(express.static("public"))
const path = require("path")
task.use(express.static(path.join(__dirname, "public")))
task.set("view engine", "pug")

task.use(bodyParser.json())
task.use(urlencodedParser)
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
const studentLearning = require("./models/studentlearningcontent")
const studentlistenconfig = require("./models/studentlistenconfig")
//登入
task.post(process.env.ROUTER_MAIN_LOGIN, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            res.send("/404")
            throw err
        }
        if (!user) {
            console.log(info.message)
            res.send(`${info.message}`)
        } else {
            req.logIn(user, async err => {
                if (err) throw err
                if (
                    await studentLearning.exists({
                        session: user.studentSession,
                        studentId: user.studentId,
                    })
                ) {
                    await studentLearning.updateOne(
                        {
                            session: user.studentSession,
                            studentId: user.studentId,
                        },
                        { learningTime: { accessTime: new Date() } }
                    )
                } else {
                    await studentLearning({
                        session: user.studentSession,
                        studentId: user.studentId,
                        learningTime: { accessTime: new Date() },
                    }).save()
                }

                res.send(`/dashboard/${req.body.username}`)
            })
        }
    })(req, res, next)
})

//登出
task.get(process.env.ROUTER_MAIN_LOGOUT, async (req, res, next) => {
    if (req.user != undefined) {
        let learningTotalTime = ""
        await studentLearning
            .findOne({
                session: req.user.studentSession,
                studentId: req.user.studentId,
            })
            .then(response => {
                const nowDate = new Date()
                const oldDate = response.learningTime.accessTime

                //s
                const hr = parseInt(parseInt((nowDate - oldDate) / 1000) / 3600)
                const min = parseInt(
                    (parseInt((nowDate - oldDate) / 1000) - hr * 3600) / 60
                )

                const sec = parseInt(
                    parseInt((nowDate - oldDate) / 1000) - hr * 3600 - min * 60
                )

                learningTotalTime = hr + " 時 " + min + " 分 " + sec + " 秒"
            })
        await studentlistenconfig
            .findOne({
                session: req.user.studentSession,
                studentId: req.user.studentId,
            })
            .then(async response => {
                if (response == null) {
                    const time = new Date()
                    const newListenerContent = new studentlistenconfig({
                        session: req.user.studentSession,
                        studentId: req.user.studentId,
                        studentMonitor: {
                            time: learningTotalTime,
                            operation: "學習",
                            item: "學習時間",
                            description: `在 ${
                                time.getFullYear() +
                                "/" +
                                time.getMonth() +
                                "/" +
                                time.getDate() +
                                " " +
                                time.getHours() +
                                ":" +
                                time.getMinutes() +
                                ":" +
                                time.getSeconds()
                            } 學習 共 ${learningTotalTime}`,
                        },
                    })

                    newListenerContent.save()
                } else {
                    const time = new Date()
                    const newData = [
                        ...response.studentMonitor,
                        {
                            time: learningTotalTime,
                            operation: "學習",
                            item: "學習時間",
                            description: `在 ${
                                time.getFullYear() +
                                "/" +
                                time.getMonth() +
                                "/" +
                                time.getDate() +
                                " " +
                                time.getHours() +
                                ":" +
                                time.getMinutes() +
                                ":" +
                                time.getSeconds()
                            } 學習 共 ${learningTotalTime}`,
                        },
                    ]

                    await studentlistenconfig.updateOne(
                        {
                            session: req.user.studentSession,
                            studentId: req.user.studentId,
                        },
                        { studentMonitor: newData }
                    )
                }
            })
        req.logout(err => {
            if (err) return next(err)
            res.send("/")
        })
    }
})

//守門員用法use
// task.use((req, res, next) => {
//     next()
// })
let isAuthenticated = function (req, res, next) {
    console.log(new Date(), req.user.studentId, req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/")
}

task.get("/", (req, res) => {
    if (req.user !== undefined) {
        res.redirect(`/dashboard/${req.user.studentId}`)
    } else {
        res.render("index")
    }
})
//Stagepage
task.use(process.env.ROUTER_MAIN_DASHBOARD, isAuthenticated, dashboardRoutes)
//stageCheck
task.use(
    process.env.ROUTER_MAIN_STUDENTSTAGE,
    isAuthenticated,
    stageCheckRoutes
)
//student
task.use(process.env.ROUTER_MAIN_STUDENT, isAuthenticated, studentRoutes)

//admin
task.use(process.env.ROUTER_MAIN_ADMIN, isAuthenticated, adminRoutes)

task.get('/dashboard/admin',isAuthenticated,async(req,res)=>{
    res.render('dashboard/admin')
})

task.get("/checkdata/:filename", async (req, res) => {
    res.sendFile(`${__dirname}/public/media/pdf/${req.params.filename}`)
})

// //無此路由
task.use((req, res, next) => {
    res.status(404).render('./404')
})
//維修路由
// task.use((req, res, next) => {
//     res.status(500).render('./500')
// })

//程式錯誤
task.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render('./500')
})

task.listen(port, () => {
    console.log("Server is runing at " + host + " : " + port)
})
