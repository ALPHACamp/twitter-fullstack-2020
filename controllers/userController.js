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
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '244d29ed093c092'
const _helpers = require('../_helpers')


const userController = {
    getSignUpPage: (req, res) => {
        return res.render('signup')
    },

    postSignUp: (req, res) => {
        if (req.body.checkPassword !== req.body.password) {
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
                            account: req.body.account
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
                                    account: req.body.account,
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

        if (_helpers.getUser(req).id === Number(req.body.id)) {
            return res.json({ status: 'error', message: '不可以跟隨自己' })
        } else {
            return Followship.create({
                followerId: _helpers.getUser(req).id,
                followingId: req.body.id
            }).then((followship) => {
                return res.redirect('back')
            })
        }

    },

    removeFollowing: (req, res) => {
        return Followship.findOne({
            where: {
                followerId: _helpers.getUser(req).id,
                followingId: req.params.id
            }
        }).then((followship) => {
            followship.destroy()
                .then((followship) => {
                    return res.redirect('back')
                })
        })
    },

    getSetting: (req, res) => {
        return User.findByPk(_helpers.getUser(req).id).then(user => {

            return res.render('setting', { user: user.toJSON() })
        })
    },

    postSetting: (req, res) => {
        // console.log(req.body)
        // console.log(req.user)
        return User.findByPk(_helpers.getUser(req).id).then(user => {
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

        console.log('進入個人資料頁....')
        const tweetFindAll = Tweet.findAll({
            order: [['createdAt', 'DESC']],
            where: { UserId: req.params.id },
            include: [User,
                { model: Reply, include: [Tweet] },
                { model: User, as: 'LikedUsers' },
            ]
        })

        const userFindAll = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ],
            where: { role: '0' }

        })

        const requestUser = User.findByPk(req.params.id, {
            include: [
                { model: Tweet, as: 'LikedTweets' },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ]
        })


        Promise.all([tweetFindAll, userFindAll, requestUser])
            .then(responses => {

                let [tweets, users, requestUser] = responses

                users = users.map(user => ({

                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: _helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    isNotCurrentUser: !(user.id === _helpers.getUser(req).id)
                }))

                // 依追蹤者人數排序清單

                users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

                tweets = tweets.map(tweet => ({
                    ...tweet.dataValues,
                    reliesCount: tweet.Replies.length,
                    likeCount: tweet.LikedUsers.length,
                    isLikedTweet: tweet.LikedUsers.map(d => d.id).includes(_helpers.getUser(req).id)

                }))

                if (_helpers.getUser(req).id === requestUser.toJSON().id) {
                    requestUser.dataValues.isUser = true
                } else {
                    requestUser.dataValues.isUser = false
                }

                requestUser.dataValues.isFollowing = requestUser.toJSON().Followers.map(d => d.id).includes(_helpers.getUser(req).id)

                return res.render('user', { tweets, users, requestUser: requestUser.toJSON() })

            }).catch(error => {
                console.log(error)
            })

    },

    getFollowers: (req, res) => {
        const id = req.params.id
        const usersFindAll = User.findAll({
            include: [
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ],
            where: { role: '0' }
        })

        let userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ],
            where: { role: '0' }
        })
        const requestUser = User.findByPk(id, {
            include: [
                Tweet,
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ],
            where: { role: '0' }
        })

        Promise.all([usersFindAll, userFindAll2, requestUser])
            .then(responses => {
                let [allUsers, getTopFollowing, requestUser] = responses
                // ===== 重新整理Followers Start ===== //
                allUsers = allUsers.map(user => ({
                    ...user.dataValues,
                    // 是否被當前請求的使用者跟隨
                    isFollowed: user.dataValues.Followings.map(d => d.id).includes(requestUser.id),
                    // 當前請求的使用者跟隨人數
                    FollowingsCount: user.dataValues.Followings.length,
                    // 當前請求的使用者跟隨者跟隨開始時間
                    followersTime: user.dataValues.Followers.filter(d => { return (d.id === requestUser.id) }),
                    // 判斷使用者是否為當前請求的使用者
                    isNotCurrentUser: !(user.id === requestUser.id)
                }))
                // ===== 重新整理Followers End ===== //


                // ===== 重新整理Following的排名 Start ===== //
                getTopFollowing = getTopFollowing.map(user => ({
                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: _helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    isNotCurrentUser: !(user.id === _helpers.getUser(req).id)
                }))
                // 依追蹤者人數排序清單
                getTopFollowing = getTopFollowing.sort((a, b) => b.FollowerCount - a.FollowerCount)
                // ===== 重新整理Following的排名 End ===== //


                // 依據創建時間進行排序, 再按照次數 Start //
                let noCreatedAt = []
                let sortCreatedAt = []
                allUsers.forEach(user => {
                    if (user.followersTime.length > 0) {
                        user.followersTime = user.followersTime[0].Followship.createdAt
                        sortCreatedAt.push(user)
                    } else {
                        user.followersTime = ''
                        noCreatedAt.push(user)
                    }
                })

                // 照時間排序
                sortCreatedAt = sortCreatedAt.sort((a, b) => b.followersTime - a.followersTime)
                allUsers = sortCreatedAt.concat(noCreatedAt)
                // 照跟隨人數排序
                allUsers = allUsers.sort((a, b) => b.FollowingsCount - a.FollowingsCount)
                // console.log(allUsers)
                // 依據創建時間進行排序, 再按照次數 End //

                return res.render('follower', { users: allUsers, getTopFollowing, requestUser: requestUser.toJSON() })
            }).catch(error => {
                console.log(error)
            })
    },


    getFollowings: (req, res) => {
        let usersFindAll = User.findAll({
            include: [
                { model: User, as: 'Followings' },
            ],
            where: { role: '0' }
        })
        let userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ],
            where: { role: '0' }
        })
        const requestUser = User.findByPk(req.params.id, {
            include: [
                Tweet,
                { model: Tweet, as: 'LikedTweets' },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ]
        })

        Promise.all([usersFindAll, userFindAll2, requestUser])
            .then(responses => {
                let [allUsers, getTopFollowing, requestUser] = responses
                console.log(requestUser.toJSON())
                allUsers = allUsers.map(user => ({
                    ...user.dataValues,
                    isFollowings: requestUser.Followings.map(d => d.id).includes(user.id),
                    followingsTime: requestUser.Followings.filter(d => { return (d.id === user.id) }),
                    isNotCurrentUser: !(user.id === requestUser.id)
                }))

                getTopFollowing = getTopFollowing.map(user => ({
                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: _helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    isNotCurrentUser: !(user.id === _helpers.getUser(req).id)
                }))
                // 依追蹤者人數排序清單
                getTopFollowing = getTopFollowing.sort((a, b) => b.FollowerCount - a.FollowerCount)

                let noCreatedAt = []
                let sortCreatedAt = []
                allUsers.forEach(user => {
                    if (user.followingsTime.length > 0) {
                        user.followingsTime = user.followingsTime[0].Followship.createdAt
                        sortCreatedAt.push(user)
                    } else {
                        user.followingsTime = ''
                        noCreatedAt.push(user)
                    }
                })

                sortCreatedAt = sortCreatedAt.sort((a, b) => b.followingsTime - a.followingsTime)


                allUsers = sortCreatedAt.concat(noCreatedAt)

                return res.render('following', { users: allUsers, getTopFollowing, requestUser: requestUser.toJSON() })
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
            ],
            where: { role: '0' }
        })
        const requestUser = User.findByPk(req.params.id, {
            include: [
                Tweet,
                { model: Tweet, as: 'LikedTweets' },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ]
        })

        Promise.all([tweetFindAll, userFindAll2, requestUser])
            .then(responses => {
                let liked = responses[0]
                let users2 = responses[1]
                let requestUser = responses[2]
                liked = liked.map(likedTweet => ({
                    ...likedTweet.dataValues,
                    isLikedTweet: requestUser.dataValues.LikedTweets.map(d => d.id).includes(likedTweet.id),

                }))
                users2 = users2.map(user => ({
                    ...user.dataValues,
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: _helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    isNotCurrentUser: !(user.id === _helpers.getUser(req).id)

                }))
                // 依追蹤者人數排序清單
                users2 = users2.sort((a, b) => b.FollowerCount - a.FollowerCount)

                if (_helpers.getUser(req).id === requestUser.toJSON().id) {
                    requestUser.dataValues.isUser = true
                } else {
                    requestUser.dataValues.isUser = false
                }

                requestUser.dataValues.isFollowing = requestUser.toJSON().Followers.map(d => d.id).includes(_helpers.getUser(req).id)


                return res.render('userLike', { likedTweets: liked, users2, requestUser: requestUser.toJSON() })
            }).catch(error => {
                console.log(error)
            })

    },

    getTweetReply: (req, res) => {
        const replyFindAll = Reply.findAll({
            raw: true,
            nest: true,
            where: { userId: req.params.id },
            include: [
                User,
                { model: Tweet, include: [User] }
            ]
        })
        const userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ],
            where: { role: '0' }

        })
        const tweetFindAll = Tweet.findAll({
            order: [['createdAt', 'DESC']],
            where: { UserId: _helpers.getUser(req).id },
            include: [User,
                { model: Reply, include: [Tweet] },
                { model: User, as: 'LikedUsers' },
            ]
        })
        const requestUser = User.findByPk(req.params.id, {
            include: [
                { model: Tweet, as: 'LikedTweets' },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ]
        })

        Promise.all([replyFindAll, userFindAll2, tweetFindAll, requestUser])
            .then(responses => {

                const replies = responses[0]
                let users2 = responses[1]
                let tweets = responses[2]
                let requestUser = responses[3]
                users2 = users2.map(user => ({
                    ...user.dataValues,
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: _helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    isNotCurrentUser: !(user.id === _helpers.getUser(req).id)

                }))
                users2 = users2.sort((a, b) => b.FollowerCount - a.FollowerCount)

                if (_helpers.getUser(req).id === requestUser.toJSON().id) {
                    requestUser.dataValues.isUser = true
                } else {
                    requestUser.dataValues.isUser = false
                }

                requestUser.dataValues.isFollowing = requestUser.toJSON().Followers.map(d => d.id).includes(_helpers.getUser(req).id)

                return res.render('userReplies', { replies, users2, tweets, requestUser: requestUser.toJSON() })
            }).catch(error => {
                console.log(error)
            })




    },

    getUserApi: (req, res) => {
        const userId = req.params.id
        // console.log('================================================')
        // console.log(userId)
        // console.log('================================================')
        User.findByPk(userId)
            .then(user => {
                // console.log(user)
                if (_helpers.getUser(req).id !== user.id) {
                    return res.json({ status: 'error' })
                } else {
                    return res.json({ status: 'success', data: user.toJSON(), name: user.toJSON().name })
                }

            })
            .catch(error => {
                console.log(error)
            })
    },

    putUserApi: (req, res) => {
        const { files } = req
        const userId = user.id
        let cover = ''
        let avatar = ''

        if (files) {
            cover = files.cover
            avatar = files.avatar
        }
        if (cover && avatar) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(cover[0].path, (err, imgCover) => {
                if (avatar) {
                    imgur.upload(avatar[0].path, async (err, imgAvr) => {
                        const user = await User.findByPk(req.params.id)
                        if (req.body.introduction.trim().length > 160) {
                            req.flash('error_messages', '字數超出上限!')
                            return res.redirect('back')
                        } if (req.body.name.trim().length > 50) {
                            req.flash('error_messages', '字數超出上限50個字!')
                            return res.redirect('back')
                        } else {
                            await user.update({
                                cover: cover[0] ? imgCover.data.link : user.cover,
                                avatar: avatar[0] ? imgAvr.data.link : user.avatar,
                                name: user.name,
                                introduction: req.body.introduction ? req.body.introduction : user.introduction
                            })
                            return res.redirect('back')
                        }

                    })
                }
            })
        } else if (cover) { // 載入 cover
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(cover[0].path, async (err, imgCover) => {
                const user = await User.findByPk(req.params.id)
                if (req.body.introduction.trim().length > 160) {
                    req.flash('error_messages', '字數超出上限!')
                    return res.redirect('back')
                } if (req.body.name.trim().length > 50) {
                    req.flash('error_messages', '字數超出上限50個字!')
                    return res.redirect('back')
                } else {
                    await user.update({
                        cover: cover[0] ? imgCover.data.link : user.cover,
                        avatar: user.avatar,
                        name: user.name,
                        introduction: req.body.introduction ? req.body.introduction : user.introduction
                    }).then(user => {
                        console.log(user)
                    }).catch(error => {
                        console.log(error)
                    })
                    return res.redirect('back')
                }

            })
        } else if (avatar) { // 載入 avatar
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(avatar[0].path, async (err, imgAvr) => {
                const user = await User.findByPk(req.params.id)
                if (req.body.introduction.trim().length > 160) {
                    req.flash('error_messages', '字數超出上限!')
                    return res.redirect('back')
                } if (req.body.name.trim().length > 50) {
                    req.flash('error_messages', '字數超出上限50個字!')
                    return res.redirect('back')
                } else {
                    await user.update({
                        cover: user.cover,
                        avatar: avatar[0] ? imgAvr.data.link : user.avatar,
                        name: user.name,
                        introduction: req.body.introduction ? req.body.introduction : user.introduction
                    }).catch(error => {
                        console.log(error)
                    })
                    return res.redirect('back')
                }

            })
        } else {

            if (req.body.introduction) {
                if (req.body.introduction.trim().length > 160) {
                    req.flash('error_messages', '字數超出上限!')
                    return res.redirect('back')
                }
            }
            if (req.body.name.trim().length > 50) {
                req.flash('error_messages', '字數超出上限50個字!')
                return res.redirect('back')
            } else {
                return User.findByPk(req.params.id)
                    .then(user => {
                        user.update({
                            name: req.body.name,
                            avatar: user.avatar,
                            cover: user.cover,
                            introduction: req.body.introduction
                        }).then(user => {
                            console.log('送回API呼叫的資料')

                            // return res.json({ status: 'success', data: user })
                            return res.redirect('back')
                        }).catch(error => {
                            console.log(error)
                        })
                    })
            }


        }
    },

    getChatroomPublic: (req, res) => {
        res.render('chatroom', {})
    }







}


module.exports = userController