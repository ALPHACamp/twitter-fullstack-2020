const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User //input the user schema
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {

    ////////
    // login
    ////////
    signInPage: (req, res) => {
        return res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/tweets')
    },

    signUpPage: (req, res) => {
        return res.render('signup')
    },
    signUp: (req, res) => {
        // confirm password
        if (req.body.checkPassword !== req.body.password) {
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/signup')
        } else {
            // confirm unique user
            User.findOne({ where: { email: req.body.email } }).then(mailuser => {
                if (mailuser) {
                    req.flash('error_messages', '信箱重複！')
                    return res.redirect('/signup')
                } else {
                    User.findOne({ where: { account: req.body.account } }).then(user => {
                        if (user) {
                            req.flash('error_messages', '帳號重複！')
                            return res.redirect('/signup')
                        } else {
                            User.create({
                                name: req.body.name,
                                account: req.body.account,
                                email: req.body.email,
                                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                            }).then(user => {
                                req.flash('success_messages', '成功註冊帳號！')
                                return res.redirect('/signin')
                            })
                        }
                    })
                }
            })
        }
    },

    ////////
    // setting
    ////////
    getSetting: (req, res) => {
        return res.render('setting')
    },
    updateSetting: (req, res) => {

        if (!req.body.account) {
            req.flash('error_messages', "account didn't exist")
            return res.redirect('back')
        }

        if (!req.body.name) {
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }

        if (!req.body.email) {
            req.flash('error_messages', "email didn't exist")
            return res.redirect('back')
        }

        if (req.body.password !== req.body.checkPassword) {
            req.flash('error_messages', "兩次密碼輸入不同！")
            return res.redirect('back')
        }

        User.findOne({ where: { id: { [Op.ne]: req.user.id }, email: req.body.email } }).then(mailuser => {
            if (mailuser) {
                req.flash('error_messages', '信箱重複！')
                return res.redirect('back')
            } else {
                User.findOne({ where: { id: { [Op.ne]: req.user.id }, account: req.body.account } }).then(user => {
                    if (user) {
                        req.flash('error_messages', '帳號重複！')
                        return res.redirect('back')
                    } else {
                        if (!req.body.password) {
                            return User.findByPk(req.user.id)
                                .then((user) => {
                                    user.update({
                                        account: req.body.account,
                                        name: req.body.name,
                                        email: req.body.email,
                                    })
                                        .then((user) => {
                                            req.flash('success_messages', 'setting infomation was successfully to update')
                                            res.redirect('setting')
                                        })
                                })
                        } else {
                            return User.findByPk(req.user.id)
                                .then((user) => {
                                    user.update({
                                        account: req.body.account,
                                        name: req.body.name,
                                        email: req.body.email,
                                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                                    })
                                        .then((user) => {
                                            req.flash('success_messages', 'setting infomation was successfully to update')
                                            res.redirect('setting')
                                        })
                                })
                        }
                    }
                })
            }
        })
    },

    //////////////
    //Profile
    //////////////
    getUserProfile: async (req, res) => {
        let profileUser = await User.findByPk(req.params.id, {
            include: [
                { model: Reply, include: [Tweet] },
                { model: Tweet, include: [User, Like, Reply] },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ]
        })
        profileUser = profileUser.dataValues
        const isFollowed = req.user.Followings.map(d => d.id).includes(profileUser.id)
        return res.render('userProfile', { profileUser, isFollowed })
    },
}

module.exports = userController