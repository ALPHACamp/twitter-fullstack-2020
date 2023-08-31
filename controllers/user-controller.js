const db = require('../models')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like, Followship, Reply } = db
const helper = require('../_helpers')

const userController = {
  editUser: (req, res, next) => {
    const settingRoute = true
    const user = helper.getUser(req) || null
    User.findByPk(user.id, { raw: true, nest: true })
      .then(user => res.render('setting', { user, settingRoute, id: helper.getUser(req).id }))
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const currentUser = helper.getUser(req) || null
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
    const profileRoute = Number(currentUser) === Number(selectedUser)
    const otherProfileRoute = !profileRoute
    return Promise.all([
      Tweet.findAll({
        where: { UserId: Number(selectedUser) },
        include: [
          { model: User },
          { model: Like, as: 'LikedUsers' },
          { model: Reply }
        ],
        order: [['createdAt', 'DESC']]
      }),
      User.findByPk(Number(selectedUser), {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ])
      .then(([tweets, user]) => {
        if (!tweets.length) throw new Error('Tweets do not exist')
        if (!user) throw new Error('This user does not exist')
        const { Followers, Followings } = user.toJSON()
        tweets = tweets.map(tweet => {
          const { dataValues, LikedUsers, Replies, User } = tweet
          return ({
            ...dataValues,
            user: User.dataValues,
            likesCount: LikedUsers.length,
            repliesCount: Replies.length,
            isLiked: LikedUsers.some(likedUser => likedUser.dataValues.UserId === currentUser && likedUser.isLike)
          })
        })
        const tweetsUser = (tweets.length > 0) ? tweets[0].user : {}
        res.render('profile', {
          tweets,
          user,
          profileRoute,
          otherProfileRoute,
          tweetsUser,
          tweetsCount: tweets.length,
          followersCount: Followers.length,
          followingsCount: Followings.length
        })
      })
      .catch(err => next(err))
  },
  signInPage: (req, res, next) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    if (helper.getUser(req).role === 'admin') {
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
  getFollowers: (req, res, next) => {
    const otherProfileRoute = true
    const userId = req.params.id
    const currentUser = helper.getUser(req)
    return User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        const tweetsCount = user.Tweets.length
        const followers = user.Followers.map(follower => ({
          ...follower.toJSON(),
          followByMe: currentUser.Followings.some(following => following.id === follower.id),
          self: currentUser.id === follower.id
        }))
          .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        res.render('followers', { otherProfileRoute, tweetsCount, followers, user, tweetsUser: user.name, id: user.id })
      })
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    const otherProfileRoute = true
    const currentUser = helper.getUser(req)
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        const tweetsCount = user.Tweets.length
        const followings = user.Followings.map(following => ({
          ...following.toJSON(),
          followByMe: currentUser.Followings.some(followingByMe => followingByMe.id === following.id),
          self: currentUser.id === following.id
        }))
          .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        res.render('followings', { otherProfileRoute, tweetsCount, followings, user, tweetsUser: user.name, id: user.id })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const userId = req.body.id
    const currentUserId = helper.getUser(req).id || null
    if (Number(currentUserId) === Number(userId)) {
      req.flash('error_messages', 'cannot follow self')
      return res.redirect(200, 'back')
    }
    return Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: userId
      }
    })
      .then(followship => {
        if (followship) throw new Error('Your are already following this user!')
        return Followship.create({
          followerId: currentUserId,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  deleteFollowing: (req, res, next) => {
    const userId = req.params.id
    const currentUserId = helper.getUser(req).id || null
    return Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('You have not followed this user!')
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  likeTweet: (req, res, next) => {
    const currentUserId = helper.getUser(req).id || null
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
    const currentUserId = helper.getUser(req).id || null
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
          return like.destroy()
        }
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    const userId = req.params.id
    const currentUser = helper.getUser(req).id || null
    const profileRoute = Number(userId) === Number(currentUser)
    const otherProfileRoute = !profileRoute

    return User.findByPk(userId, {
      include: [
        {
          model: Like,
          as: 'LikedTweets',
          include: [
            {
              model: Tweet,
              include: [
                {
                  model: User
                },
                {
                  model: Like,
                  as: 'LikedUsers'
                },
                {
                  model: Reply
                }
              ]
            }
          ]
        },
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [[{ model: Like, as: 'LikedTweets' }, 'createdAt', 'DESC']]
    })
      .then(user => {
        if (!user) throw new Error('User does not exist!')
        const tweetsCount = user.Tweets.length
        const followersCount = user.dataValues.Followers.length
        const followingsCount = user.dataValues.Followings.length
        const likedTweets = user.LikedTweets.map(like => {
          const likedTweet = like.Tweet
          const tweetAuthor = likedTweet.User.dataValues
          return {
            id: tweetAuthor.id,
            avatar: tweetAuthor.avatar,
            name: tweetAuthor.name,
            account: tweetAuthor.account,
            tweetId: likedTweet.dataValues.id,
            tweetDescription: likedTweet.dataValues.description,
            tweetCreatedAt: likedTweet.dataValues.createdAt,
            likesCount: likedTweet.LikedUsers.length,
            repliesCount: likedTweet.Replies.length,
            isLiked: likedTweet.LikedUsers.some(likedUser => likedUser.UserId === currentUser && likedUser.isLike)
          }
        })
        res.render('userLikes', {
          likedTweets,
          user,
          profileRoute,
          otherProfileRoute,
          tweetsCount,
          followersCount,
          followingsCount,
          tweetsUser: user.dataValues
        })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const currentUser = helper.getUser(req).id || null
    const selectedUser = req.params.id

    const profileRoute = Number(currentUser) === Number(selectedUser)
    const otherProfileRoute = !profileRoute

    return Promise.all([
      Reply.findAll({
        where: { UserId: Number(selectedUser) },
        include: [
          {
            model: User,
            include: [
              { model: User, as: 'Followers' },
              { model: User, as: 'Followings' }
            ]
          },
          {
            model: Tweet,
            include: [
              { model: User }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      }),
      User.findByPk(Number(selectedUser), {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ])
      .then(([replies, user]) => {
        if (!replies.length) throw new Error('Replies do not exist for this user')
        if (!user) throw new Error('This user does not exist')

        const { Followers, Followings } = user.toJSON()
        // console.log(replies)
        // console.log(user)
        const formattedReplies = replies.map(reply => {
          const { dataValues, Tweet, User } = reply
          return ({
            ...dataValues,
            tweet: Tweet.dataValues,
            user: User.dataValues
          })
        })
        // console.log(formattedReplies)
        const repliesUser = (formattedReplies.length > 0) ? formattedReplies[0].user : {}

        res.render('userReplies', {
          replies: formattedReplies,
          user,
          profileRoute,
          otherProfileRoute,
          tweetsUser: repliesUser,
          repliesCount: formattedReplies.length,
          followersCount: Followers.length,
          followingsCount: Followings.length
        })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
