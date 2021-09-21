const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Followship, Like } = require('../models')
const { Op } = require('sequelize')
const { thousandComma } = require('../config/handlebars-helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'bc129ea404ff01c'


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

    getTweets: (req, res) => {
        return res.render('setting')
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
                where: {
                    isAdmin: 'user',
                    id: { [Op.ne]: req.user.id }
                },
                include: [{ model: User, as: 'Followers' }]
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
            isFollowed: req.user.Followings.some(d => d.id === followships.id),
            isMainuser: req.user.id === Number(req.params.id)
        }))
        followship = followship.sort((a, b) => b.FollowerCount - a.FollowerCount)

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
    }
}

module.exports = userController