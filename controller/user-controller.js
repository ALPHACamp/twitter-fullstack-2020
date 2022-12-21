const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  //帳號密碼核對會在passport
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    // 使用req.flash會跳回signin
    // if (password !== checkPassword) req.flash('error_messages', '密碼不相符!ヽ(#`Д´)ﾉ')
    // if (name.length > 50) req.flash('error_messages', '字數超出上限ヽ(#`Д´)ﾉ')
    if (password !== checkPassword) throw new Error('密碼不相符!ヽ(#`Д´)ﾉ')
    if (name.length > 50) throw new Error('字數超出上限ヽ(#`Д´)ﾉ')
    //const { Op } = require('sequelize')
    //使用sequelize operator or，來選擇搜尋兩樣東西。
    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('account already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          account, name, email, password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '帳號註冊成功!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //註冊修改頁面
  editSetting: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  //帳戶註冊頁面修改,尚未完成，輸入對象有問題。
  putSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼不相符!ヽ(#`Д´)ﾉ')
    if (name.length > 50) throw new Error('字數超出上限ヽ(#`Д´)ﾉ')
    return User.findByPk(req.params.id)
      .then(async (user) => {
        const usedPassword = await bcrypt.compare(password, user.password)
        if (!user) throw new Error("User didn't exist!")
        console.log(user.email)
        if (usedPassword) throw new Error("Reset!")
        bcrypt.hash(password, 10)
      })
      .then(hash => {
        // user.update({
        //   account, name, email, password: hash
        // })
        console.log(hash)
      })
      .then(() => {
        req.flash('success_messages', '帳戶資訊已更新')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
    // name字數限制，account不能重複。
    // 比對是否跟上次的密碼是否重複
    // 比對兩次密碼是否重複
    // 修改成功資訊
  },
  getUserTweets: (req, res, next) => {
    const loginUserId = getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)`), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']
          ]
        },
        nest: true,
        raw: true
      }),
      Tweet.findAll({
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
            [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUserId} AND tweet_id = Tweet.id)`), 'isliked']
          ]
        },
        where: { UserId: queryUserId },
        nest: true,
        raw: true
      })
    ])
      .then(([user, tweets]) => {
        res.render('user-tweets', { user, tweets })
      })
  },
  getUserReplies: (req, res, next) => {
    const loginUserId = getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)`), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']
          ]
        },
        nest: true,
        raw: true
      }),
      Reply.findAll({
        where: { UserId: queryUserId },
        include: [{ model: Tweet, include: [User] }],
        nest: true,
        raw: true
      })
    ])
      .then(([user, replies]) => {
        res.render('user-replies', { user, replies })
      })
  },
  getUserLikes: (req, res, next) => {
    const loginUserId = getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)`), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']
          ]
        },
        nest: true,
        raw: true
      }),
      Like.findAll({
        where: { UserId: queryUserId },
        include: [{
          model: Tweet,
          include: [User],
          attributes: {
            include: [
              [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
              [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
              [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUserId} AND tweet_id = Tweet.id)`), 'isliked']
            ]
          }
        }],
        nest: true,
        raw: true
      })
    ])
      .then(([user, likes]) => {
        res.render('user-likes', { user, likes })
        console.log(likes)
      })
  },
  getUserFollowing: (req, res, next) => {
    const loginUserId = getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: ['id', 'name',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']],
        nest: true,
        raw: true
      }),
      Followship.findAll({
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            // [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE Followships.followerId = ${loginUserId} AND Followships.followingId=Followers.id)`), 'isFollowed']
          ]
        }],
        where: { followerId: queryUserId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
    ])
      .then(([user, followings]) =>
        res.render('following', { user, followings })
      )
      .catch(err => next(err))
  },
  getUserFollower: (req, res) => {
    const loginUserId = getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: ['id', 'name',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']],
        nest: true,
        raw: true
      }),
      Followship.findAll({
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            // [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE Followships.followerId = ${loginUserId} AND Followships.followingId=Followers.id)`), 'isFollowed']
          ]
        }],
        where: { followingId: queryUserId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
    ])
      .then(([user, followers]) =>
        res.render('follower', { user, followers })
      )
      .catch(err => next(err))
  },
}



module.exports = userController
