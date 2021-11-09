const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Followship, Like } = require('../models')
const { Op } = require('sequelize')
const { thousandComma } = require('../config/handlebars-helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const userController = {
    signUpPage: (req, res) => {
        return res.render('regist')
    },

    signUp: (req, res, next) => {
        const { name, account, email, password, passwordConfirmed } = req.body
        if (!name || !account || !email || !password || !passwordConfirmed) {
            req.flash('error_messages', '全部欄位都必填')
            return res.redirect('/signin')
        }
        if (name.trim().length === 0 || account.trim().length === 0 ) {
            req.flash('error_messages', '不可空白')
            return res.redirect('/signin')
        }
        if (req.body.password !== req.body.passwordConfirmed) {
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/signin')
        }
        User.findOne({
            where: {
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
                return res.render('tweet', { users: users })
            })
            .catch(next)

    },

    addFollowing: (req, res, next) => {
        if (Number(helpers.getUser(req).id) === Number(req.body.id)) {
            req.flash('error_messages', '不可跟隨自己！')
            return res.redirect(200, 'back')
        }
        Followship.create({
            followerId: helpers.getUser(req).id,
            followingId: req.body.id
        })
            .then((followship) => {
                req.flash('error_messages', '已成功跟隨！')
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
                        req.flash('error_messages', '已取消追隨！')
                        return res.redirect('back')
                    })
            })
            .catch(next)
    },

    toggleNotice: (req, res) => {
        if (helpers.getUser(req).id === Number(req.params.id)) return res.redirect('back')
        return User.findByPk(req.params.id, {
            where: { role: 'user' }
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

    getProfile: async (req, res) => {
        let [users, user, followship] = await Promise.all([
            User.findAll({ where: { role: 'user' }, raw: true, nest: true, attributes: ['id'] }),
            User.findByPk(req.params.id, {
                where: { role: 'user' },
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

        // const isUser = users.some(i => i.id === Number(req.params.id))
        // if (!isUser) return res.redirect('back')
        const UserId = helpers.getUser(req).id
        const followerscount = user.Followers.length
        const followingscount = user.Followings.length
        const tweetCount = user.Tweets.length
        const isFollowed = helpers.getUser(req).Followings.some(d => d.id === user.id)
        const repiledTweet = user.toJSON().Replies.map(result => result)
        followship = followship.map(followships => ({
            ...followships.dataValues,
            FollowerCount: followships.Followers.length,
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(followships.id),
            isMainuser: helpers.getUser(req).id === Number(req.params.id)
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
            const user = await User.findByPk(helpers.getUser(req).id)
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
            return res.redirect(`/users/${helpers.getUser(req).id}`)
        } catch (error) {
            console.warn(error)
        }
    },

    getSetting: (req, res) => {
        return User.findByPk(helpers.getUser(req).id).then(theuser => {
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
            const [a, e] = await Promise.all([
                User.findOne({
                    raw: true,
                    nest: true,
                    where: {
                        [Op.and]: [
                            { account: account },
                            { account: { [Op.notLike]: helpers.getUser(req).account } }
                        ]
                    }
                }),
                User.findOne({ raw: true, nest: true, where: { [Op.and]: [{ email }, { email: { [Op.notLike]: helpers.getUser(req).email } }] } })])
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
            const user = await User.findByPk(helpers.getUser(req).id)
            if (password === "") {
                await user.update({
                    name, account, email,
                })
                req.flash('success_messages', '成功更新個人資料設定！')
                return res.redirect(`users/${helpers.getUser(req).id}`)
            } else {
                await user.update({
                    name, account, email,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                })
                return res.redirect(`users/${helpers.getUser(req).id}`)
            }
        } catch (error) {
            console.warn(error)
        }
    },

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
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(follower.id),
            // isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(follower.id),
        }))

        let Top10Users = await User.findAll({
            include: [
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ],
        })

        Top10Users = Top10Users.map(user => ({
            ...user.dataValues,
            FollowerCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
            // isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
        }))

        Top10Users = Top10Users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('follower', { followers: followers, id: id, Top10Users: Top10Users, tweetCount: thousandComma(tweetCount) })

    },

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
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(following.id),
            // isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(following.id),
        }))

        let Top10Users = await User.findAll({
            include: [
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ],
        })

        Top10Users = Top10Users.map(user => ({
            ...user.dataValues,
            FollowerCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
            // isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
        }))

        Top10Users = Top10Users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('following', { followings: followings, id: id, Top10Users: Top10Users, tweetCount: thousandComma(tweetCount) })
    }
}

module.exports = userController

