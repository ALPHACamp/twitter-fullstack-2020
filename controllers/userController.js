const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Followship = db.Followship

const userController = {
    getSignUpPage: (req, res) => {
        return res.render('signup')
    },

    postSignUp: (req, res) => {
        console.log(req.body)
        if (req.body.passwordCheck !== req.body.password) {
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/signup')
        } else {
            User.findOne({ where: { email: req.body.email } }).then(user => {
                if (user) {
                    req.flash('error_messages', '信箱重複！')
                    return res.redirect('/signup')
                } else {
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                        account: '@' + req.body.name
                    }).then(user => {
                        req.flash('success_messages', '成功註冊帳號！')
                        return res.redirect('/signin')
                    })
                }
            })
        }
    },

    getSignInPage: (req, res) => {
        return res.render('signin')
    },
    postSignIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/tweets')
    },

    getlogout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')
    },




    addFollowing: (req, res) => {
        return Followship.create({
            followerId: req.user.id,
            followingId: req.params.userId
        }).then((followship) => {
            return res.redirect('back')
        })
    },

    removeFollowing: (req, res) => {
        return Followship.findOne({
            where: {
                followerId: req.user.id,
                followingId: req.params.userId
            }
        }).then((followship) => {
            followship.destroy()
                .then((followship) => {
                    return res.redirect('back')
                })
        })
    },

    getSetting: (req, res) => {
        return User.findByPk(req.user.id).then(user => {

            return res.render('setting', { user: user.toJSON() })
        })
    },

    postSetting: (req, res) => {
        // console.log(req.body)
        // console.log(req.user)
        return User.findByPk(req.user.id).then(user => {
            console.log(user)
            user.update({
                name: req.body.name,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
                return res.redirect('back')
            })

        })

    }






}


module.exports = userController