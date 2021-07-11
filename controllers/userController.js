
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Followship, Like} = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')
// const imgur = require('imgur-node-api')
// const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, account, email, password, passwordConfirm } = req.body
    const errors = []
    if (!name || !account || !email || !password || !passwordConfirm) {
      errors.push({ msg: '所有欄位都是必填。' })
    }
    if (password !== passwordConfirm) {
      errors.push({ msg: '密碼及確認密碼不一致！' })
    }
    if (errors.length) {
      return res.render('signup', {
        errors, name, account, email, password, passwordConfirm
      })
    }
    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }]
      }
    }).then(user => {
      if (user) {
        errors.push({ msg: '帳號或Email已註冊！' })
        return res.render('signup', {
          errors, name, account, email, password, passwordConfirm
        })
      }
      return User.create({
        name, account, email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }).then(() => {
        req.flash('success_messages', '註冊成功！')
        return res.redirect('/signin')
      })
    })
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getTweets: (req, res) => {
    return res.render('tweets')
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Reply,
            attributes: ['id'],
            include:
            [
              { model: Tweet, attributes: ['id', 'comment'] }
            ]
          },
          { model: User, as: 'Followers', attributes: ['img', 'id'] },
          { model: User, as: 'Followings', attributes: ['img', 'id'] }
          // { model: Restaurant, include: Category, as: 'FavoritedRestaurants', attributes: ['image', 'id'] }
        ]
      })
      if (!user) throw new Error("user isn't exist !!")

      const tweetInfo = new Map()
      user.toJSON().Replies.forEach(t => {
        const id = t.TweetId
        if (tweetInfo.has(id)) {
          tweetInfo.get(id).count++
        } else {
          tweetInfo.set(id, { TweetId: id, name: t.Tweet.content, img: t.Restaurant.image, count: 1 })
        }
      })
      console.log(restaurantInfo)
      res.render('/admin/users', { user: user.toJSON(), restaurants: [...restaurantInfo.values()] })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('warning_msg', '你只能修改自己的 profile!!')
      return res.redirect(`/users/${req.user.id}`)
    }
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("user isn't exist !!")
      res.render('editProfile', { user: user.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => res.redirect('back'))
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => followship.destroy())
      .then(() => res.redirect('back'))
  },
  addLike: async (req, res, next) => {
    try {
      const { id: userId } = helpers.getUser(req)
      await Like.create({ UserId: req.user.id, TweetId: req.params.TweetId })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: { UserId: req.user.id, TweetId: req.params.TweetId }
      })
      if (!like) throw new Error('like not found.')

      await like.destroy()
      res.redirect('back')
    } catch (error) {
      next(error) 
    }
  }
}

module.exports = userController
