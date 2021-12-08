const bcrypt = require('bcryptjs')
const { test } = require('mocha')
const db = require('../models')
const user = require('../models/user')
const User = db.User
const Followship = db.Followship
const Tweet = db.Tweet
const Like = db.Like
const moment = require('moment')
const Reply = db.Reply
const fs = require('fs')


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
            User.findOne({
                where: {
                    email: req.body.email,
                }
            }).then(user => {

                if (user) {
                    req.flash('error_messages', '信箱重複！')
                    return res.redirect('/signup')
                } else {
                    User.findOne({
                        where: {
                            account: '@' + req.body.account
                        }
                    }).then(user => {
                        if (user) {
                            req.flash('error_messages', '帳號重複！')
                            return res.redirect('/signup')
                        } else {
                            if (req.body.name.length > 50) {
                                req.flash('error_messages', '名稱不能大於50個字')
                                return res.redirect('/signup')
                            } else {
                                User.create({
                                    name: req.body.name,
                                    email: req.body.email,
                                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                                    account: '@' + req.body.account,
                                    avatar: 'https://www.nicepng.com/png/full/136-1366211_group-of-10-guys-login-user-icon-png.png'
                                }).then(user => {
                                    req.flash('success_messages', '成功註冊帳號！')
                                    return res.redirect('/signin')
                                })
                            }


                        }
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
            if (req.body.name.length > 50) {
                req.flash('error_messages', '名稱不能大於50個字')
                return res.redirect('back')
            } else {
                user.update({
                    name: req.body.name,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                }).then(user => {
                    return res.redirect('back')
                })
            }


        })

    },

    getUserSelf: (req, res) => {
        const tweetFindAll = Tweet.findAll({
            order: [['createdAt', 'DESC']],
            where: { UserId: req.user.id },
            include: [User,
                { model: Reply, include: [Tweet] },
                { model: User, as: 'LikedUsers' }
            ]
        })

        const userFindAll = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })


        Promise.all([tweetFindAll, userFindAll])
            .then(responses => {
                let tweets = responses[0]
                let users = responses[1]
                users = users.map(user => ({

                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }))
                // 依追蹤者人數排序清單
                // console.log(users)

                users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

                tweets = tweets.map(tweet => ({
                    ...tweet.dataValues,
                    isLikedTweet: req.user.LikedTweets.map(d => d.id).includes(tweet.id),
                    reliesCount: tweet.Replies.length,
                    likeCount: tweet.LikedUsers.length
                }))



                // console.log(tweets)
                // console.log('==============================')
                // console.log(replies)
                return res.render('user', { tweets, users })
            }).catch(error => {
                console.log(error)
            })

    },

    getFollowers: (req, res) => {
        const usersFindAll = User.findAll({
            include: [
                { model: User, as: 'Followers' },
            ]
        })

        let userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })


        Promise.all([usersFindAll, userFindAll2])
            .then(responses => {
                let users = responses[0]
                let users2 = responses[1]
                users = users.map(user => ({
                    ...user.dataValues,
                    isFollowed: req.user.Followers.map(d => d.id).includes(user.id),
                    followersTime: req.user.Followers.filter(d => { return (d.id === user.id) })
                }))

                users2 = users2.map(user => ({
                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }))
                // 依追蹤者人數排序清單
                users2 = users2.sort((a, b) => b.FollowerCount - a.FollowerCount)

                let noCreatedAt = []
                let sortCreatedAt = []
                users.forEach(user => {
                    if (user.followersTime.length > 0) {
                        user.followersTime = user.followersTime[0].Followship.createdAt
                        sortCreatedAt.push(user)
                    } else {
                        user.followersTime = ''
                        noCreatedAt.push(user)
                    }
                })

                sortCreatedAt = sortCreatedAt.sort((a, b) => b.followersTime - a.followersTime)

                users = sortCreatedAt.concat(noCreatedAt)

                return res.render('follower', { users, users2 })
            }).catch(error => {
                console.log(error)
            })
    },


    getFollowings: (req, res) => {
        let usersFindAll = User.findAll({
            include: [
                { model: User, as: 'Followings' },
            ],
        })
        let userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })

        Promise.all([usersFindAll, userFindAll2])
            .then(responses => {
                let users = responses[0]
                let users2 = responses[1]
                users = users.map(user => ({
                    ...user.dataValues,
                    isFollowings: req.user.Followings.map(d => d.id).includes(user.id),
                    followingsTime: req.user.Followings.filter(d => { return (d.id === user.id) })
                }))

                users2 = users2.map(user => ({
                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }))
                // 依追蹤者人數排序清單
                users2 = users2.sort((a, b) => b.FollowerCount - a.FollowerCount)

                let noCreatedAt = []
                let sortCreatedAt = []
                users.forEach(user => {
                    if (user.followingsTime.length > 0) {
                        user.followingsTime = user.followingsTime[0].Followship.createdAt
                        sortCreatedAt.push(user)
                    } else {
                        user.followingsTime = ''
                        noCreatedAt.push(user)
                    }
                })

                sortCreatedAt = sortCreatedAt.sort((a, b) => b.followingsTime - a.followingsTime)


                users = sortCreatedAt.concat(noCreatedAt)

                return res.render('following', { users, users2 })
            }).catch(error => {
                console.log(error)
            })

    },

    getLike: (req, res) => {
        const tweetFindAll = Tweet.findAll({
            include: [
                User,
                { model: User, as: 'LikedUsers' },
                { model: Reply }
            ]
        })
        let userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })

        Promise.all([tweetFindAll, userFindAll2])
            .then(responses => {
                let liked = responses[0]
                let users2 = responses[1]
                // console.log(likedTweets)
                liked = liked.map(likedTweet => ({
                    ...likedTweet.dataValues,
                    isLikedTweet: req.user.LikedTweets.map(d => d.id).includes(likedTweet.id)
                }))

                users2 = users2.map(user => ({
                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }))
                // 依追蹤者人數排序清單
                users2 = users2.sort((a, b) => b.FollowerCount - a.FollowerCount)


                console.log(liked)
                return res.render('userLike', { likedTweets: liked, users2 })
            }).catch(error => {
                console.log(error)
            })

    },

    getTweetReply: (req, res) => {
        const replyFindAll = Reply.findAll({
            raw: true,
            nest: true,
            where: { userId: req.user.id },
            include: [
                User,
                { model: Tweet, include: [User] }
            ]
        })
        const userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })

        Promise.all([replyFindAll, userFindAll2])
            .then(responses => {

                const replies = responses[0]
                let users2 = responses[1]

                users2 = users2.map(user => ({
                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }))
                users2 = users2.sort((a, b) => b.FollowerCount - a.FollowerCount)

                return res.render('userReplies', { replies, users2 })
            }).catch(error => {
                console.log(error)
            })




    },

    getUserApi: (req, res) => {
        const userId = req.params.id
        User.findByPk(userId)
            .then(user => {
                console.log(user)
                return res.json({ status: 'success', data: user })
            })
            .catch(error => {
                console.log(error)
            })
    },

    putUserApi: (req, res) => {
        console.log('==============================')
        // const userId = req.params.id
        // console.log(userId)
        // console.log(req.body)
        // console.log(req.file)
        // console.log(req.files)
        console.log('==============================')
        const { files } = req
        console.log(files)
        if (files.length > 0) {
            const avatar = files[1]
            const cover = files[0]
            if (avatar) {
                fs.readFile(avatar.path, (err, data) => {
                    if (err) console.log('Error: ', err)
                    fs.writeFile(`upload/${avatar.originalname}`, data, () => {
                        return User.findByPk(req.params.id)
                            .then(user => {
                                user.update({
                                    name: req.body.name,
                                    avatar: avatar ? `/upload/${avatar.originalname}` : user.avatar,
                                    cover: req.body.cover,
                                    introduction: req.body.introduction
                                }).then(user => {
                                    // return res.json({ status: 'success', data: user })
                                    console.log('成功寫入 avatar')
                                    // return res.redirect('back')
                                }).catch(error => {
                                    console.log(error)
                                })
                            })
                    })
                })
            }

            if (cover) {
                fs.readFile(cover.path, (err, data) => {
                    if (err) console.log('Error: ', err)
                    fs.writeFile(`upload/${cover.originalname}`, data, () => {
                        return User.findByPk(req.params.id)
                            .then(user => {
                                user.update({
                                    name: req.body.name,
                                    avatar: req.body.avatar,
                                    cover: cover ? `/upload/${cover.originalname}` : user.cover,
                                    introduction: req.body.introduction
                                }).then(user => {
                                    // return res.json({ status: 'success', data: user })
                                    console.log('成功寫入 cover')
                                    return res.redirect('back')
                                }).catch(error => {
                                    console.log(error)
                                })
                            })
                    })
                })
            }

        } else {
            return User.findByPk(req.params.id)
                .then(user => {
                    user.update({
                        name: req.body.name,
                        avatar: user.avatar,
                        cover: req.body.cover,
                        introduction: req.body.introduction
                    }).then(user => {
                        // return res.json({ status: 'success', data: user })
                        return res.redirect('back')
                    }).catch(error => {
                        console.log(error)
                    })
                })
        }
    }








}


module.exports = userController