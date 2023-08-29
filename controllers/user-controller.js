const db = require('../models')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like } = db
const helper = require('../_helpers')

const userController = {
  editUser: (req, res, next) => {
    const settingRoute = true
    const user = req.user
    User.findByPk(user.id, { raw: true, nest: true })
      .then(user => res.render('setting', { user, settingRoute, id: helper.getUser(req).id }))
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const currentUser = helper.getUser(req)
    if (account.length > 50) throw new Error('字數超出上限！')
    if (name.length > 50) throw new Error('字數超出上限！')
    if (password !== checkPassword) throw new Error('密碼輸入不一致！')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })]
    )
      .then(([userAccount, userEmail]) => {
        if (userAccount && (userAccount.toJSON().id !== currentUser.id)) throw new Error('account 已重複註冊！')
        if (userEmail && (userEmail.toJSON().id !== currentUser.id)) throw new Error('email 已重複註冊！')
        return Promise.all([User.findByPk(currentUser.id), bcrypt.hash(password, 10)])
      })
      .then(([user, hash]) => {
        if (password.length) {
          user.update({ account, name, email, password: hash })
            .then(() => {
              req.flash('success_messages', '恭喜個人設定更新成功，請重新登入！')
              res.redirect('/signin')
            })
        } else if (account !== currentUser.account) {
          user.update({ account, name, email, password: currentUser.password })
            .then(() => {
              req.flash('success_messages', '恭喜個人設定更新成功，請重新登入！')
              res.redirect('/signin')
            })
        } else {
          user.update({ account, name, email, password: currentUser.password })
            .then(() => {
              req.flash('success_messages', '恭喜個人設定更新成功！')
              res.redirect('/tweets')
            })
        }
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const currentUser = helper.getUser(req).id || null
    const selectedUser = req.params.id
    // 如果現在進入的個人頁面不是當前使用者
    let profileRoute = true
    let otherProfileRoute = false
    if (currentUser !== Number(selectedUser)) {
      profileRoute = false
      otherProfileRoute = true
    }
    return Promise.all([
      Tweet.findAll({
        // test for now
        where: { UserId: Number(selectedUser) },
        raw: true,
        nest: true,
        include: User,
        order: [['createdAt', 'DESC']]
      }),
      User.findByPk(currentUser, { raw: true })
    ])
      .then(([tweets, user]) => {
        const tweetsCount = tweets.length
        // 當 user 為非使用者時
        const tweetsUser = tweets[0].User.name
        res.render('profile', { tweets, user, profileRoute, otherProfileRoute, tweetsCount, tweetsUser })
      })
      .catch(err => next(err))
  },
  signInPage: (req, res, next) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    if (req.user.role === 'admin') {
      req.flash('error_messages', '帳號不存在！')
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '您已成功登入！')
      res.redirect('/tweets')
    }
  },
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  logOut: (req, res, next) => {
    req.flash('success_messages', '您已成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (account.length > 50) throw new Error('字數超出上限！')
    if (name.length > 50) throw new Error('字數超出上限！')
    if (password !== checkPassword) throw new Error('密碼輸入不一致！')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })]
    )
      .then(([userAccount, userEmail]) => {
        if (userAccount) throw new Error('account 已重複註冊！')
        if (userEmail) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '恭喜註冊成功！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  likeTweet: (req, res, next) => {
    const currentUserId = helper.getUser(req).id
    const tweetId = req.params.id

    return Like.findOne({
      where: {
        UserId: currentUserId,
        TweetId: tweetId
      }
    })
      .then(like => {
        if (like && !like.isLike) {
          return like.update({ isLike: true })
        } else if (!like) {
          return Like.create({
            UserId: currentUserId,
            TweetId: tweetId,
            isLike: true
          })
        }
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const currentUserId = helper.getUser(req).id
    const tweetId = req.params.id

    return Like.findOne({
      where: {
        UserId: currentUserId,
        TweetId: tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error('You have not liked this tweets!')
        else if (like.isLike) {
          return Like.update({ isLike: false })
        }
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => next(err))
  }
  // addFollowing: (req, res, next) => {
  //   const { userId } = req.params
  //   Promise.all([
  //     User.findByPk(userId),
  //     Followship.findOne({
  //       where: {
  //         followerId: req.user.id,
  //         followingId: userId
  //       }
  //     })
  //   ])
  //     .then(([user, followship]) => {
  //       if (user.toJSON().id === req.user.id) throw new Error("Can't follow yourself")
  //       if (!user) throw new Error("User didn't exist!")
  //       if (followship) throw new Error('Your are already following this user!')
  //       return Followship.create({
  //         followerId: req.user.id,
  //         followingId: userId
  //       })
  //     })
  //     .then(() => res.redirect('back'))
  //     .catch(err => next(err))
  // },
  // deleteFollowing: (req, res, next) => {
  //   Followship.findOne({
  //     where: {
  //       followerId: req.user.id,
  //       followingId: req.params.userId
  //     }
  //   })
  //     .then(followship => {
  //       if (!followship) throw new Error("You haven't followed this user!")
  //       return followship.destroy()
  //     })
  //     .then(() => res.redirect('back'))
  //     .catch(err => next(err))
  // }
}

module.exports = userController
