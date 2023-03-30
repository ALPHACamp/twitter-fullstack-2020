const { User, Tweet, Reply, Followship, Like } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { localFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => { // 登入
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!name || !email || !password || !account || !passwordCheck) throw new Error('所有欄位都是必填。')
    if (password !== passwordCheck) throw new Error('密碼不相同')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([emailCheck, accountCheck]) => {
        if (emailCheck) throw new Error('此信箱已被註冊過')
        if (accountCheck) throw new Error('此帳號已被註冊過')
        return bcrypt.hash(password, 10)
      })
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
  },
  signInPage: (req, res) => { // 登入
    return res.render('signin')
  },
  signIn: (req, res, next) => {
    res.redirect('/tweets')
  },
  getUser: (req, res, next ) => { // 取得個人資料頁面(推文清單)
    const isUser = helpers.getUser(req).id === Number(req.params.id) ? true : false
    return Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          User,
          Reply,
          { model: User, as: 'LikedUsers' }
        ],
        nest: true
      }),
      User.findByPk((req.params.id), {
        where: { role: 'user' },
        include: [
          Tweet,
          { model: Tweet, as: 'LikedTweets', include: [User] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [
          ['Tweets', 'createdAt', 'DESC'],
        ]
      })
    ])
      .then(([tweets,user]) => {
        const data = tweets.map(tweet => ({
          ...tweet.toJSON(),
          isLiked: helpers.getUser(req).LikedTweets.map(t => t.id).includes(tweet.id),
          
        })).sort((a, b) => b.createdAt - a.createdAt)
        
        return res.render('users', { users: user.toJSON(), tweet: data, isUser })
      })
      .catch(err => next(err))
  },
  putUser:(req, res, next) => { //修改使用者名稱、自我介紹、大頭照、背景圖
    const { name, introduction } = req.body
    const avatar = req.files ? req.files.avatar : null
    const cover = req.files ? req.files.cover : null

    if (!name) throw new Error('User name is required!')

    return User.findByPk(helpers.getUser(req).id)
      .then(async user => {
        if (!user) throw new Error("User didn't exist!")
        const avatarFilePath = avatar ? await localFileHandler(avatar[0]) : user.avatar
        const coverFilePath = cover ? await localFileHandler(cover[0]) : user.cover
        console.log('avatarFilePath:', avatarFilePath)
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath || user.avatar,
          cover: coverFilePath || user.cover
        }) 
    })
    .then(() => {
      req.flash('success_messages', 'User was successfully to update')
      res.redirect('/users/`${helpers.getUser(req).id}`')
    })
    .catch(err => next(err))
  },
  getSetting: (req, res,) => { // 取得帳戶設定頁面
    return User.findByPk(helpers.getUser(req).id)
      .then(user => {
        user = user.toJSON()
        const { name, account, email } = user
        return res.render('setting', { name, account, email })
      })
  },
  putSetting: (req, res, next) => { // 編輯帳戶設定
    const { account, name, email, password, passwordCheck } = req.body
    if (!name || !email || !password || !account || !passwordCheck) throw new Error('所有欄位都是必填。')
    if (password !== passwordCheck) throw new Error('密碼不相同')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([emailCheck, accountCheck]) => {
        if (accountCheck) throw new Error('此帳號已被註冊過')
        if (emailCheck) throw new Error('此信箱已被註冊過')
        return User.findOne({ where: { id: helpers.getUser(req).id } })
      })
      .then(user => {
        return user.update({
          name,
          email,
          account,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
      })
      .then(() => {
        req.flash('success_messages', '帳戶設定編輯成功!')
        return res.redirect('setting')
      })
      .catch(err => next(err))
  },
  getFollower: (req, res, next) => { // 跟隨者
    return Followship.findAll({
      where: { followingId: helpers.getUser(req).id },
      order: [['createdAt', 'DESC']]
    })
      .then(follow => {
        follow = follow.map(f => ({
          ...f.toJSON(),
          follower: helpers.getUser(req).Followers.find(fi => f.followerId === fi.id), //塞入追蹤者資料
          isFollowed: helpers.getUser(req).Followings.some(fi => f.followerId === fi.id) //確認是否跟隨
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
        follow = follow.map(f=>({
          ...f.toJSON(),
          following: helpers.getUser(req).Followings.find(fi => f.followingId === fi.id) //塞入追蹤者資料
        }))
        return res.render('following', { follow })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => { //追蹤功能
    if (+helpers.getUser(req).id === +req.params.userId) throw new Error('無法追蹤自己')//無法追蹤自己
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
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
  logout: (req, res) => { // 登出
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
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
        const withoutAdmin = users.filter(user => user.dataValues.role !== 'admin')//排除admin
        const withoutUser = withoutAdmin.filter(user => user.dataValues.id !== helpers.getUser(req).id)//排除自己
        users = withoutUser.map(user => ({
          // 整理格式
          ...user.toJSON(),
          // // 計算追蹤者人數
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

