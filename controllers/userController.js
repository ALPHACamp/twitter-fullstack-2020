const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const { Op } = require("sequelize")

const userController = {
    signUpPage: (req, res) => {
        return res.render('regist')
    },

    signUp: (req, res, next) => {
        // 驗證兩次密碼相同，密碼不同導回註冊頁
        if (req.body.password !== req.body.passwordConfirmed) {
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/users/register')
        }
        // 驗證 db 中帳號有無註冊過，有導回註冊頁，沒有 db 寫入資料
        User.findOne({
            where: {
                // https://sequelize.org/master/manual/model-querying-basics.html
                [Op.or]: [
                    { email: req.body.email },
                    { account: req.body.account }
                ]
            }
        })
            .then(user => {
                if (user) {
                    req.flash('error_messages', '「帳號已重覆註冊！」或「email 已重覆註冊！」')
                    return res.redirect('/users/register')
                } else if (req.body.name.length > 50) {
                    req.flash('error_messages', '「名字上限50字 請重新輸入！」')
                    return res.redirect('/users/register')
                } else {
                    User.create({
                        account: req.body.name,
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                    })
                }
            })
            .then(() => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/users/login')
            })
            .catch(next) 
    },

    signInPage: (req, res) => {
        return res.render('login')
    },  

    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/users/setting/:id')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/user/login')
    },

    getSetting: (req, res) => {
        return res.render('setting')
    },
}

module.exports = userController