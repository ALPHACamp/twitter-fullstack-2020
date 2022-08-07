const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, Followship } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')

    Promise.all([
      User.findOne({
        where: { email: req.body.email }
      }),
      User.findOne({
        where: { account: req.body.account }
      })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '已成功註冊帳號，請登入後使用！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserSetting: (req, res, next) => {
    return res.render('setting', { user: helpers.getUser(req)?.toJSON() })
  },

  getTweets: (req, res, next) => {
    Promise.all([
      User.findByPk(req.params.uid, {
        order: [
          [Tweet, 'createdAt', 'desc'],
          [Tweet, 'id', 'desc']
        ],
        attributes: ['id', 'name', 'account', 'avatar', 'introduction', 'cover', 'role'],
        include: [
          {
            model: Tweet,
            attributes: ['id', 'createdAt', 'description'],
            include: [{
              model: User,
              attributes: ['id', 'avatar', 'createdAt']
            }]
          },
          { model: Tweet, include: Reply, attributes: ['id'] },
          { model: Tweet, include: Like, attributes: ['id'] }
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'avatar', 'name', 'account'],
        include: [{
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }],
        nest: true
      }),
      User.findByPk(req.params.uid, {
        attributes: ['id'],
        include: [{ model: User, as: 'Followers' }]
      }),
      User.findByPk(req.params.uid, {
        attributes: ['id'],
        include: [{ model: User, as: 'Followings' }]
      })
    ])
      .then(([userData, users, followers, followings]) => {
        if (!userData) throw new Error("User didn't exist!")
        if (userData?.role === 'admin') throw new Error("You can't watch admin User profile!")
        // 撈出loginUser，nav-left 使用
        const user = helpers.getUser(req) ? JSON.parse(JSON.stringify(helpers.getUser(req))) : []
        const profileIsFollowed = user.Followings.some(data =>
          Number(data.Followship.followingId) === Number(req.params.uid)
        )
        userData = JSON.parse(JSON.stringify(userData))
        userData.Tweets.forEach(data => {
          data.isLiked = false
          data.Likes.forEach(f => {
            if (f.UserId === user.id) {
              data.isLiked = true
            }
          })
        })
        userData.followersLength = followers.Followers.length
        userData.followingsLength = followings.Followings.length
        user.authSelfUser = parseInt(req.params.uid) === parseInt(helpers.getUser(req).id) ? true : []
        // 整理 users 只留被追蹤數排行前 10 者，nav-right 使用
        const followedUserId = helpers.getUser(req)?.Followings ? helpers.getUser(req).Followings.map(fu => fu.id) : [] // 先確認 req.user 是否存在，若存在檢查 Followings (該user追蹤的人) 是否存在。如果 Followers 存在則執行 map 撈出 user id 。若上述兩個不存在，回傳空陣列
        users = JSON.parse(JSON.stringify(users))
        for (const user of users) { // 以迴圈跑每一筆 user ，每一筆新增 numberOfFollowers、isFollowed 資訊
          user.numberOfFollowers = user.Followers.length
          user.isFollowed = followedUserId.includes(user.id)
        }
        users = users.sort((a, b) => b.numberOfFollowers - a.numberOfFollowers).slice(0, 10) // 只取排行前 10 的 users
        res.render('profile-tweets', { user, users, userData, profileIsFollowed })
      })
      .catch(err => next(err))
  },

  getReplies: (req, res, next) => {
    Promise.all([
      User.findByPk(req.params.uid, {
        where: { role: 'user' },
        order: [
          [Reply, 'createdAt', 'desc'],
          [Reply, 'id', 'desc']
        ],
        attributes: ['id', 'name', 'account', 'avatar', 'introduction', 'cover', 'role'],
        include: [
          {
            model: Reply,
            attributes: ['id'],
            include: [{
              model: Tweet,
              include: User,
              attributes: ['id']
            }]
          },
          { model: Tweet, attributes: ['id'] },
          {
            model: Reply,
            include: User,
            attributes: ['id', 'comment', 'createdAt']
          }
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'avatar', 'name', 'account'],
        include: [{
          model: User,
          as: 'Followers'
        }],
        nest: true
      }),
      User.findByPk(req.params.uid, {
        attributes: ['id'],
        include: [{ model: User, as: 'Followers' }]
      }),
      User.findByPk(req.params.uid, {
        attributes: ['id'],
        include: [{ model: User, as: 'Followings' }]
      })
    ])
      .then(([userData, users, followers, followings]) => {
        if (!userData) throw new Error("User didn't exist!")
        if (userData?.role === 'admin') throw new Error("You can't watch admin User profile!")
        // 撈出loginUser，nav-left 使用
        const user = helpers.getUser(req) ? JSON.parse(JSON.stringify(helpers.getUser(req))) : []
        const profileIsFollowed = user.Followings.some(data =>
          Number(data.Followship.followingId) === Number(req.params.uid)
        )
        userData = JSON.parse(JSON.stringify(userData))
        userData.followersLength = followers.Followers.length
        userData.followingsLength = followings.Followings.length
        user.authSelfUser = parseInt(req.params.uid) === parseInt(helpers.getUser(req).id) ? true : []

        // 整理 users 只留被追蹤數排行前 10 者，nav-right 使用
        const followedUserId = helpers.getUser(req)?.Followings ? helpers.getUser(req).Followings.map(fu => fu.id) : [] // 先確認 req.user 是否存在，若存在檢查 Followings (該user追蹤的人) 是否存在。如果 Followers 存在則執行 map 撈出 user id 。若上述兩個不存在，回傳空陣列
        users = JSON.parse(JSON.stringify(users))
        for (const user of users) { // 以迴圈跑每一筆 user ，每一筆新增 numberOfFollowers、isFollowed 資訊
          user.numberOfFollowers = user.Followers.length
          user.isFollowed = followedUserId.includes(user.id)
        }
        users = users.sort((a, b) => b.numberOfFollowers - a.numberOfFollowers).slice(0, 10) // 只取排行前 10 的 users
        return res.render('profile-replies', { user, users, userData, profileIsFollowed })
      })
      .catch(err => next(err))
  },

  getLikes: (req, res, next) => {
    Promise.all([
      User.findByPk(req.params.uid, {
        where: { role: 'user' },
        order: [
          [Like, 'createdAt', 'desc'],
          [Like, 'id', 'desc']
        ],
        attributes: ['id', 'name', 'account', 'avatar', 'introduction', 'cover', 'role'],
        include: [
          {
            model: Like,
            attributes: ['id', 'createdAt'],
            include: [{
              model: Tweet,
              attributes: ['id', 'description', 'createdAt'],
              include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
            }]
          },
          {
            model: Like,
            attributes: ['id', 'createdAt'],
            include: [{
              model: Tweet,
              attributes: ['id', 'description'],
              include: [{ model: Reply, attributes: ['id'] }]
            }]
          },
          {
            model: Like,
            attributes: ['id', 'createdAt'],
            include: [{
              model: Tweet,
              attributes: ['id', 'description'],
              include: [{ model: Like, attributes: ['id', 'UserId'] }]
            }]
          },
          { model: Tweet, attributes: ['id'] }
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'avatar', 'name', 'account'],
        include: [{
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }],
        nest: true
      }),
      User.findByPk(req.params.uid, {
        attributes: ['id'],
        include: [{ model: User, as: 'Followers' }]
      }),
      User.findByPk(req.params.uid, {
        attributes: ['id'],
        include: [{ model: User, as: 'Followings' }]
      })
    ])
      .then(([userData, users, followers, followings]) => {
        if (!userData) throw new Error("User didn't exist!")
        if (userData?.role === 'admin') throw new Error("You can't watch admin User profile!")
        // 撈出loginUser，nav-left 使用
        const user = helpers.getUser(req) ? JSON.parse(JSON.stringify(helpers.getUser(req))) : []
        const profileIsFollowed = user.Followings.some(data =>
          Number(data.Followship.followingId) === Number(req.params.uid)
        )
        userData = JSON.parse(JSON.stringify(userData))
        userData.Likes.forEach(data => {
          data.isLiked = false
          data.Tweet.Likes.forEach(f => {
            if (f.UserId === user.id) {
              data.isLiked = true
            }
          })
        })
        userData.followersLength = followers.Followers.length
        userData.followingsLength = followings.Followings.length
        user.authSelfUser = parseInt(req.params.uid) === parseInt(helpers.getUser(req).id) ? true : []
        // 整理 users 只留被追蹤數排行前 10 者，nav-right 使用
        const followedUserId = helpers.getUser(req)?.Followings ? helpers.getUser(req).Followings.map(fu => fu.id) : [] // 先確認 req.user 是否存在，若存在檢查 Followings (該user追蹤的人) 是否存在。如果 Followers 存在則執行 map 撈出 user id 。若上述兩個不存在，回傳空陣列
        users = JSON.parse(JSON.stringify(users))
        for (const user of users) { // 以迴圈跑每一筆 user ，每一筆新增 numberOfFollowers、isFollowed 資訊
          user.numberOfFollowers = user.Followers.length
          user.isFollowed = followedUserId.includes(user.id)
        }
        users = users.sort((a, b) => b.numberOfFollowers - a.numberOfFollowers).slice(0, 10) // 只取排行前 10 的 users
        return res.render('profile-likes', { user, users, userData, profileIsFollowed })
      })
      .catch(err => next(err))
  },

  getFollowings: (req, res, next) => {
    Promise.all([
      User.findByPk(req.params.uid, {
        attributes: ['id', 'name', 'role'],
        include: [
          { model: User, as: 'Followings' },
          { model: Tweet, attributes: ['id'] }
        ],
        order: [['Followings', Followship, 'createdAt', 'DESC']]
      }),
      User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'avatar', 'name', 'account'],
        include: [{
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }],
        nest: true
      })
    ])
      .then(([userData, users]) => {
        if (!userData) throw new Error("User didn't exist!")
        if (userData?.role === 'admin') throw new Error("You can't watch admin User profile!")
        // 撈出loginUser，nav-left 使用
        const user = helpers.getUser(req) ? JSON.parse(JSON.stringify(helpers.getUser(req))) : []
        userData = JSON.parse(JSON.stringify(userData))
        // 整理 users 只留被追蹤數排行前 10 者，nav-right 使用
        const followedUserId = helpers.getUser(req)?.Followings ? helpers.getUser(req).Followings.map(fu => fu.id) : [] // 先確認 req.user 是否存在，若存在檢查 Followings (該user追蹤的人) 是否存在。如果 Followers 存在則執行 map 撈出 user id 。若上述兩個不存在，回傳空陣列
        users = JSON.parse(JSON.stringify(users))
        for (const user of users) { // 以迴圈跑每一筆 user ，每一筆新增 numberOfFollowers、isFollowed 資訊
          user.numberOfFollowers = user.Followers.length
          user.isFollowed = followedUserId.includes(user.id)
        }
        users = users.sort((a, b) => b.numberOfFollowers - a.numberOfFollowers).slice(0, 10) // 只取排行前 10 的 users
        user.Followings.map(data => {
          userData.Followings.map(dat => {
            if (data.Followship.followingId === (dat.Followship.followingId)) {
              dat.Followship.match = dat.Followship.followingId
            }
            return 0
          })
          return 0
        })
        return res.render('profile-following', { user, users, userData })
      })
      .catch(err => next(err))
  },

  getFollowers: (req, res, next) => {
    Promise.all([
      User.findByPk(req.params.uid, {
        attributes: ['id', 'name', 'role'],
        include: [
          { model: Tweet, attributes: ['id'] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [['Followers', Followship, 'createdAt', 'DESC']]
      }),
      User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'avatar', 'name', 'account'],
        include: [{
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }],
        nest: true
      })
    ])
      .then(([userData, users]) => {
        if (!userData) throw new Error("User didn't exist!")
        if (userData?.role === 'admin') throw new Error("You can't watch admin User profile!")
        // 撈出loginUser，nav-left 使用
        const user = helpers.getUser(req) ? JSON.parse(JSON.stringify(helpers.getUser(req))) : []
        userData = JSON.parse(JSON.stringify(userData))
        // 整理 users 只留被追蹤數排行前 10 者，nav-right 使用
        const followedUserId = helpers.getUser(req)?.Followings ? helpers.getUser(req).Followings.map(fu => fu.id) : [] // 先確認 req.user 是否存在，若存在檢查 Followings (該user追蹤的人) 是否存在。如果 Followers 存在則執行 map 撈出 user id 。若上述兩個不存在，回傳空陣列
        users = JSON.parse(JSON.stringify(users))
        for (const user of users) { // 以迴圈跑每一筆 user ，每一筆新增 numberOfFollowers、isFollowed 資訊
          user.numberOfFollowers = user.Followers.length
          user.isFollowed = followedUserId.includes(user.id)
        }
        users = users.sort((a, b) => b.numberOfFollowers - a.numberOfFollowers).slice(0, 10) // 只取排行前 10 的 users
        user.Followings.map(data => {
          userData.Followers.map(dat => {
            if (data.Followship.followingId === (dat.Followship.followerId)) {
              dat.Followship.match = dat.Followship.followerId
            }
            return 0
          })
          return 0
        })
        return res.render('profile-follower', { userData, users, user })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
