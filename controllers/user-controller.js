const { Tweet, User, Reply, Like, Followship } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


const userController = {
    loginPage: (req, res) => {
        res.render('login')
    },
    registerPage: (req, res) => {
        res.render('register')
    },
    settingPage: (req, res) => {
        res.render('setting', { user: req.user })
    },
    edit: (req, res, next) => {
        const { name, account, email, password, checkPassword } = req.body
        if (!name.trim() || !account.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) throw new Error('欄位不得為空白!')
        if (name.length > 50) throw new Error('名稱上限50字!')
        if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
        return bcrypt.genSalt(10)
          .then(salt => {
            return Promise.all([bcrypt.hash(password, salt), User.findByPk(req.user.id)])
          })
          .then(([hash, user]) => {
            return user.update({ name, account, email, password: hash })
          })
          .then(() => {
            req.flash('successMessage', '編輯個人資料成功')
            res.redirect('back')
          })
          .catch(err => next(err))
    },
    signup: (req, res, next) => {
        const { name, account, email, password, checkPassword } = req.body
        if (!name.trim() || !account.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) throw new Error('欄位不得為空白!')
        if (name.length > 50) throw new Error('名稱上限50字!')
        if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
        return bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => {
                return User.findOrCreate({ where: { [Op.or]: [{ email }, { account }] }, defaults: { name, account, email, password: hash } })
            })
            .then(user => {
                if (!user[1]) throw new Error('帳號或email已被註冊!')
                res.redirect('/signin')
            })
            .catch(err => next(err))

    },
    signin: (req, res) => {
        return res.redirect('/tweets');
    },
    signout: (req, res) => {
        req.flash('successMessage', '登出成功！');
        req.logout();
        res.redirect('/signin');
    },
    getUser: (req, res, next) => {
        const userId = req.params.id
        return res.redirect(`/users/${userId}/tweets`)
    },
    getTweets: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Tweet,
                        include: [Reply, Like],
                    },
                    { model: User, as: 'Followers' },
                    { model: User, as: 'Followings' },
                ],
                order: [['Tweets', 'updatedAt', 'DESC']],
            });
            const followings = helpers.getUser(req).Followings.map((u) => u.id)

            const data = user.toJSON()
            let Tweets = data.Tweets
            Tweets = Tweets.map((t) => {
                t.isLikeBySelf = t.Likes.some((l) => l.UserId === helpers.getUser(req).id)
                return t
            });
            return res.render('users/profile', {
                user: helpers.getUser(req),
                visitUser: data,
                isFollowing: followings.includes(Number(req.params.id)),
            })
        } catch (error) {
            next(error)
        }
    },
    getReplies: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const selfId = Number(helpers.getUser(req).id);
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Reply,
                        where: { ReplyId: null },
                        include: [
                            { model: User },
                            { model: Tweet, include: [User, { model: Like, attributes: ['UserId'] }] },
                            { model: Like, attributes: ['UserId'] },
                        ],
                    },
                    {
                        model: Tweet,
                        attributes: ['id']
                    },
                    { model: User, as: 'Followers' },
                    { model: User, as: 'Followings' },
                ],
                order: [['Replies', 'updatedAt', 'DESC']],
            });

            if (!user) {
                req.flash('errorMessage', '用戶未有任何回覆');
                return res.redirect(`/users/${userId}/tweets`);
            }

            const followings = helpers.getUser(req).Followings.map((u) => u.id);
            const data = user.toJSON();
            let replies = data.Replies;
            let resultTweets = [];
            replies.forEach((r) => {
                r.isLikeBySelf = r.Likes.map((l) => l.UserId).includes(selfId);
                r.tweetUser = r.Tweet.User;

                let targetTweetId = r.Tweet.id;
                if (resultTweets.findIndex((t) => t.id === targetTweetId) === -1) {
                    r.Tweet.User = Object.assign({}, r.Tweet.User.dataValues);
                    r.Tweet.isLikeBySelf = r.Tweet.Likes.map((l) => l.UserId).includes(selfId);
                    r.Tweet.replies = [r];
                    resultTweets.push(r.Tweet);
                } else {
                    resultTweets.find((t) => t.id === targetTweetId).replies.push(r);
                }
            });
            const repliesWithTweet = resultTweets.flatMap((tweet) => tweet.replies);

            return res.render('users/replies', {
                user: helpers.getUser(req),
                visitUser: data,
                repliesWithTweet: repliesWithTweet,
                tweetsCount: data.Tweets.length,
                isFollowing: followings.includes(Number(req.params.id)),
            });
        } catch (error) {
            next(error);
        }
    },
    getLikes: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const selfId = Number(helpers.getUser(req).id);
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Tweet,
                        as: 'LikeTweets',
                        through: { attributes: [] },
                        include: [
                            { model: User },
                            { model: Reply },
                            { model: Like, attributes: ['UserId'] },
                        ],
                    },
                    {
                        model: Tweet,
                        attributes: ['id']
                    },
                    { model: User, as: 'Followers' },
                    { model: User, as: 'Followings' },
                ],
                order: [['LikeTweets', 'updatedAt', 'DESC']],
            });
            const followings = helpers.getUser(req).Followings.map((u) => u.id);
            const data = user.toJSON();
            let likedTweets = data.LikeTweets;
            likedTweets.forEach((t) => {
                t.isLikeBySelf = t.Likes.map((l) => l.UserId).includes(selfId);
                t.likeCount = t.Likes.length;
            });
            data.likedTweets = likedTweets;
            return res.render('users/likes', {
                user: helpers.getUser(req),
                visitUser: data,
                likedTweets: likedTweets,
                tweetsCount: data.Tweets.length,
                isFollowing: followings.includes(Number(req.params.id)),
            });
        } catch (error) {
            next(error)
        }
    },
    editProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (Number(req.params.id) === helpers.getUser(req).id) {
                res.json(user.toJSON())
            } else {
                res.json({ status: 'error' })
            }
        } catch (error) {
            console.log('error')
        }
    },
    putProfile: async (req, res) => {
        try {
            const UserId = Number(req.params.id)
            if (helpers.getUser(req).id !== UserId) {
                req.flash('errorMessage', '你沒有足夠的權限')
                return res.redirect('/tweets')
            }

            if (!req.body.name || req.body.name.trim() === '') {
                req.flash('errorMessage', '名稱或自我介紹不能為空白')
                return res.redirect('back')
            }

            if (req.body.name.length > 50) {
                req.flash('errorMessage', '名稱長度不符')
                return res.redirect('back')
            }

            if (!req.body.introduction || req.body.introduction.trim() === '') {
                if (req.get('Accept') !== 'application/json') {
                    req.flash('errorMessage', '名稱或自我介紹不能為空')
                    return res.redirect('back')
                }
            }

            if (req.body.introduction && req.body.introduction.length > 160) {
                req.flash('errorMessage', '自我介紹長度不符')
                return res.redirect('back')
            }

            const { files } = req;
            const user = await User.findByPk(UserId)
            let avatarUrl = user.avatar
            let coverUrl = user.cover
            let name = user.name
            let introduction = user.introduction

            if (files) {
                const { avatar, cover } = req.files
                imgur.setClientId(IMGUR_CLIENT_ID)
                if (avatar != null) {
                    let avatarPath = avatar[0].path
                    const img = await imgur.uploadFile(avatarPath)
                    console.log('Avatar Imgur response:', img)
                    avatarUrl = img.link
                }
                if (cover != null) {
                    let coverPath = cover[0].path
                    const img = await imgur.uploadFile(coverPath)
                    console.log('Cover Imgur response:', img)
                    coverUrl = img.link
                }
            }

            if (req.body.name) {
                name = req.body.name
            }

            if (req.body.introduction) {
                introduction = req.body.introduction;
            }

            await user.update({
                avatar: avatarUrl,
                cover: coverUrl,
                name: name,
                introduction: introduction,
            })

            if (req.get('Accept') === 'application/json') {
                return res.status(200).json(user.toJSON())
            } else {
                req.flash('successMessage', '更新成功！')
                return res.redirect(`/users/${UserId}/tweets`)
            }
        } catch (error) {
            req.flash('errorMessage', '更新失敗')
            return res.redirect('back')
        }
    },
    getFollowers: (req, res, next) => {
        return User.findByPk(req.params.id, { include: [{ model: Tweet, include: Reply }, { model: User, as: 'Followers'}, { model: User, as: 'Followings'}], nest: true })
          .then(user => {
            if (!user) throw new Error('此使用者不存在!')
            user = user.toJSON()
            const followers = user.Followers.map(f => ({
                ...f,
                isFollowed: user.Followings.some(F => F.id === f.id)
            }))
            res.render('users/followers', { followers, otherUser: user })
          })
          .catch(err => next(err))
    },
    getFollowings: (req, res, next) => {
        return User.findByPk(req.params.id, { include: [{ model: Tweet, include: Reply }, { model: User, as: 'Followings'}], nest: true })
          .then(user => {
            if (!user) throw new Error('此使用者不存在!')
            user = user.toJSON()
            res.render('users/followings', { followings: user.Followings, otherUser: user })
          })
          .catch(err => next(err))
    },
    addFollow: (req, res, next) => {
      const id = Number(req.body.id)
      if (id === req.user.id) {
        req.flash('errorMessage', '你不能追蹤你自己!')
        res.render('users/profile', {other_user: req.user})
      } else {
          return Followship.findOrCreate({ where: { followerId: req.user.id , followingId: id }, defaults: { followerId: req.user.id , followingId: id }})
          .then(followship => {
            if (!followship[1]) throw new Error('你已追蹤這位使用者!')
            req.flash('successMessage', '成功追蹤')
            res.redirect('back')
          })
          .catch(err => next(err))
      }    
    },
    removeFollow: (req, res, next) => {
        return Followship.findOne({ where: { followerId: req.user.id , followingId: req.params.id } })
          .then(followship => {
            if (!followship) throw new Error('你還沒追蹤這位使用者!')
            return followship.destroy()
          })
          .then(()=> {
            req.flash('successMessage', '成功取消追蹤')
            res.redirect('back')
          })
          .catch(err => next(err))
    }
}

module.exports = userController
