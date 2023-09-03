const bcrypt = require('bcryptjs')
const { User, Followship, Tweet, Reply } = require('../../models')
const helpers = require('../../_helpers')
const { Op } = require('sequelize')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password) {
      req.flash('error_messages', '所有欄位皆為必填')
      return res.render('signup', { account, name, email, password, checkPassword })
    }

    if (password !== checkPassword) {
      req.flash('error_messages', '密碼與密碼確認不相符')
      return res.render('signup', { account, name, email, password, checkPassword })
    }

    try {
      const usedAccount = await User.findOne({ where: { account } })
      if (usedAccount) {
        return res.render('signup', { account, name, email, password, checkPassword, message: '此帳號已被使用' })
      }

      const usedEmail = await User.findOne({ where: { email } })
      if (usedEmail) {
        req.flash('error_messages', '此 Email 已被使用')
        return res.render('signup', { account, name, email, password, checkPassword, message: '此 Email 已被使用' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })
      req.flash('success_messages', '註冊成功')
      return res.redirect('/signin')
    } catch (err) {
      return next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    res.redirect('/signin')
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [Tweet],
        order: [['createdAt', 'DESC']]
      })

      if (!user) { throw new Error("User didn't exist!") }

      res.render('users/self', { user: user.toJSON()/*, myUser: req.user.id */ })
    } catch (err) {
      next(err)
    }
  },

  addFollowing: (req, res, next) => {
    if (req.body.id.toString() === helpers.getUser(req).id.toString()) {
      res.status(200).send('不能追蹤自己')
    } else {
      return Promise.all([
        User.findByPk(req.body.id),
        Followship.findOne({
          where: {
            followerId: helpers.getUser(req).id,
            followingId: req.body.id
          }
        })
      ])
        .then(([user, followship]) => {
          if (!user) throw new Error("User didn't exist!")
          if (followship) throw new Error('You are already following this user!')
          return Followship.create({
            followerId: helpers.getUser(req).id,
            followingId: req.body.id
          })
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
    }
  },
  removeFollowing: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.id
        }
      })
    ]).then(([user, followship]) => {
      if (!user) throw new Error("User didn't exist!")
      if (!followship) throw new Error("You haven't following this user!")
      return followship.destroy()
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getFollowers: async (req, res, next) => {
    const UserId = req.params.id

    const [users, user] = await Promise.all([User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }),
    User.findByPk(UserId, {
      include: [{ model: User, as: 'Followers' }]
    })
    ])

    const usersSorted = users.map(user => ({
      ...user.toJSON(),
      followerCount: user.Followers.length,
      isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings.some(f => f.id === user.id)
    })).sort((a, b) => b.followerCount - a.followerCount).slice(0.10)

    const followers = user.Followers
    const followersSorted = followers.map(follower => ({
      ...follower.toJSON(),
      isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings.some(f => f.id === follower.id)
    })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

    res.render('followers', { users: usersSorted, followers: followersSorted })
  },
  getFollowings: async (req, res, next) => {
    const UserId = req.params.id

    const [users, user] = await Promise.all([User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }),
    User.findByPk(UserId, { include: [{ model: User, as: 'Followings' }] })
    ])

    const usersSorted = users.map(user => ({
      ...user.toJSON(),
      followerCount: user.Followers.length,
      isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings.some(f => f.id === user.id)
    })).sort((a, b) => b.followerCount - a.followerCount).slice(0.10)

    const followings = user.Followings
    const followingsSorted = followings.map(following => ({
      ...following.toJSON(),
      isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings.some(f => f.id === following.id)
    })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

    res.render('followings', { users: usersSorted, followings: followingsSorted })
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
    if (!account || !name || !email || !password || !passwordCheck) throw new Error('所有欄位皆為必填')
    if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符')
    if (name.length > 50) throw new Error('字數超出上限 50 字')

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
        if (findAccount) throw new Error('此帳號已被使用')
        if (findEmail) throw new Error('此 Email 已被使用')
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
        where: {
          role: 'user',
          id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers' }
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

        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
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
        where: {
          role: 'user',
          id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers' }
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
          .sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)

        res.render('followers', { user: userData, tweetCount, followers, topUser, currentUserId })
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const userId = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    return Promise.all([
      User.findByPk(userId, {
        include: [
          {
            model: Tweet,
            include: [
              User,
              Reply,
              { model: User, as: 'LikedUsers' }
            ]
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'LikedTweets' }
        ],
        order: [['Tweets', 'createdAt', 'DESC']]
      }),
      User.findAll({
        where: {
          role: 'user',
          id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers' }
      })
    ])
      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        const likeTweets = helpers.getUser(req).LikedTweets ? helpers.getUser(req).LikedTweets.map(Lt => Lt.id) : []
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

        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
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
          { model: User, as: 'Followings' }
        ],
        order: [[Reply, 'updatedAt', 'DESC']]
      }),

      User.findAll({
        where: {
          role: 'user',
          id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers' }
      })
    ])
      .then(([user, followShips]) => {
        if (!user) throw new Error('使用者不存在')
        const userData = user.toJSON()
        const isFollowed = helpers.getUser(req).Followings ? helpers.getUser(req).Followings.map(Fu => Fu.id).includes(userId) : []
        const tweetCount = userData.Tweets.length
        const followerCount = userData.Followers.length
        const followingCount = userData.Followings.length
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)

        res.render('user-replies', {
          user: userData,
          currentUserId,
          tweetCount,
          followerCount,
          followingCount,
          isFollowed,
          topUser,
          replies: userData.Replies
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
          { model: User, as: 'Followings' }
        ],
        order: [['LikedTweets', 'updatedAt', 'DESC']]
      }),

      User.findAll({
        where: {
          role: 'user',
          id: { [Op.not]: currentUserId }
        },
        include: { model: User, as: 'Followers' }
      })
    ])
      .then(([user, followShips]) => {
        const userData = user.toJSON()
        if (!user) throw new Error('使用者不存在')
        const likeTweets = helpers.getUser(req).LikedTweets ? helpers.getUser(req).LikedTweets.map(Lt => Lt.id) : []
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

        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
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
  putUserProfile: (req, res, next) => {
    const { name, introduction } = req.body
    if (name.length > 50) throw new Error('名稱不可超過 50 字')
    if (introduction.length > 160) throw new Error('自我介紹不可超過 160 字')
    const id = helpers.getUser(req).id
    if (!name) throw new Error('名稱不可為空白')
    const cover = req.files.cover ? req.files.cover[0] : null
    const avatar = req.files.avatar ? req.files.avatar[0] : null
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
  }

}
module.exports = userController

