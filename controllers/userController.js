const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db

const userController = {
  getUserProfile: async (req, res) => {
    try {
      const userId = Number(req.params.userId)
      const user = await User.findByPk(userId, {
        attributes: [
          'id',
          'name',
          'avatar',
          'introduction',
          'account',
          'cover',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = user.id)`
            ),
            'tweetCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Replies WHERE Replies.UserId = user.id)`
            ),
            'replyCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = user.id)`
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = user.id)`
            ),
            'followingCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = user.id)`
            ),
            'followerCount'
          ]
        ],
        raw: true
      })
      return user
    } catch (err) {
      console.error(err)
    }
  },

  getUserTweets: async (req, res) => {
    try {
      const userId = Number(req.params.userId)
      const tweets = await Tweet.findAll({
        where: { UserId: userId },
        attributes: [
          'id',
          'description',
          'createdAt',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'
            ),
            'replyCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ${userId} LIMIT 1)`
            ),
            'isLiked'
          ]
        ],
        order: [['createdAt', 'DESC']],
        raw: true
      })
      return tweets
    } catch (err) {
      console.error(err)
    }
  },

  getUserReplies: async (req, res) => {
    try {
      const userId = Number(req.params.userId)
      const replies = await Reply.findAll({
        where: { UserId: userId },
        attributes: [
          'id',
          'comment',
          'createdAt',
          [
            sequelize.literal(
              `(SELECT account FROM Users WHERE Users.id = Reply.UserId)`
            ),
            'account'
          ]
        ],
        order: [['createdAt', 'DESC']],
        raw: true
      })
      return replies
    } catch (err) {
      console.error(err)
    }
  },

  getUserLikes: async (req, res) => {
    try {
      const userId = Number(req.params.userId)
      const likes = await Like.findAll({
        where: { UserId: userId },
        attributes: [],
        include: [
          {
            model: Tweet,
            attributes: [
              'id',
              'description',
              'createdAt',
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'
                ),
                'replyCount'
              ],
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'
                ),
                'likeCount'
              ],
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ${userId} LIMIT 1)`
                ),
                'isLiked'
              ]
            ],
            require: false
          }
        ],
        raw: true,
        nest: true
      })
      const tweets = likes
        .map((like) => like.Tweet)
        .sort((a, b) => b.createdAt - a.createdAt)
      return tweets
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowers: async (req, res) => {
    try {
      const userId = Number(req.params.userId)
      const followship = await User.findByPk(userId, {
        attributes: [],
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: [
              'id',
              'name',
              'avatar',
              'introduction',
              'account',
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = Followers.id AND Followships.followerId = ${userId} LIMIT 1)`
                ),
                'isFollowed'
              ]
            ],
            require: false
          }
        ]
      })
      let followers = followship.toJSON().Followers

      followers = followers.map((follower) => ({
        id: follower.id,
        name: follower.name,
        avatar: follower.avatar,
        introduction: follower.introduction,
        account: follower.account,
        followshipCreatedAt: follower.Followship.createdAt,
        isFollowed: follower.isFollowed
      }))

      followers = followers.sort(
        (a, b) => b.followshipCreatedAt - a.followshipCreatedAt
      )

      return followers
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowings: async (req, res) => {
    try {
      const UserId = Number(req.params.userId)
      let followings = await User.findAll({
        where: { id: UserId },
        attributes: [],
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'name', 'avatar', 'introduction', 'account'],
            require: false
          }
        ]
      })

      followings = followings[0].dataValues.Followings.map((following) => ({
        id: following.id,
        name: following.name,
        avatar: following.avatar,
        introduction: following.introduction,
        account: following.account,
        followshipCreatedAt: following.Followship.createdAt,
        isFollowed: following.Followship.followerId === UserId
      }))

      followings = followings.sort(
        (a, b) => b.followshipCreatedAt - a.followshipCreatedAt
      )

      return followings
    } catch (err) {
      console.error(err)
    }
  },

  getPopular: async (req, res) => {
    try {
      let pops = await User.findAll({
        attributes: [
          'id',
          'email',
          'name',
          'avatar',
          'account',
          'role',
          'createdAt',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followerCount'
          ]
        ]
      })

      let followings = await Followship.findAll({
        where: { followerId: helpers.getUser(req).id }
      })
      followings = followings.map(
        (following) => following.dataValues.followingId
      )

      pops = pops.filter((pop) => pop.dataValues.role !== 'admin')
      pops = pops.filter((pop) => pop.dataValues.id !== helpers.getUser(req).id)
      pops = pops
        .map((pop) => ({
          ...pop.dataValues,
          isFollowing: followings.includes(pop.dataValues.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)

      return pops // 返回前10 populars array
    } catch (err) {
      console.error(err)
    }
  },

  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (checkPassword !== password) {
        errors.push({ message: '兩次密碼輸入不同！' })
      }

      const user1Promise = User.findOne({ where: { account } })
      const user2Promise = User.findOne({ where: { email } })
      const [user1, user2] = await Promise.all([user1Promise, user2Promise])

      if (user1) {
        errors.push({ message: 'account 已重覆註冊！' })
      }

      if (user2) {
        errors.push({ message: 'email 已重複重複！' })
      }

      if (errors.length) {
        return res.render('signup', { errors, ...req.body })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      console.error(err)
    }
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')

    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return res.redirect('/tweets')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')

    if (helpers.getUser(req).role === 'admin') {
      req.logout()
      return res.redirect('/admin/signin')
    }
    req.logout()
    return res.redirect('/signin')
  },

  updateSettings: async (req, res) => {
    try {
      const userId = Number(req.params.userId)
      if (helpers.getUser(req).id !== userId) {
        req.flash('error_messages', '你無權查看此頁面')
        return res.redirect('back')
      }

      let user = await User.findByPk(userId)
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (checkPassword !== password) {
        errors.push({ message: '兩次密碼輸入不同！' })
      }

      const user1Promise = User.findOne({
        where: { account, [Op.not]: { id: userId } }
      })
      const user2Promise = User.findOne({
        where: { email, [Op.not]: { id: userId } }
      })
      const [user1, user2] = await Promise.all([user1Promise, user2Promise])

      if (user1) {
        errors.push({ message: 'account 已重覆註冊！' })
      }

      if (user2) {
        errors.push({ message: 'email 已重複重複！' })
      }

      if (errors.length) {
        return res.render('signup', { errors, ...req.body })
      }

      if (password === '') {
        await user.update({
          account,
          name,
          email
        })
      } else {
        await user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
      }

      req.flash('success_messages', '成功編輯帳號！')
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
