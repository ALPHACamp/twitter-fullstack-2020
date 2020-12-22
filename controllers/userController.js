const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const axios = require('axios')
const helpers = require('../_helpers')


const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User //input the user schema
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
// const imgur = require('imgur')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

// 

// '386b8dce07c07a9'

const userController = {

    ////////
    // login
    ////////
    signInPage: (req, res) => {
        return res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/user/11')
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
                                            req.flash('success_messages', 'setting information was successfully to update')
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
        console.log(profileUser)
        profileUser = profileUser.dataValues
        const isFollowed = req.user.Followings.map(d => d.id).includes(profileUser.id)

        const id = helpers.getUser(req).id

        axios.get(`http://localhost:3000/api/users/${id}`)
            .then(function (response) {
                // 1.handle success
                console.log(response)
                let data = response.data
                return data
            })
            .catch(function (error) {
                // 2.handle error
                console.log(error)
            })
            .then(data => { return res.render('userProfile', { profileUser, isFollowed, data }) })

    },
    // updateProfile: (req, res) => {
    //     const { name, introduction } = req.body
    //     const id = helpers.getUser(req).id
    //     //找出圖片的link
    //     let fileLink = ""
    //     const { files } = req
    //     let file = ""
    //     let fieldName = ""
    //     if (files) {
    //         fieldName = Object.keys(files)[0];
    //         if (fieldName === 'avatar') {      //判斷檔案是avatar或cover
    //             file = files.avatar[0]
    //         } else {
    //             file = files.cover[0]
    //         }
    //     }
    //     imgur.setClientID(process.env.IMGUR_CLIENT_ID);
    //     imgur.upload(file.path, (err, img) => {
    //         fileLink = img.data.link
    //         console.log(`===============`)
    //         console.log(fileLink)
    //     })
    //     //串ＡＰＩ
    //     axios({
    //         method: 'post',
    //         url: `http://localhost:3000/api/users/${id}`,
    //         headers: {
    //             'Content-type': "application/json"
    //         },
    //         data: {
    //             'name': req.body.name,
    //             'introduction': req.body.introduction,
    //             'avatar': fieldName === 'avatar' ? fileLink : helpers.getUser(req).avatar,
    //             'cover': fieldName === 'cover' ? fileLink : helpers.getUser(req).cover
    //         }
    //     }).then(function (response) {
    //         console.log(response)
    //     }).catch(function (error) {
    //         console.log(error)
    //     }).then(data => { return res.redirect(`/user/${id}`) })


    // },

    updateProfile: (req, res) => {
        const { name, introduction } = req.body
        const id = helpers.getUser(req).id
        const { files } = req

        if (files) {
            const fieldName = Object.keys(files)[0];
            let file = ""
            if (fieldName === 'avatar') {      //判斷檔案是avatar或cover
                file = files.avatar[0]
            } else {
                file = files.cover[0]
            }
            imgur.setClientID(process.env.IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
                console.log(img)
                return User.findByPk(id)
                    .then((user) => {
                        user.update({
                            cover: file.fieldname === "cover" ? img.data.link : user.cover,
                            avatar: file.fieldname === "avatar" ? img.data.link : user.avatar,
                            name: user.name,
                            introduction: user.introduction
                        })
                            .then((user) => {
                                return res.redirect(`/user/${id}`)
                            }).catch(err => console.log(err))
                    })
            })
        }
        else {
            return User.findByPk(id)
                .then(user => {
                    user.update({
                        cover: user.cover,
                        avatar: user.avatar,
                        name: name ? name : user.name,
                        introduction: introduction ? introduction : user.introduction
                    }).then((user) => {
                        return res.redirect(`/user/${id}`)
                    }).catch(err => console.log(err))
                })
        }
    },

    deleteImage: (req, res) => {
        const id = helpers.getUser(req).id
        const { cover, avatar } = req.body
        const image = cover || avatar

        User.findByPk(id)
            .then(user => {
                user.update({ image: null })
                return res.redirect(`/user/${id}`)
            })


    }
}




module.exports = userController