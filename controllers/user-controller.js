const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Followship = db.Followship
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) {
      req.flash('error_messages', '所有內容都需要填寫')
      return res.redirect('/signup')
    }
    if (password !== checkPassword) {
      req.flash('error_messages', '密碼與密碼確認不相符')
      return res.redirect('/signup')
    }
    if (!email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/)) {
      req.flash('error_messages', 'email 輸入錯誤')
      return res.redirect('/signup')
    }
    if (name.length > 50 || account.length > 50) {
      req.flash('error_messages', '字數超出上限！')
      return res.redirect('/signup')
    }

    Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) {
          req.flash('error_messages', 'email 已重複註冊！')
          return res.redirect('/signup')
        } else if (userAccount) {
          req.flash('error_messages', 'account 已重複註冊！')
          return res.redirect('/signup')
        } else {
          User.create({
            role: 'user',
            account,
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          })
            .then(() => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
            .catch(err => next(err))
        }
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    // req.logout()
    // res.redirect('/signin')
    req.logout(function (err) {
      if (err) { return next(err) }
      res.redirect('/signin')
    })
  },
  getTweets: (req, res, next) => {
    // 個人頁面的推文抓取
    return Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        where: { UserId: req.params.id },
        include: [User, Like],
        nest: true
      }),
      User.findAll({
        where: { role: 'user' }
      })
    ])
      .then(([tweets, userData]) => {
        const user = helpers.getUser(req)
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 140),
          User: t.User.dataValues,
          user,
          isLiked: t.Likes.some(f => f.UserId === user.id)
        }))
        res.render('tweet', {
          tweets: data, user
        })
      })
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    const userId = req.params.id
    const followingList = helpers.getUser(req) && helpers.getUser(req).Followings.map(following => following.id)
    Promise.all([
      User.findByPk(userId, {
        include: [{ model: User, as: 'Followings' }],
        nest: true
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        nest: true
      })
    ])
      .then(([viewUser, allUsers]) => {
        if (!viewUser) throw new Error('該用戶不存在')
        const followings = viewUser.Followings.map(following => {
          return {
            ...following.toJSON(),
            isFollowed: followingList.includes(following.id)
          }
        })
        const topFollowings = allUsers
          .sort((a, b) => {
            b.Followers.length - a.Followers.length
          })
          .slice(0, 10)
          .map(topFollowing => {
            return {
              ...topFollowing.toJSON(),
              isFollowed: followingList.includes(topFollowing.id)
            }
          })
        return res.render('followship', {
          user: viewUser.toJSON(),
          followings,
          topFollowings,
          route: 'following'
        })
      })
      .catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    const userId = req.params.id
    const followingList = helpers.getUser(req) && helpers.getUser(req).Followings.map(following => following.id)
    Promise.all([
      User.findByPk(userId, {
        include: [{ model: User, as: 'Followers' }],
        nest: true
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        nest: true
      })
    ])
      .then(([viewUser, allUsers]) => {
        if (!viewUser) throw new Error('該用戶不存在')
        const followings = viewUser.Followers.map(follower => {
          return {
            ...follower.toJSON(),
            isFollowed: followingList.includes(follower.id)
          }
        })
        const topFollowing = allUsers
          .sort((a, b) => {
            b.Followers.length - a.Followers.length
          })
          .slice(0, 10)
          .map(topFollowing => {
            return {
              ...topFollowing.toJSON(),
              isFollowed: followingList.includes(topFollowing.id)
            }
          })
        return res.render('followship', {
          user: viewUser.toJSON(),
          followings,
          topFollowings,
          route: 'follower'
        })
      })
      .catch(err => next(err))
  },
  addFollowship: (req, res, next) => {
    const followingId = req.body.id
    if (Number(followingId) === Number(helpers.getUser(req).id)) {
      req.flash('error_messages', '不得追蹤自己')
      return res.redirect(200, 'back')
    }
    Followship.create({
      followerId: helpers.getUser(req).id,
      followingId
    })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeFollowship: (req, res, next) => {
    const unfollowingId = req.params.id
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: unfollowingId
      }
    })
      .then(followship => {
        return followship.destroy()
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  editUserPage: (req, res, next) => {
    return User.findByPk(helpers.getUser(req).id, { raw: true })
      .then(user => {
        if (!user) throw new Error("用戶不存在")
        res.render('edit', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) {
      req.flash('error_messages', '所有內容都需要填寫')
      return res.redirect('/edit')
    }
    if (password !== checkPassword) {
      req.flash('error_messages', '密碼與密碼確認不相符')
      return res.redirect('/edit')
    }
    if (!email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/)) {
      req.flash('error_messages', 'email 輸入錯誤')
      return res.redirect('/edit')
    }
    if (name.length > 50 || account.length > 50) {
      req.flash('error_messages', '字數超出上限！')
      return res.redirect('/edit')
    }

    return Promise.all([
      User.findByPk(helpers.getUser(req).id),
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([user, userEmail, userAccount]) => {
        if (userEmail) {
          req.flash('error_messages', 'email 已有人使用！')
          return res.redirect('/edit')
        } else if (userAccount) {
          req.flash('error_messages', 'account 已有人使用！')
          return res.redirect('/edit')
        } else {
          user.update({
            account,
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          })
            .then(() => {
              req.flash('success_messages', '成功修改帳號！')
              return res.redirect('/edit')
            })
            .catch(err => next(err))
        }
      })
  }
}

module.exports = userController
