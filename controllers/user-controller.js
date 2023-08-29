const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, Tweet, Reply, Like } = require('../models')

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
    return res.render('user-setting')
  },
  getUserFollowings: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId, {
        include:[ 
          Tweet, 
          { model: User, as:'Followings'}
        ],
        order:[['Followings', 'createdAt', 'Desc']]
      }),
      User.findAll({
        include: { model: User, as: 'Followers'}
      })
    ]) 
      .then(([user, followShips])=> {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        const tweetCount =  userData.Tweets.length
        const followings = userData.Followings.map(following => ({
          ...following,
          isFollowed: req.user.Followings.some(f => f.id === following.id)
        }))
        
        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('followings', {user: userData, tweetCount, followings, topUser})
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId, {
        include:[ 
          Tweet, 
          { model: User, as:'Followers'}
        ],
        order:[['Followers', 'createdAt', 'Desc']]
      }),
      User.findAll({
        include: { model: User, as: 'Followers'}
      })
    ]) 
      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        const tweetCount =  userData.Tweets.length
        const followers = userData.Followers.map(follower => ({
          ...follower,
          isFollowed: req.user.Followings.some(f => f.id === follower.id)
        }))
        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)

        res.render('followers', {user: userData, tweetCount, followers, topUser})
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
    return Promise.all([
      User.findByPk( userId, {
        include: [
          // tweets Data
          { model: Tweet, include: [
              User, 
              Reply,
              {model: User, as: 'LikedUsers'}
            ]
          },
          // profile Data
          { model: User, as: 'Followers'}, 
          { model: User, as: 'Followings'},
          { model: Tweet, as: 'LikedTweets'}
        ],
        order: [['Tweets','createdAt', 'DESC']]
      }),
      // 推薦追隨
      User.findAll({
        include: { model: User, as: 'Followers'}
      })
    ]) 
    
      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        // 取使用者Like的推文id
        const likeTweets = req.user.LikedTweets.map(Lt => Lt.id)
        // profile 追隨鈕判斷
        const isFollowed = req.user.Followings.map(Fu => Fu.id).includes(userId)
        const tweetCount =  userData.Tweets.length
        const followerCount = userData.Followers.length
        const followingCount = userData.Followings.length
        const tweets = userData.Tweets.map(tweet => ({
          ...tweet,
          isLiked : likeTweets.includes(tweet.id),
          LikeCount: tweet.LikedUsers.length,
          replyCount: tweet.Replies.length
        }))
        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('user-tweets', { 
          user: userData,
          UserId: req.user.id,
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
    return Promise.all([
      User.findByPk(userId, {
        include: [
          Tweet,
          { model: Reply, include: { model: Tweet, include: [User] }},
          { model: User, as: 'Followers'}, 
          { model: User, as: 'Followings'},
        ],
        order: [[Reply, 'updatedAt', 'DESC']]
      }),
      // 推薦追隨
      User.findAll({
        include: { model: User, as: 'Followers'}
      })
    ])
    .then(([user, followShips]) => {
      if (!user) throw new Error('使用者不存在')
      const userData = user.toJSON()
      // Profile Data
      const isFollowed = req.user.Followings.map(Fu => Fu.id).includes(userId)
      const tweetCount =  userData.Tweets.length
      const followerCount = userData.Followers.length
      const followingCount = userData.Followings.length
      // 推薦追隨
      const topUser = followShips.map(followShip => ({
        ...followShip.toJSON(),
        followerCount: followShip.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === followShip.id)
      }))
        .sort((a, b) => b.followerCount - a.followerCount)

      res.render('user-replies', {
        user: userData,
        UserId: req.user.id,
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
    return Promise.all([
      User.findByPk(userId, {
        include: [
          Tweet,
          { model:Tweet, as:'LikedTweets', include: [User, Reply, {model: User, as: 'LikedUsers'}]},
          { model: User, as: 'Followers'}, 
          { model: User, as: 'Followings'},
        ],
        order: [['LikedTweets', 'updatedAt', 'DESC']]
      }),
      // 推薦追隨
      User.findAll({
        include: { model: User, as: 'Followers'}
      })
    ])
    .then(([user, followShips]) => {
      const userData = user.toJSON()
      if (!user) throw new Error('使用者不存在')
      // 取使用者Like的推文id
        const likeTweets = req.user.LikedTweets.map(Lt => Lt.id)
      // Profile Data
      const isFollowed = req.user.Followings.map(Fu => Fu.id).includes(userId)
      const tweetCount =  userData.Tweets.length
      const followerCount = userData.Followers.length
      const followingCount = userData.Followings.length

      const tweets = userData.LikedTweets.map(tweet => ({
          ...tweet,
          isLiked : likeTweets.includes(tweet.id),
          LikeCount: tweet.LikedUsers.length,
          replyCount: tweet.Replies.length
        }))
      // 推薦追隨
      const topUser = followShips.map(followShip => ({
        ...followShip.toJSON(),
        followerCount: followShip.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === followShip.id)
      }))
        .sort((a, b) => b.followerCount - a.followerCount)
      res.render('user-likes', {
        user: userData,
        UserId: req.user.id,
        tweetCount,
        followerCount,
        followingCount,
        isFollowed,
        topUser,
        likedTweets: tweets
      })
    })
    .catch(err => next(err))
    
  }
}

module.exports = userController