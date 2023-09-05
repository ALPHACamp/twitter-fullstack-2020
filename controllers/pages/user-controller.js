const bcrypt = require('bcryptjs')
const helpers = require('../../_helpers')
const { User, Followship, Tweet, sequelize } = require('../../models')
const { Op } = require('sequelize')
const { isAdmin, userInfoHelper } = require('../../helpers/user-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password } = req.body

    return User.findOne({
      where: {
        [Op.or]: [{ email }, { account }]
      }
    })
      .then(user => {
        if (user) {
          if (user.toJSON().account === account) throw new Error('此帳號已被註冊')
          if (user.toJSON().email === email) throw new Error('此 Email 已被註冊')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    res.redirect('/signin')
  },
  addFollowing: (req, res, next) => {
    if (req.body.id.toString() === helpers.getUser(req).id.toString()) {
      res.status(200).send('不能追蹤自己')
    } else {
      return Promise.all([
        User.findByPk(req.body.id),
        Followship.findOne({
          where: {
            followerId: helpers.getUser(req).id,
            followingId: req.body.id
          }
        })
      ])
        .then(([user, followship]) => {
          if (!user) throw new Error("User didn't exist!")
          if (followship) throw new Error('You are already following this user!')
          return Followship.create({
            followerId: helpers.getUser(req).id,
            followingId: req.body.id
          })
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
    }
  },
  removeFollowing: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.id
        }
      })
    ]).then(([user, followship]) => {
      if (!user) throw new Error("User didn't exist!")
      if (!followship) throw new Error("You haven't following this user!")
      return followship.destroy()
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const UserId = req.params.id

    return Promise.all([
      userInfoHelper(UserId),
      Tweet.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(`id`) FROM `Replies` WHERE `Tweet_id` = `Tweet`.`id`)'), 'replyCounts'],
            [sequelize.literal('(SELECT COUNT(`id`) FROM `Likes` WHERE `Tweet_id` = `Tweet`.`id`)'), 'likeCounts']
          ]
        },
        include: [User],
        where: { UserId },
        order: [['created_at', 'DESC']]
      })
    ])
      .then(([user, tweets]) => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

        user.isFollowing = req.user?.Followings.some(following => following.id === user.id)
        tweets = tweets.map(tweet => ({
          ...tweet.toJSON(),
          isLiked: req.user?.Likes.some(like => like.TweetId === tweet.id)
        }))
        res.render('user', {
          user,
          tweets,
          User: true
        })
      })
      .catch(err => next(err))
  },
  getSetting: (req, res, next) => {
    const id = helpers.getUser(req).id

    User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        user = user.toJSON()
        res.render('setting', {
          user,
          Setting: true
        })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
