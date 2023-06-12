const { Op } = require('sequelize') // 用「不等於」的條件查詢資料庫時需要用到的東西
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Followship, Like } = db
const helpers = require('../_helpers')

const userController = {
  // 取得註冊頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 送出註冊資訊
  signUp: (req, res, next) => {
    // 取出註冊資訊
    const { account, name, email, password, confirmPassword } = req.body
    // 準備裝錯誤訊息的陣列 為了同時顯示多個錯誤
    const errors = []

    // 檢查註冊資訊是否正確 任一欄不得為空 密碼與確認密碼必須相同
    if (!account || !name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不一致。' })
    }
    if (errors.length) {
      return res.render('signup', {
        errors,
        account,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // 檢查註冊資訊是否正確 前往資料庫查詢 非管理員的 account 或 email 是否已存在於資料庫
    return Promise.all([
      User.findOne({ where: { account, isAdmin: 0 } }),
      User.findOne({ where: { email, isAdmin: 0 } })
    ])
      .then(([accountUser, emailUser]) => {
        if (emailUser) {
          errors.push({ message: '這個Email已被註冊。' })
        }
        if (accountUser) {
          errors.push({ message: '這個帳號已被註冊。' })
        }
        if (errors.length) {
          return res.render('signup', {
            errors,
            account,
            name,
            email,
            password,
            confirmPassword
          })
        }
        return bcrypt.hash(password, 10)
          // 在資料庫創建User資料
          .then(hash => User.create({
            account,
            name,
            email,
            password: hash
          }))
          .then(() => {
            req.flash('success_messages', '成功註冊帳號。')
            res.redirect('/signin')
          })
          .catch(err => next(err))
      })
  },
  // 取得登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 送出登入資訊
  signIn: (req, res) => {
    res.redirect('/tweets')
  },
  // 登出
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '你已成功登出。')
    res.redirect('/signin')
  },
  // API: 取得目前登入的使用者資料 只回傳json (待刪除取得的password)
  getUserData: (req, res, next) => {
    User.findByPk(helpers.getUser(req).id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  // API: 送出編輯個人資料資訊
  editUserProfile: (req, res, next) => {
    const { name, intro } = req.body
    // 驗證name是否有值
    if (!name || name.trim() === '') throw new Error('Name is required.')
    // 去資料庫找user並更新資料
    User.findByPk(helpers.getUser(req).id)
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        return user.update({ name, intro: intro || user.intro })
      })
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  // 取得自己的帳戶設定頁面
  getSettingPage: (req, res, next) => {
    const userId = req.params.id
    // 檢查是不是自己本人
    if (Number(userId) !== helpers.getUser(req).id) throw new Error('Permission denied.')
    // 取得自己的帳戶資訊
    User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        const { account, name, email } = user
        res.render('setting', { account, name, email, userId })
      })
      .catch(err => next(err))
  },
  // 送出帳戶設定資訊
  putSetting: (req, res, next) => {
    const userId = req.params.id
    const { account, name, email, password, confirmPassword } = req.body
    const errors = []
    // 檢查是不是自己本人
    if (Number(userId) !== helpers.getUser(req).id) throw new Error('Permission denied.')
    // 檢查帳戶資訊是否正確 任一欄不得為空 密碼與確認密碼必須相同
    if (!account || !name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不一致。' })
    }
    if (errors.length) {
      return res.render('setting', {
        userId,
        errors,
        account,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // 檢查帳戶資訊是否正確 資料庫中是否已經有非管理者使用了該 account 或 email
    return Promise.all([
      User.findOne({ where: { account, isAdmin: 0, id: { [Op.ne]: userId } } }), // 尋找該account、排除管理員、排除自己
      User.findOne({ where: { email, isAdmin: 0, id: { [Op.ne]: userId } } }) // 尋找該email、排除管理員、排除自己
    ])
      .then(([accountUser, emailUser]) => {
        if (emailUser) {
          errors.push({ message: '這個Email已被註冊。' })
        }
        if (accountUser) {
          errors.push({ message: '這個帳號已被註冊。' })
        }
        if (errors.length) {
          return res.render('setting', {
            userId,
            errors,
            account,
            name,
            email,
            password,
            confirmPassword
          })
        }
        // 取得自己的帳戶資訊 同時生成密碼
        return Promise.all([
          User.findByPk(userId),
          bcrypt.hash(password, 10)
        ])
          .then(([user, hash]) => {
            if (!user) throw new Error('User did not exist.')
            // 更新到資料庫
            return user.update({ account, name, email, password: hash })
          })
          .then(() => {
            req.flash('success_messages', '帳戶設定完成。')
            res.redirect(`/users/${userId}/setting`)
          })
          .catch(err => next(err))
      })
  },
  // 取得特定使用者頁面
  getUserPage: (req, res, next) => {
    const userId = req.params.id
    Promise.all([
      // 取得特定使用者 Id
      User.findByPk(userId, {
        raw: true,
        nest: true
      }),
      // 取得該使用者所有貼文
      Tweet.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        include: [User],
        raw: true,
        nest: true
      }),
      Like.findAll({
        attributes: ['id', 'userId', 'tweetId'],
        raw: true,
        nest: true
      }),
      // 取得目前登入的使用者資料
      User.findByPk(helpers.getUser(req).id, { raw: true }),
      // 未來會取得追蹤數前 10 名的使用者資料
      User.findAll({
        // limit: 10,
        order: [['createdAt', 'DESC']],
        where: { isAdmin: 0 },
        raw: true
      })
    ])
      .then(([user, tweets, likes, currentUser, topUsers]) => {
        const tweetsData = tweets.map(tweet => ({
          ...tweet,
          isLiked: likes.some(like => (like.userId === helpers.getUser(req).id && like.tweetId === tweet.id)),
          likeCount: likes.filter(like => like.tweetId === tweet.id).length
        }))
        res.render('user', { user, tweets: tweetsData, currentUser, topUsers })
      })
  },

  // 追蹤特定使用者
  addFollow: (req, res, next) => {
    // 按鈕上這人的 id
    const userId = Number(req.body.id)

    // 自己不能追蹤自己(測試檔 redirect 需要 200)
    if (userId === helpers.getUser(req).id) {
      req.flash('error_messages', 'Cannot follow yourself!')
      return res.redirect('back')
    }

    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('User did not exist.')
        if (followship) throw new Error('You have already followed this user!')
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  // 取消追蹤特定使用者
  removeFollow: (req, res, next) => {
    // 按鈕上這人的 id
    const userId = req.params.id
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  getUserFollowers: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'Followings',
          include: { model: User, as: 'Followings' }
        },
        {
          model: Tweet
        }
      ],
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('User not found')
        // 推文數量
        const tweetsLength = user.Tweets.length
        const followings = user.toJSON().Followings
        // console.log(user.toJSON())
        followings.forEach(following => following.isFollowed = following.Followings.some(fr => fr.id === helpers.getUser(req).id))
        // console.log('上下切開')
        // followings.sort((a, b) => b.Followship.createdAt - a.Followership.createdAt)
        res.status(200).render('followship', { user: user.toJSON(), tweetsLength, users: followings })
      })
      .catch(err => next(err))
  },

  getUserFollowings: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'Followers',
          include: { model: User, as: 'Followers' }
        },
        {
          model: Tweet
        }
      ],
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('User not found')
        // 推文數量
        const tweetsLength = user.Tweets.length
        const followers = user.toJSON().Followers
        // console.log(user.toJSON())
        followers.forEach(follower => follower.isFollowed = follower.Followers.some(fr => fr.id === helpers.getUser(req).id))
        // console.log('上下切開')
        // console.log(followers)
        // followers.sort((a, b) => b.Followship.createdAt - a.Followership.createdAt)
        res.status(200).render('followship', { user: user.toJSON(), tweetsLength, users: followers })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
