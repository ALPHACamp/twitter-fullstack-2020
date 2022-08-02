const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const bcrypt = require('bcryptjs')
const helpers = require('../../_helpers')

const { isAdmin, userInfoHelper } = require('../../helpers/user-helpers')

const userConroller = {
  getSignin: (req, res) => {
    res.render('signin')
  },
  postSignin: (req, res) => {
    const ADMIN = 'admin'
    if (helpers.getUser(req).role === ADMIN) {
      req.logout()
      req.flash('error_messages', '帳號不存在')
      return res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入')
    return res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []
    // 查看不符合的條件
    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== checkPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (name.length > 50) {
      errors.push({ message: '名稱長度超出上限 50 字！' })
    }

    // 並確認 email 與 account 不能重複
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) {
          errors.push({ message: 'Email 已經存在了。' })
        }
        if (userAccount) {
          errors.push({ message: 'Account 已經存在!' })
        }
        if (errors.length > 0) {
          return res.render('signup', {
            errors,
            account,
            name,
            email
          })
        }
        return bcrypt.hash(password, 10)
          .then(hash => {
            return User.create({
              account,
              name,
              email,
              password: hash
            })
          })
          .then(() => {
            req.flash('success_messages', '成功註冊帳號！')
            res.redirect('/signin')
          })
          .catch(err => next(err))
      })
  },
  getTweets: (req, res, next) => {
    const UserId = req.params.userId

    return Promise.all([
      userInfoHelper(UserId),
      Tweet.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(`id`) FROM `Replies` WHERE `TweetId` = `Tweet`.`id`)'), 'replyCounts'],
            [sequelize.literal('(SELECT COUNT(`id`) FROM `Likes` WHERE `TweetId` = `Tweet`.`id`)'), 'likeCounts']
          ]
        },
        include: [User],
        where: { UserId },
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweets]) => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

        user.isFollowing = req.user?.Followings.some(following => following.id === user.id)
        tweets = tweets.map(tweet => ({
          ...tweet.toJSON(),
          isLiked: req.user?.Likes.some(like => like.TweetId === tweet.id)
        }))

        res.render('user', { user, tweets })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const UserId = req.params.userId

    return Promise.all([
      userInfoHelper(UserId),
      Reply.findAll({
        include: [
          User,
          { model: Tweet, include: [User] }
        ],
        where: { UserId },
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, replies]) => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

        user.isFollowing = req.user?.Followings.some(following => following.id === user.id)
        replies = replies.map(reply => reply.toJSON())

        res.render('user', { user, replies })
      })
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    const UserId = req.params.userId

    return Promise.all([
      userInfoHelper(UserId),
      Like.findAll({
        include: [{
          model: Tweet,
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(`id`) FROM `Replies` WHERE `TweetId` = `Tweet`.`id`)'), 'replyCounts'],
              [sequelize.literal('(SELECT COUNT(`id`) FROM `Likes` WHERE `TweetId` = `Tweet`.`id`)'), 'likeCounts']
            ]
          },
          include: User
        }],
        where: { UserId },
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, likes]) => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

        user.isFollowing = req.user?.Followings.some(following => following.id === user.id)
        const likedTweets = likes.map(like => ({
          ...like.Tweet.toJSON(),
          isLiked: req.user?.Likes.some(userLike => userLike.id === like.id)
        }))

        res.render('user', { user, likedTweets })
      })
  },
  logout: (req, res) => {
    const targetPath = req.user.role === 'admin' ? '/admin/signin' : 'signin'
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect(targetPath)
  },
  getSetting: (req, res, next) => {
    const id = helpers.getUser(req).id

    User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user = user.toJSON()
        res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  editSetting: (req, res, next) => {
    const id = helpers.getUser(req).id
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email) throw new Error('帳號、名稱、Email 不可空白!')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
    if (name.length > 50) throw new Error('名稱長度超出上限 50 字！')

    Promise.all([
      User.findByPk(id),
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([user, userEmail, userAccount]) => {
        if (userAccount) {
          // 同帳號，id 卻不同，表示修改後的帳號撞名了
          if (userAccount.id !== user.id) {
            throw new Error('Account 已經存在!')
          }
        }
        if (userEmail) {
          if (userEmail.id !== user.id) {
            throw new Error('Email 已經存在!')
          }
        }
        return bcrypt.hash(password, 10)
          .then(hash => {
            return user.update({
              account,
              name,
              email,
              password: hash
            })
          })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    const UserId = req.params.userId

    return User.findByPk(UserId, {
      attributes: {
        include: [[sequelize.literal('(SELECT COUNT(`id`) FROM `Tweets` WHERE `UserId` = `User`.`id`)'), 'tweetCounts']]
      },
      include: [
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在！')

        user = user.toJSON()
        const followings = user.Followings
          .map(f => ({
            ...f,
            isFollowing: helpers.getUser(req).Followings.some(uf => uf.id === f.id)
          }))
          .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

        res.render('followship', { user, followings })
      })
      .catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    const UserId = req.params.userId

    return User.findByPk(UserId, {
      attributes: {
        include: [[sequelize.literal('(SELECT COUNT(`id`) FROM `Tweets` WHERE `UserId` = `User`.`id`)'), 'tweetCounts']]
      },
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在！')

        user = user.toJSON()
        const followers = user.Followers
          .map(f => ({
            ...f,
            isFollowing: helpers.getUser(req).Followings.some(uf => uf.id === f.id)
          }))
          .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

        res.render('followship', { user, followers })
      })
      .catch(err => next(err))
  },
  addFollowship: (req, res, next) => {
    const user = helpers.getUser(req)
    const followingId = Number(req.body.followingId) || Number(req.body.id)
    const followerId = Number(user.id)
    const isFollowing = user.Followings.some(following => following.id === followingId)

    if (followerId === followingId) {
      req.flash('error_messages', '使用者禁止追蹤自己')
      return res.redirect(200, 'back')
    }

    if (!isFollowing) {
      return Followship
        .create({
          followerId,
          followingId
        })
        .then(() => {
          res.redirect('back')
        })
        .catch(next)
    }
    req.flash('warning_messages', '已追蹤該名使用者')
    return res.redirect('back')
  },
  deleteFollowship: (req, res, next) => {
    return Followship
      .findOne({
        where: {
          followingId: req.params.followingId,
          followerId: helpers.getUser(req).id
        }
      })
      .then(followship => {
        return followship.destroy()
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(next)
  }
}

module.exports = userConroller
