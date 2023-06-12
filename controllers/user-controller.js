const { User, Followship, Like } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!account || !name || !email || !password || !passwordCheck) {
      req.flash('error_message', '所有欄位都是必填')
      return req.redirect('/signup')
    }

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_message', '密碼不相符')
      return req.redirect('/signup')
    }

    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { name } })
    ])
      .then(([account, name]) => {
        if (account) throw new Error('account 已重複註冊！')
        if (name) throw new Error('name 已重複註冊！')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        isAdmin: false
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => {
        req.flash('error_message', `${err}`)
        return req.redirect('/signup')
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_message', '成功登入')
    res.redirect('/tweets')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logOut(() => { })
    res.redirect('/signin')
  },
  settingPage: (req, res) => {
    res.render('setting')
  },
  getFollower: (req, res, next) => { // 跟隨者
    return Followship.findAll({
      where: { followingId: helpers.getUser(req).id },
      order: [['createdAt', 'DESC']]
    })
      .then(follow => {
        follow = follow.map(f => ({
          ...f.toJSON(),
          follower: helpers.getUser(req)?.Followers?.find(fi => f.followerId === fi.id), // 塞入追蹤者資料
          isFollowed: helpers.getUser(req)?.Followings?.some(fi => f.followerId === fi.id) // 確認是否跟隨
        }))
        return res.render('follower', { follow })
      })
      .catch(err => next(err))
  },
  getFollowing: (req, res, next) => { // 跟隨中
    return Followship.findAll({
      where: { followerId: helpers.getUser(req).id },
      order: [['createdAt', 'DESC']]
    })
      .then(follow => {
        follow = follow.map(f => ({
          ...f.toJSON(),
          following: helpers.getUser(req).Followings.find(fi => f.followingId === fi.id) // 塞入追蹤者資料
        }))
        return res.render('following', { follow })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => { // 追蹤功能
    const id = +req.body.id
    if (+helpers.getUser(req).id === id) {
      req.flash('error_messages', '不得追蹤自己')
      return res.redirect(200, 'back')// 配合test的except(200)
    }// 無法追蹤自己
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: id
    })
      // })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getFollowship: (req, res, next) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        const limit = 10
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        const withoutAdmin = users.filter(user => user.dataValues.role !== 'admin')
        // 排除admin
        const withoutUser = withoutAdmin.filter(user => user.dataValues.id !== helpers.getUser(req).id)// 排除自己
        users = withoutUser.map(user => ({
        // 整理格式
          ...user.toJSON(),
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, limit)
        res.locals.getFollowship = users
        return next()
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => { // 喜歡
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.TweetId
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => { // 不喜歡
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.TweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't Liked this tweet!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
