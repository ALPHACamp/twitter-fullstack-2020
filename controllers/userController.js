const bcrypt = require('bcryptjs')
const { test } = require('mocha')
const db = require('../models')
const user = require('../models/user')
const User = db.User
const Followship = db.Followship
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const moment = require('moment')


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
                        avatar: 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg',
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

    },

    getUserSelf: (req, res) => {
        const tweetFindAll = Tweet.findAll({
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            where: { UserId: req.user.id }

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

                // console.log(users)
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
            raw: true,
            nest: true,
            include: [
                User,
                { model: User, as: 'LikedUsers' }
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
                    ...likedTweet,
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

    getReplies: (req, res) => {
        const replyFindAll = Reply.findAll({
            raw: true,
            nest: true,
            include: [
                User,
                { model: Tweet, include: [User] }
            ]
        })
        const tweetFindAll = Tweet.findAll({
            raw: true,
            nest: true,
        })
        const userFindAll = User.findAll({
            raw: true,
            nest: true
        })
        let userFindAll2 = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })
        Promise.all([replyFindAll, tweetFindAll, userFindAll, userFindAll2])
            .then(responses => {
                let replies = responses[0]
                let tweets = responses[1]
                let users = responses[2]
                let users2 = responses[3]
                console.log('== replies ==')
                console.log(replies)
                console.log('== tweets ==')
                // console.log(tweets)
                console.log('== users ==')
                // console.log(users)

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

                return res.render('userReplies', { replies, users2 })
            })
            .catch(error => {
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
    }







}


module.exports = userController