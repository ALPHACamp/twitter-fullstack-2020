const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Like = db.Like
const Tweet = db.Tweet
const { Op } = require("sequelize")

const userController = {
    signUpPage: (req, res) => {
        return res.render('regist')
    },

    signUp: (req, res, next) => {
        // 驗證兩次密碼相同，密碼不同導回註冊頁
        if (req.body.password !== req.body.passwordConfirmed) {
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/signin')
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
                    return res.redirect('/signin')
                } else if (req.body.name.length > 50) {
                    req.flash('error_messages', '「名字上限50字 請重新輸入！」')
                    return res.redirect('/signin')
                } else {
                    User.create({
                        account: req.body.name,
                        name: req.body.name,
                        email: req.body.email,
                        role:"user",
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                    })
                    .then(() => {
                        req.flash('success_messages', '成功註冊帳號！')
                        return res.redirect('/signin')
                    })
                    .catch(next) 
                }
            })
    },

    signInPage: (req, res) => {
        return res.render('login')
    },  

    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/tweets')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')
    },

    getTweets: (req, res) => {
        return res.render('setting')
    },
    //MUSH新增
    addLike: (req, res) => {
        return Like.create({
            UserId: req.user.id,
            TweetId: req.params.TweetId
        })
            .then(() => {
                return Tweet.findByPk(req.params.TweetId)
                    .then((tweet) => {
                        return tweet.increment('likeCount')
                    })
            })
            .then(() => {
                return res.redirect('back')
            })
    },
    removeLike: (req, res) => {
        return Like.findOne({
            where: {
                UserId: req.user.id,
                TweetId: req.params.TweetId
            }
        })
            .then((like) => {
                like.destroy()
                    .then(() => {
                        return Tweet.findByPk(req.params.TweetId).then((tweet) => {
                            tweet.decrement('likeCount')
                            res.redirect('back')
                        })
                    })
            })
    },
    addFollowing: (req, res, next) => {
        if (Number(req.user.id) === Number(req.params.userId)) {
            req.flash('error_messages', '不可跟隨自己！')
            return res.redirect('back')
        }
        Followship.create({
            followerId: helpers.getUser(req).id,
            followingId: req.params.userId
        })
            .then((followship) => {
                return res.redirect('back')
            })
            .catch(next)
    },
    removeFollowing: (req, res, next) => {
        return Followship.findOne({
            where: {
                followerId: helpers.getUser(req).id,
                followingId: req.params.userId
            }
        })
            .then((followship) => {
                followship.destroy()
                    .then((followship) => {
                        return res.redirect('back')
                    })
            })
            .catch(next)
    },
    getFollowers: (req, res, next) => {
        const id = helpers.getUser(req).id
        User.findAll({
            include: [
                { model: User, as: 'Followers' },
                // 撈出所有 User (有id在'followingId'FK的會有Followers)
                // User.Followers: 追蹤 User 的人
                { model: User, as: 'Followings' },
                // User.Followings: User 追蹤的人
            ],
            // order: [
            //     ['Followings', Followship, 'updatedAt', 'DESC']
            // ]
        })
            .then(users => {
                // users 為一陣列
                users = users.map(user => ({
                    // 整理 users 資料，展開的是第二層 dataValues 裡面的物件
                    ...user.dataValues,
                    // 計算追蹤者人數，id在'followingId'，表示被追蹤
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    // 由req.user(passport中Followers)判斷目前登入使用者已被該 User 物件追蹤
                    isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
                }))
                // users 陣列要用 FollowerCount 來排序，再取跟隨者 (followers) 數量排列前 10 的使用者推薦名單
                const Top10Users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
                return res.render('follower', { users: users, id: id, Top10Users: Top10Users })
            })
            .catch(next)
    },
    getFollowings: (req, res, next) => {
        const id = helpers.getUser(req).id
        User.findAll({
            include: [
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ],
            order: [
                ['Followers', Followship, 'updatedAt', 'DESC']
            ]
        })
            .then(users => {
                // users 為一陣列
                users = users.map(user => ({
                    // 整理 users 資料，展開的是第二層 dataValues 裡面的物件
                    ...user.dataValues,
                    // 計算追蹤者人數，id在'followingId'，表示被追蹤
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    // 由req.user(passport中Followers)判斷目前登入使用者已被該 User 物件追蹤
                    isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
                }))
                console.log("@@@@@@@@@@@@")
                console.log(users[4])
                const Top10Users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
                return res.render('following', { users: users, id: id, Top10Users: Top10Users })
            })
            .catch(next)
    }
}

module.exports = userController