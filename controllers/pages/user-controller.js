const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const helpers = require('../../_helpers')
const { isAdmin, userInfoHelper } = require('../../helpers/user-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []

    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ message: '所有欄位皆為必填' })
    }

    if (password !== checkPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }

    if (name.length > 50) {
      errors.push({ message: '超出上限 50 字' })
    }

    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) {
          errors.push({ message: '此 Email 已被使用' })
        }
        if (userAccount) {
          errors.push({ message: '此帳號已被使用' })
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
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    const ADMIN = 'admin'
    if (helpers.getUser(req).role === ADMIN) {
      req.logout()
      req.flash('error_messages', '此帳號不存在')
      return res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    const targetPath = req.user.role === 'admin' ? '/admin/signin' : 'signin'
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect(targetPath)
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
        replies = replies.map(reply => ({
          ...reply.toJSON(),
          tweetUser: reply.toJSON().Tweet.User
        }))

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

    if (!account || !name || !email) throw new Error('帳號、名稱、Email 不可為空白')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符')
    if (name.length > 50) throw new Error('超出上限 50 字')

    Promise.all([
      User.findByPk(id),
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([user, userEmail, userAccount]) => {
        if (userAccount) {
          if (userAccount.id !== user.id) {
            throw new Error('此帳號已被使用')
          }
        }
        if (userEmail) {
          if (userEmail.id !== user.id) {
            throw new Error('此 Email 已經被使用')
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
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

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
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

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
  addFollowing: (req, res, next) => {
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
  removeFollowing: (req, res, next) => {
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

module.exports = userController
