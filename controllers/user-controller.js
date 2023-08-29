const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, Tweet, Reply } = require('../models')

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
    return res.render('followings')
  },
  getUserFollowers: (req, res, next) => {
    return res.render('followers')
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
          tweets,
          UserId: req.user.id,
          tweetCount,
          followerCount,
          followingCount,
          isFollowed,
          topUser
        })
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    res.render('user-replies')  
  },
  getUserLikes: (req, res, next) => {
    res.render('user-likes')
  }
}

module.exports = userController