const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const { Op } = require("sequelize")
const Followship = db.Followship
const helpers = require('../_helpers')
const { raw } = require('body-parser')

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
                        role: "user",
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
        //res.redirect('/tweets')
        // 測試 follower功能，做完要改回上面 
        res.redirect('/users/:id/followers')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')
    },

    getTweets: (req, res, next) => {
        User.findAll({
            raw: true, nest: true, include: [
                { model: User, as: 'Followers' },
            ]
        })
            .then(users => {
                console.log(users[0].Followers)
                return res.render('tweet', { users: users })
            })
            .catch(next)

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
        User
            .findAll({
                raw: true,
                nest: true,
                include: [
                    {
                        model: User,
                        as: 'Followings',
                        where: { id: id },
                        attributes: [],
                    },

                ],
                order: [['Followings', Followship, 'createdAt', 'DESC']]
            }).then((users) => {
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                console.log(users)

            })


        User.findAll({
            include: [
                { model: User, as: 'Followers' },
                // 撈出所有 User (有id在'followingId'FK的會有Followers)
                // User.Followers: 追蹤 User 的人
                { model: User, as: 'Followings' },
                // User.Followings: User 追蹤的人
            ],
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
                const Top10Users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
                return res.render('following', { users: users, id: id, Top10Users: Top10Users })
            })
            .catch(next)

    },

    getFollowerstest: async (req, res) => {
        // let followersID = await Followship
        //     .findAll({
        //         raw: true, nest: true,
        //         where: {
        //             followingId: helpers.getUser(req).id,
        //         },
        //         order: [['createdAt', 'DESC']],
        //         attributes: ['followerId'],
        //     })

        // let Data = []

        // Data = followersID.map(async (follower) => {
        //     const user = await User.findByPk(follower.followerId)
        // })
        const id = helpers.getUser(req).id

        let followers = await User.findAll({
            raw: true,
            nest: true,
            include: [
                {
                    model: User,
                    as: 'Followings',
                    where: { id: id },
                    attributes: [],
                },

            ],
            order: [['Followings', Followship, 'createdAt', 'DESC']]
        })

        followers = followers.map(follower => ({
            id: follower.id,
            email: follower.email,
            name: follower.name,
            avatar: follower.avatar,
            account: follower.account,
            cover: follower.cover,
            introduction: follower.introduction,
            // 判斷目前登入使用者是否已追蹤該 User 物件
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(follower.id),
            // 由req.user(passport中Followers)判斷目前登入使用者已被該 User 物件追蹤
            isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(follower.id),
        }))


        let Top10Users = await User.findAll({
            include: [
                { model: User, as: 'Followers' },
                // 撈出所有 User (有id在'followingId'FK的會有Followers)
                // User.Followers: 追蹤 User 的人
                { model: User, as: 'Followings' },
                // User.Followings: User 追蹤的人
            ],
        })

        Top10Users = Top10Users.map(user => ({
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
        Top10Users = Top10Users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('followertest', { followers: followers, id: id, Top10Users: Top10Users })

    },

    getFollowingstest: async (req, res) => {
        const id = helpers.getUser(req).id

        let followings = await User.findAll({
            raw: true,
            nest: true,
            include: [
                {
                    model: User,
                    as: 'Followers',
                    where: { id: id },
                    attributes: [],
                },

            ],
            order: [['Followers', Followship, 'createdAt', 'DESC']]
        })

        followings = followings.map(following => ({
            id: following.id,
            email: following.email,
            name: following.name,
            avatar: following.avatar,
            account: following.account,
            cover: following.cover,
            introduction: following.introduction,
            // 判斷目前登入使用者是否已追蹤該 User 物件
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(following.id),
            // 由req.user(passport中Followers)判斷目前登入使用者已被該 User 物件追蹤
            isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(following.id),
        }))


        let Top10Users = await User.findAll({
            include: [
                { model: User, as: 'Followers' },
                // 撈出所有 User (有id在'followingId'FK的會有Followers)
                // User.Followers: 追蹤 User 的人
                { model: User, as: 'Followings' },
                // User.Followings: User 追蹤的人
            ],
        })

        Top10Users = Top10Users.map(user => ({
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
        Top10Users = Top10Users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('followingtest', { followings: followings, id: id, Top10Users: Top10Users })

    }
}

module.exports = userController

