const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Followship = db.Followship
const Like = db.Like
const helpers = require('../_helpers')

const userController = {
  signInPage: (req, res) => {
    return res.render('signin')
  },
  AdminSignInPage: (req, res) => {
    return res.render('adminSignin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role !== 'admin') {
      req.flash('success_messages', '登入成功！')
      res.redirect('/tweets')
    } else {
      req.flash('error_messages', '管理者請從後台登入！')
      res.redirect('/signin')
    }
  },
  AdminSignIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('success_messages', 'Sign in successfully！')
      res.redirect('/admin/tweets')
    } else {
      req.flash('error_messages', '使用者請從前台登入！')
      res.redirect('/admin/signin')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Sign out successfully！')
    req.logout()
    res.redirect('/signin')
  },
  addFavorite: (req, res) => {
    const favoriteTargetId = req.query.id
    const currentUserId = helpers.getUser(req).id
    if (Number(favoriteTargetId) === Number(currentUserId)) {
      req.flash('error_messages', '不能追蹤自己喔！')
      return res.redirect('back')
    } else {
      return Followship.create({
        followerId: currentUserId,
        followingId: favoriteTargetId
      })
        .then(() => {
          return res.redirect('back')
        })
    }
  },
  removeFavorite: (req, res) => {
    const favoriteTargetId = req.params.id
    const currentUserId = helpers.getUser(req).id
    return Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: favoriteTargetId
      }
    })
      .then(favorite => {
        favorite.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  addLike: (req, res) => {
    const likeTweetId = Number(req.params.tweetId)
    const currentUserId = Number(helpers.getUser(req).id)
    return Like.create({
      UserId: currentUserId,
      TweetId: likeTweetId
    })
      .then(() => {
        return res.redirect('back')
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  removeLike: (req, res) => {
    const likeTweetId = req.params.tweetId
    const currentUserId = helpers.getUser(req).id
    return Like.findOne({
      where: {
        UserId: currentUserId,
        TweetId: likeTweetId
      }
    })
      .then(like => {
        like.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  }
}

module.exports = userController