const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { getUser } = require('../_helpers')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []
    const errorsMsg = { errors, account, name, email, password, checkPassword }

    if (password !== checkPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (name.length > 50) {
      errors.push({ message: '名稱上限為50字' })
    }

    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([account, email]) => {
        if (account) {
          errors.push({ message: 'account 已重複註冊！' })
        }
        if (email) {
          errors.push({ message: 'email 已重複註冊！' })
        }
        if (errors.length) {
          res.render('signup', errorsMsg)
          return null
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        if (hash) {
          return User.create({ account, name, email, password: hash, role: 'user' })
        }
      })
      .then(user => {
        if (user) {
          req.flash('success_messages', '成功註冊帳號！')
          res.redirect('/signin')
        }
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (getUser(req).role === 'admin') {
      req.flash('error_messages', '請前往後台登入')
      return res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  tweets: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
      Tweet.findAll({
        where: { UserId: id },
        include: [Like, Reply],
        order: [['createdAt', 'desc']],
        nest: true
      })
    ])
      .then(([targetUser, tweets]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        const tweetsData = tweets
          .map(t => ({
            ...t.toJSON(),
            likedCount: t.Likes.length,
            repliedCount: t.Replies.length,
            isLiked: t.Likes.some(like => like.UserId === user.id)
          }))
        res.locals.tweetsLength = tweets.length
        res.render('profile', { targetUser: targetUser.toJSON(), tweets: tweetsData, user, tweet: true })
      })
      .catch(err => next(err))
  },
  replies: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, Tweet]
      }),
      Reply.findAll({
        where: { UserId: id },
        include: [{ model: Tweet, include: User }],
        order: [['createdAt', 'desc']],
        raw: true,
        nest: true
      })
    ])
      .then(([targetUser, replies]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        res.locals.tweetsLength = targetUser.Tweets.length
        res.render('profile', { targetUser: targetUser.toJSON(), replies, user, reply: true })
      })
      .catch(err => next(err))
  },
  likes: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, Tweet]
      }),
      Like.findAll({
        where: { UserId: id },
        include: [
          { model: Tweet, include: User },
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply }
        ],
        order: [['createdAt', 'desc']],
        nest: true
      })
    ])
      .then(([targetUser, likes]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        const likesData = likes
          .map(l => ({
            ...l.toJSON(),
            likedCount: l.Tweet.Likes.length,
            repliedCount: l.Tweet.Replies.length,
            isLiked: user ? l.Tweet.Likes.some(like => like.UserId === user.id) : false
          }))
        res.locals.tweetsLength = targetUser.Tweets.length
        res.render('profile', { targetUser: targetUser.toJSON(), likes: likesData, user, like: true })
      })
      .catch(err => next(err))
  },
  postTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      const { description } = req.body
      if (description.trim() === '') {
        req.flash('error_messages', 'Tweet 內容不能為空')
        return res.redirect('back')
      }
      if (description.length > 140) {
        req.flash('error_messages', 'Tweet 字數不能超過140字')
        return res.redirect('back')
      }
      await Tweet.create({
        description,
        UserId: id
      })
        .then(() => {
          req.flash('success_messages', '成功推文')
          return res.redirect('/tweets')
        })
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  postLike: async (req, res, next) => {
    try {
      const id = req.params.id
      await Like.create({
        UserId: id,
        TweetId: req.params.tweet_id
      })
      req.flash('success_messages', 'success like!')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const id = req.params.id
      return Promise.all([
        Like.findOne({
          where: {
            UserId: id,
            TweetId: req.params.tweet_id
          }
        })
      ]).then(like => {
        if (!like) return req.flash('error_messages', '你沒有like這個tweet!')
        like.destroy()
        req.flash('success_messages', 'success unlike!')
        return res.redirect('back')
      }).catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  followers: (req, res, next) => {
    const id = req.params.id
    const currentUser = getUser(req)

    return User.findByPk(id, {
      nest: true,
      include: [Tweet, { model: User, as: 'Followers' }]
    })
      .then(user => {
        const result = user.Followers.map(user => {
          return {
            ...user.toJSON(),
            isFollowed: currentUser?.Followings.some(f => f.id === user.id)
          }
        }).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        res.render('followers', { observedUser: user.toJSON(), followers: result })
      })
      .catch(err => next(err))
  },
  followings: (req, res, next) => {
    const id = req.params.id
    const currentUser = getUser(req)

    return User.findByPk(id, {
      nest: true,
      include: [Tweet, { model: User, as: 'Followings' }]
    })
      .then(user => {
        const followings = user.Followings.map(user => {
          return {
            ...user.toJSON(),
            isFollowed: currentUser?.Followings.some(f => f.id === user.id)
          }
        }).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        res.render('followings', { user: user.toJSON(), followings })
      })
      .catch(err => next(err))
  },
  addFollowing: async (req, res, next) => {
    const id = req.params.id
    if (id === Number(req.body.id)) {
      req.flash('error_messages', '不能追隨自己！')
      return res.redirect(200, 'back')
    }
    Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: id
        })
      })
      .then(() => {
        req.flash('success_messages', '追隨成功！')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => {
        req.flash('success_messages', '取消追隨成功！')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  // 暫時調整為getSetting，與下方命名規則相同
  getSetting: async (req, res) => {
    const id = req.params.id
    const user = await User.findByPk(id,{
      raw: true
    })
    if(user.id !== getUser(req).id) throw new Error('無法編輯其他人資料!')
    res.render('setting',user)
  },
  // post -> 新增 | put -> 修改
  putSetting: (req, res) => {
    const id = req.params.id
    res.redirect(`/users/${id}/setting`)
  },
  otherPage: (req, res) => {
    res.render('other')
  },
  // api routes
  getUser: (req, res, next) => {
    // User.findByPk(getUser(req).id) 這樣子寫不會過
    const id = req.params.id
    User.findByPk(id) // 要傳入 id test 才會過
      .then(userData => {
        if (!userData) throw new Error("user didn't exist")

        const user = userData.toJSON()
        delete user.password // 新增這裡，刪除密碼(移除敏感資料)
        res.json({ status: 'success', ...user })
      })
      .catch(err => next(err))
  },
  postUser: async (req, res, next) => {
    const id = req.params.id
    const { file } = req // 把檔案取出來
    const { name, introduction } = req.body

    const user = await User.findByPk(id)
    if (!user) throw new Error("user didn't exist")
    let avatarFilePath = user.dataValues.avatar
    let coverFilePath = user.dataValues.cover

    // 檢查符號 ?. 前面這個 object 值存不存在
    if (file?.avatar) {
      avatarFilePath = await imgurFileHandler(...file.avatar)
    }

    if (file?.coverImage) {
      coverFilePath = await imgurFileHandler(...file.coverImage)
    }

    await user.update({ name, introduction, avatar: avatarFilePath, cover: coverFilePath })
      .then(() => {
        req.flash('success_messages', '個人資料已更新')
        return res.json({ status: 'success', ...user.toJSON() })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
