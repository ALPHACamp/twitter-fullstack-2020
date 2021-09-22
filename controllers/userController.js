const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Followship, Like } = require('../models')
const { Op } = require('sequelize')
const { thousandComma } = require('../config/handlebars-helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'bc129ea404ff01c'
const helpers = require('../_helpers')

// const { raw } = require('body-parser') - alan check

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
        res.redirect('/tweets')
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
    // 把 鈴鐺 isNoticed 改為 0 或 1 - 阿金
    toggleNotice: (req, res) => {
        if (req.user.id === Number(req.params.id)) return res.redirect('back')
        return User.findByPk(req.params.id, {
            where: { isAdmin: 'user' }
        })
            .then(user => {
                user.update({ isNoticed: !user.isNoticed })
                    .then(user => {
                        if (user.isNoticed) {
                            req.flash('success_messages', `你已成功訂閱${user.name}！`)
                        } else {
                            req.flash('success_messages', `已取消訂閱${user.name}！`)
                        }
                        return res.redirect('back')
                    })
            })
    },
    //拿取 個人資料頁面 - 阿金
    getProfile: async (req, res) => {
        let [users, user, followship] = await Promise.all([
            User.findAll({ where: { isAdmin: 'user' }, raw: true, nest: true, attributes: ['id'] }),
            User.findByPk(req.params.id, {
                where: { isAdmin: 'user' },
                include: [
                    Tweet,
                    { model: Reply, include: { model: Tweet, include: [User] } },
                    { model: Tweet, as: 'LikedTweet', include: [User] },
                    { model: User, as: 'Followers' },
                    { model: User, as: 'Followings' },
                ],
                order: [
                    ['Tweets', 'createdAt', 'DESC'],
                    [Reply, 'updatedAt', 'DESC'],
                    ['LikedTweet', 'updatedAt', 'DESC']
                ],
            }),
            User.findAll({
                include: [
                    { model: User, as: 'Followers' },
                    { model: User, as: 'Followings' }
                ]
            })
        ])
        console.log('-----------------------------')
        console.log('user.toJSON().Tweets : ', user.toJSON())
        // const a = user.toJSON().Tweets.map( (r) => { ...r.dataValues })
        // console.log('-----------------------------')
        // console.log('a : ', a)\

        const isUser = users.some(i => i.id === Number(req.params.id))
        if (!isUser) return res.redirect('back')
        const UserId = req.user.id
        const followerscount = user.Followers.length
        const followingscount = user.Followings.length
        const tweetCount = user.Tweets.length
        const isFollowed = req.user.Followings.some(d => d.id === user.id)
        const repiledTweet = user.toJSON().Replies.map(result => result)
        followship = followship.map(followships => ({
            ...followships.dataValues,
            FollowerCount: followships.Followers.length,
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes (followships.id),
            isMainuser: req.user.id === Number(req.params.id)
        }))
        followship = followship.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)

        return res.render('userprofile', {
            users: user.toJSON(),
            repiledTweet,
            followerscount: thousandComma(followerscount),
            followingscount: thousandComma(followingscount),
            tweetCount: thousandComma(tweetCount),
            followship,
            isFollowed,
            UserId,
        })
    },
    putProfile: async (req, res) => {
        const { name, introduction } = req.body
        const { avatar, cover } = req.files

        if (!name) {
            req.flash('error_messages', '名稱不可以空白')
            return res.redirect('back')
        }
        if (introduction.length > 160) {
            req.flash('error_messages', '自我介紹至多輸入160字，不能更多')
            return res.redirect('back')
        }
        try {
            let { avator, cover1 } = ''
            const user = await User.findByPk(req.user.id)
            await user.update({ name, introduction })
            imgur.setClientID(IMGUR_CLIENT_ID)
            if (cover) {
                imgur.upload(cover[0].path, async (error, image) => {
                    cover1 = image.data.link
                    await user.update({
                        cover: cover1 ? cover1 : user.cover
                    })
                })
            }
            if (avatar) {
                imgur.upload(avatar[0].path, async (error, image) => {
                    avator = image.data.link
                    await user.update({
                        avatar: avator ? avator : user.avatar
                    })
                })
            }
            req.flash('success_messages', '成功更新個人資料！')
            return res.redirect(`/users/${req.user.id}`)
        } catch (error) {
            console.warn(error)
        }
    },
    //setting - 阿金
    getSetting: (req, res) => {
        return User.findByPk(req.user.id).then(theuser => {
            theuser = theuser.toJSON()
            const { name, account, email } = theuser
            return res.render('setting', { name, account, email })
        })
    },
    putSetting: async (req, res) => {
        const { name, account, email, password, checkPassword } = req.body
        let errors = []
        if (!name || !account || !email) {
            errors.push({ msg: '帳號/名稱/Email 不可空白。' })
        }
        if (password !== checkPassword) {
            errors.push({ msg: '密碼及確認密碼不一致！' })
        }
        if (errors.length) {
            return res.render('setting', {
                errors, name, account, email, password, checkPassword
            })
        }
        try {
            const [a, e] = await Promise.all([User.findOne({ raw: true, nest: true, where: { [Op.and]: [{ account: account }, { account: { [Op.notLike]: req.user.account } }] } }), User.findOne({ raw: true, nest: true, where: { [Op.and]: [{ email }, { email: { [Op.notLike]: req.user.email } }] } })])
            errors = []
            if (a) {
                errors.push({ msg: '此帳號已有人使用。' })
            }
            if (e) {
                errors.push({ msg: '此Email已有人使用。' })
            }
            if (a || e) {
                console.log(errors)
                return res.render('setting', { errors, name, account, email, password, checkPassword })
            }
            const user = await User.findByPk(req.user.id)
            if (password === "") {
                await user.update({
                    name, account, email,
                })
                req.flash('success_messages', '成功更新個人資料設定！')
                return res.redirect(`users/${req.user.id}`)
            } else {
                await user.update({
                    name, account, email,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                })
                return res.redirect(`users/${req.user.id}`)
            }
        } catch (error) {
            console.warn(error)
        }
    },
    // 1st 版本
    // getFollowers: (req, res, next) => {
    //     const id = helpers.getUser(req).id
    //     User
    //         .findAll({
    //             raw: true,
    //             nest: true,
    //             include: [
    //                 {
    //                     model: User,
    //                     as: 'Followings',
    //                     where: { id: id },
    //                     attributes: [],
    //                 },

    //             ],
    //             order: [['Followings', Followship, 'createdAt', 'DESC']]
    //         }).then((users) => {
    //             console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    //             console.log(users)

    //         })


    //     User.findAll({
    //         include: [
    //             { model: User, as: 'Followers' },
    //             // 撈出所有 User (有id在'followingId'FK的會有Followers)
    //             // User.Followers: 追蹤 User 的人
    //             { model: User, as: 'Followings' },
    //             // User.Followings: User 追蹤的人
    //         ],
    //     })
    //         .then(users => {
    //             // users 為一陣列
    //             users = users.map(user => ({
    //                 // 整理 users 資料，展開的是第二層 dataValues 裡面的物件
    //                 ...user.dataValues,
    //                 // 計算追蹤者人數，id在'followingId'，表示被追蹤
    //                 FollowerCount: user.Followers.length,
    //                 // 判斷目前登入使用者是否已追蹤該 User 物件
    //                 isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
    //                 // 由req.user(passport中Followers)判斷目前登入使用者已被該 User 物件追蹤
    //                 isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
    //             }))
    //             // users 陣列要用 FollowerCount 來排序，再取跟隨者 (followers) 數量排列前 10 的使用者推薦名單
    //             const Top10Users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
    //             return res.render('follower', { users: users, id: id, Top10Users: Top10Users })
    //         })
    //         .catch(next)

    // },

    // 1st 版本
    // getFollowings: (req, res, next) => {
    //     const id = helpers.getUser(req).id
    //     User.findAll({
    //         include: [
    //             { model: User, as: 'Followers' },
    //             { model: User, as: 'Followings' },
    //         ],
    //     })
    //         .then(users => {
    //             // users 為一陣列
    //             users = users.map(user => ({
    //                 // 整理 users 資料，展開的是第二層 dataValues 裡面的物件
    //                 ...user.dataValues,
    //                 // 計算追蹤者人數，id在'followingId'，表示被追蹤
    //                 FollowerCount: user.Followers.length,
    //                 // 判斷目前登入使用者是否已追蹤該 User 物件
    //                 isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
    //                 // 由req.user(passport中Followers)判斷目前登入使用者已被該 User 物件追蹤
    //                 isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
    //             }))
    //             const Top10Users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
    //             return res.render('following', { users: users, id: id, Top10Users: Top10Users })
    //         })
    //         .catch(next)

    // },

    getFollowers: async (req, res) => {
        const id = helpers.getUser(req).id
        let user = await User.findByPk(req.params.id, {
                include: [
                    Tweet
                ]
            })
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
        const tweetCount = user.Tweets.length
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
        return res.render('follower', { followers: followers, id: id, Top10Users: Top10Users, tweetCount: thousandComma(tweetCount) })

    },
    //MUSH新增
    addLike: (req, res) => {
        return Like.create({
            UserId: helpers.getUser(req).id,
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
                UserId: helpers.getUser(req).id,
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
    getFollowings: async (req, res) => {
        const id = helpers.getUser(req).id
        let user = await User.findByPk(req.params.id, {
                include: [
                    Tweet
                ]
            })
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
        const tweetCount = user.Tweets.length
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
        return res.render('following', { followings: followings, id: id, Top10Users: Top10Users, tweetCount: thousandComma(tweetCount) })


    }
}

module.exports = userController

