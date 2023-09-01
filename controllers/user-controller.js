const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('密碼不一致!')
    if (req.body.name.length > 50) throw new Error('字數超出上限！')

    return User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { account: req.body.account }
        ]
      }
    })
      .then(user => {
        if (user) {
          if (user.toJSON().email === req.body.email) throw new Error('email 已重複註冊！')
          if (user.toJSON().account === req.body.account) throw new Error('account 已重複註冊！')
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        account: req.body.account,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊！')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  adminSignInPage: (req, res) => {
    return res.render('admin/signin')
  },
  adminSignIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getUserSetting: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    return User.findByPk(currentUserId, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        res.render('user-setting', { currentUserId, user })
      })

  },
  putUserSetting: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    const currentUserId = helpers.getUser(req).id
    if (!account || !name || !email || !password || !passwordCheck) throw new Error('所有欄位都是必填')
    if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符')
    if (name.length > 50) throw new Error('字數超出上限')
    
    Promise.all([
      User.findOne({ 
        raw: true,
        nest: true,
        where: {
          [Op.and]: [
              { account: account },
              { account: { [Op.notLike]: helpers.getUser(req).account } }
            ]
        }
      }),
      User.findOne({
        raw: true,
        nest: true,
        where: { 
          [Op.and]: [
            { email: email },
            { email: { [Op.notLike]: helpers.getUser(req).email } }
          ] 
        } 
      })
    ])
      .then(([findAccount, findEmail]) => {
        if (findAccount) throw new Error('帳號 已重複註冊！')
        if (findEmail) throw new Error('Email 已重複註冊！')
        Promise.all([
          User.findByPk(currentUserId),
          bcrypt.hash(password, 10)
        ])
          .then(([user, hashPassword]) => {
          return user.update({
            account,
            name,
            email,
            password: hashPassword
          })
        })
        .then(() => {
          req.flash('success_messages', '編輯成功!')
          res.redirect(`/users/${currentUserId}/setting`)
        })
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const userId = req.params.id
    const currentUserId = helpers.getUser(req).id
    return Promise.all([
      User.findByPk(userId, {
        include: [
          Tweet,
          { model: User, as: 'Followings' }
        ],
        order: [['Followings', 'createdAt', 'Desc']]
      }),
      User.findAll({
        where:{
          role: 'user',
           id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers'}
      })
    ])
      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        const tweetCount = userData.Tweets.length
        const followings = userData.Followings.map(following => ({
          ...following,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === following.id)
        }))

        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('followings', { user: userData, tweetCount, followings, topUser, currentUserId })
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const userId = req.params.id
    const currentUserId = helpers.getUser(req).id
    return Promise.all([
      User.findByPk(userId, {
        include: [
          Tweet,
          { model: User, as: 'Followers' }
        ],
        order: [['Followers', 'createdAt', 'Desc']]
      }),
      User.findAll({
        where:{
          role: 'user',
           id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers'}
      })
    ])
      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        const tweetCount = userData.Tweets.length
        const followers = userData.Followers.map(follower => ({
          ...follower,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === follower.id)
        }))
        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)

        res.render('followers', { user: userData, tweetCount, followers, topUser, currentUserId })
      })
      .catch(err => next(err))

  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUserTweets: (req, res, next) => {
    const userId = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    return Promise.all([
      User.findByPk(userId, {
        include: [
          // tweets Data
          {
            model: Tweet, include: [
              User,
              Reply,
              { model: User, as: 'LikedUsers' }
            ]
          },
          // profile Data
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'LikedTweets' }
        ],
        order: [['Tweets', 'createdAt', 'DESC']]
      }),
      // 推薦追隨
      User.findAll({
        where:{
          role: 'user',
           id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers'}
      })
    ])

      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        // 取使用者Like的推文id
        const likeTweets = helpers.getUser(req).LikedTweets ? helpers.getUser(req).LikedTweets.map(Lt => Lt.id) : []
        // profile 追隨鈕判斷
        const isFollowed = helpers.getUser(req).Followings ? helpers.getUser(req).Followings.map(Fu => Fu.id).includes(userId) : []
        const tweetCount = userData.Tweets.length
        const followerCount = userData.Followers.length
        const followingCount = userData.Followings.length
        const tweets = userData.Tweets.map(tweet => ({
          ...tweet,
          isLiked: likeTweets.includes(tweet.id),
          LikeCount: tweet.LikedUsers.length,
          replyCount: tweet.Replies.length
        }))
        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('user-tweets', {
          user: userData,
          currentUserId,
          tweetCount,
          followerCount,
          followingCount,
          isFollowed,
          topUser,
          tweets
        })
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const userId = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    return Promise.all([
      User.findByPk(userId, {
        include: [
          Tweet,
          { model: Reply, include: { model: Tweet, include: [User] } },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
        order: [[Reply, 'updatedAt', 'DESC']]
      }),
      // 推薦追隨
      User.findAll({
        where:{
          role: 'user',
           id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers'}
      })
    ])
      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        // Profile Data
        const isFollowed = helpers.getUser(req).Followings ? helpers.getUser(req).Followings.map(Fu => Fu.id).includes(userId) : []
        const tweetCount = userData.Tweets.length
        const followerCount = userData.Followers.length
        const followingCount = userData.Followings.length
        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)

        res.render('user-replies', {
          user: userData,
          currentUserId,
          tweetCount,
          followerCount,
          followingCount,
          isFollowed,
          topUser,
          replies: userData.Replies,
        })
      })
      .catch(err => next(err))

  },
  getUserLikes: (req, res, next) => {
    const userId = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    return Promise.all([
      User.findByPk(userId, {
        include: [
          Tweet,
          { model: Tweet, as: 'LikedTweets', include: [User, Reply, { model: User, as: 'LikedUsers' }] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
        order: [['LikedTweets', 'updatedAt', 'DESC']]
      }),
      // 推薦追隨
      User.findAll({
        where:{
          role: 'user',
           id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers'}
      })
    ])
      .then(([user, followShips]) => {
        const userData = user.toJSON()
        if (!user) throw new Error('使用者不存在')
        // 取使用者Like的推文id
        const likeTweets = helpers.getUser(req).LikedTweets ? helpers.getUser(req).LikedTweets.map(Lt => Lt.id) : []
        // Profile Data
        const isFollowed = helpers.getUser(req).Followings ? helpers.getUser(req).Followings.map(Fu => Fu.id).includes(userId) : []
        const tweetCount = userData.Tweets.length
        const followerCount = userData.Followers.length
        const followingCount = userData.Followings.length

        const tweets = userData.LikedTweets.map(tweet => ({
          ...tweet,
          isLiked: likeTweets.includes(tweet.id),
          LikeCount: tweet.LikedUsers.length,
          replyCount: tweet.Replies.length
        }))

       // 推薦追隨
      const topUser = followShips.map(followShip => ({
        ...followShip.toJSON(),
        followerCount: followShip.Followers.length,
        isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
      }))
        .sort((a, b) => b.followerCount - a.followerCount)
      res.render('user-likes', {
        user: userData,
        currentUserId,
        tweetCount,
        followerCount,
        followingCount,
        isFollowed,
        topUser,
        tweets
      })
    })
    .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const UserId = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    if (Number(UserId) === currentUserId) throw new Error('不能追蹤自己！')
    Promise.all([
      User.findByPk(UserId),
      Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId: UserId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('使用者不存在')
        if (followship) throw new Error('已追蹤該用戶')
        return Followship.create({
          followerId: currentUserId,
          followingId: UserId
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
      })
  },
  putUserProfile: (req, res, next) => {
    const { name, introduction } = req.body
    if (name.length > 50) throw new Error('名稱不可超過50字')
    if (introduction.length > 160) throw new Error('自我介紹不可超過160字')
    const id = helpers.getUser(req).id
    if (!name) throw new Error('名稱不可空白')
    const cover = req.files['cover'] ? req.files['cover'][0] : null
    const avatar = req.files['avatar'] ? req.files['avatar'][0] : null
    console.log(req.files)
    return Promise.all([User.findByPk(id),
      imgurFileHandler(cover),
      imgurFileHandler(avatar)
    ])
      .then(([user, cover, avatar]) => {
        if (!user) throw new Error('使用者不存在')
        return user.update({
          name,
          introduction,
          cover: cover || user.cover,
          avatar: avatar || user.avatar
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect('back')
      })
      .catch(err => next(err))
    })
  },
  removeFollowing: (req, res, next) => {
    const UserId = Number(req.params.id)
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: UserId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('未追蹤該用戶')
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController