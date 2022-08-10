const passport = require('passport')
const localStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const studentConfig = require('../models/studentsconfig')

// passport.use('login', new localStrategy(
//     /**
//      * @params username = studentId
//      * @params password = studentPassword
//      * @params done 驗證完成後的函數，由passport調用
//      */
//     {
//         usernameField: 'studentId',
//         passwordField: 'studentPassword',
//         session:false
//     },
//     (username,password,done)=>{

//         studentConfig.findOne({ studentId: username},(err,user)=>{
//             if(err){
//                 console.log("passport error")
//                 return done(err)
//             }
//             if(!user){
//                 console.log("no user found")
//                 return done(null,false,{message:"無此用戶"})
//             }
//             let isValidPassword = function (user, password) {
//                 return bcrypt.compareSync(password, user.password)
//             }
//             if (isValidPassword(user,password)){
//                 console.log("password mismatch")
//                 return done(null,false,{message:"密碼錯誤"})
//             }
//             return done(null,user)
//         })
//     }
// ))

// //serializeUser 在登入成功後會將用戶數據存智seesion中
// //存到seesion中的將會是用戶的 Id 在這裡的user應為
// //localStrategy(function(){...}) 中回傳done的user
// passport.serializeUser((user,done)=>{
//     done(null,user._id)
// })
// passport.deserializeUser((user, done) => {
//     studentConfig.findOne({_id:user._id},(err,user)=>{
//         if(err){
//             return done(err)
//         }
//         done(null,user)
//     })
// })

// //封裝middleWare，需要時可以攔截未驗證用戶的請求
// passport.authenticateMiddleware = function authenticateMiddleware(){
//     return function (req,res,next){
//         if(req.isAuthenticated()){
//             return next()
//         }
//         res.redirect('/')
//     }
// }

module.exports = (passport) => {
    passport.use(
        new localStrategy((username, password, done) => {
            studentConfig.findOne({ studentId: username }, (err, user) => {
                if (err) {
                    console.log("passport error")
                    return done(err)
                }
                if (!user) {
                    console.log("no user found")
                    return done(null, false, { message: "無此用戶" })
                }
                bcrypt.compare(password, user.studentPassword, (err, result) => {
                    if (err) throw err
                    if (result) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "密碼錯誤" })
                    }
                })
            })
        })
    )
    passport.serializeUser((user, done) => {
        done(null,user._id)
    })
    passport.deserializeUser((id, done) => {
        studentConfig.findOne({ _id:id},(err,user)=>{
            done(err,user)
        })
    })
}