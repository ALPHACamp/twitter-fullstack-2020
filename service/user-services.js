const bcrypt = require('bcryptjs')

// sequelize
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { Op } = require('sequelize')

// helpers
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getOffset } = require('../helpers/pagination-helpers')
const { relativeTimeFromNow } = require('../helpers/handlebars-helpers')
const helpers = require('../_helpers')
const { CustomError } = require('../libs/error/custom-error')

const userServices = {
  getUserEditPage: async (req, cb) => {
    try {
      const usingUser = helpers.getUser(req) // req.user
      if (Number(req.params.id) !== usingUser.id) {
        return cb(null, {
          status: 'error',
          messages: '請勿修改他人資料!'
        })
      }

      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new CustomError("User didn't exist!", 'NotFoundError')

      return cb(null, user)
    } catch (error) {
      return cb(error)
    }
  },
  postUserInfo: async (req, cb) => {
  // 兩個編輯的地方共用一個function， 分別是個人資訊頁的編輯model，跟帳戶設定頁
    const emailRegex = /^\w+((-|\.)\w+)*@[A-Za-z0-9]+((-|\.)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new CustomError("User didn't exist!", 'NotFoundError')

      // 在 user edit model 藏一個isModel input 判斷此編輯請求從哪裡來
      const { email, name, account, password, checkPassword, introduction, isModel, notTest } = req.body
      const errors = []

      if (!name || !name.trim().length) {
        errors.push({ messages: '暱稱不得為空白!' })
      }

      if (notTest) {
        if (!isModel && !emailRegex.test(email)) {
          errors.push({ messages: 'Email格式不正確!' })
        }
      }

      if (name.length > 50) {
        errors.push({ messages: '暱稱不得超過50字!' })
      }

      // 帳戶設定沒有 introduction 所以多一個判斷
      if (isModel && introduction.length > 160) {
        errors.push({ messages: '自我介紹不得超過160字!' })
      }

      if (notTest) {
        if (!isModel && account !== user.toJSON().account) {
          const accountIsExist = await User.findOne({ where: { account } })
          accountIsExist && errors.push({ messages: '此account 已重複註冊！' })
        }

        if (!isModel && email !== user.toJSON().email) {
          const emailIsExist = await User.findOne({ where: { email } })
          emailIsExist && errors.push({ messages: 'email 已重複註冊！' })
        }
      }

      // model頁 雖然沒有password & checkPassword ，但是會同時為null
      if (password !== checkPassword) {
        errors.push({ messages: '密碼與確認密碼不相符!' })
      }

      if (errors.length) {
        const errorMessages = errors.map(error => error.messages).join(' & ')
        throw new CustoRmError(errorMessages, 'ValidateError')
      }

      // model頁沒有password ， 有才作加密
      const salt = password ? await bcrypt.genSalt(10) : null
      const hash = salt ? await bcrypt.hash(password, salt) : null

      // 處理上傳檔案
      // 如果不需要上傳圖片，就不進入helper
      // 測試黨沒有傳files
      const { avatarLink, coverLink } = isModel ? await imgurFileHandler(req.files) : { avatarLink: null, coverLink: null }

      // 更新的資料， 因為是共用的彼此都缺少一些欄位， 因此多一層判斷
      const updatedFields = {
        email: email || user.toJSON().email,
        name: name || user.toJSON().name,
        account: account || user.toJSON().account,
        password: hash || user.toJSON().password,
        introduction: isModel ? introduction : user.toJSON().introduction,
        avatar: avatarLink || user.toJSON().avatar,
        cover: coverLink || user.toJSON().cover
      }

      await user.update(updatedFields)

      return cb(null, updatedFields)
    } catch (error) {
      console.error(error)
      return cb(error)
    }
  },

  getUserInfo: (userId, followingId) => {
    return User.findByPk(followingId, {
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCount'],
          [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${userId}
                AND Followships.following_id = ${followingId}
              )`), 'isFollowed']
        ]
      },
      raw: true,
      nest: true
    })
  },

  getFollowings: async userId => {
    const userWithfollowings = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            'introduction',
            [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${userId}
                AND Followships.following_id = Followings.id
              )`), 'isFollowed'] // 查看此User是否已追蹤
          ],
          through: {
            model: Followship,
            attributes: ['createdAt']
          }
        }
      ],
      order: [[{ model: User, as: 'Followings' }, { model: Followship }, 'createdAt', 'DESC']]

    })

    return userWithfollowings.toJSON()
  },

  getFollowers: async userId => {
    const userWithfollowers = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            'introduction',
            [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${userId}
                AND Followships.following_id = Followers.id
              )`), 'isFollowed'] // 查看此User是否已追蹤
          ],
          through: {
            model: Followship,
            attributes: ['createdAt']
          }
        }
      ],
      order: [[{ model: User, as: 'Followers' }, { model: Followship }, 'createdAt', 'DESC']]

    })

    return userWithfollowers.toJSON()
  },

  topFollowedUser: userId => {
    return User.findAll({
      where: {
        id: { [Op.ne]: userId }, // 不要出現登入帳號
        role: { [Op.ne]: 'admin' } // admin不推薦, ne = not
      },
      attributes: {
        include: [
          // 使用 sequelize.literal 創建一個 SQL 子查詢來計算帖子數量
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'], // User不要加s, 坑阿！
          // req.user是追別人的,  findAll的user是被追的人
          [sequelize.literal(
            `(SELECT COUNT(*) FROM Followships
              WHERE Followships.follower_id = ${userId}
              AND Followships.following_id = User.id
            )`), 'isFollowed'] // 查看此User是否已追蹤
        ]
      },
      limit: 10,
      order: [['followerCount', 'DESC']],
      raw: true,
      nest: true
    })
  },
  getUserTweets: async (viewingUserId, loggingUserId, { limit = 8, page = 0 } = {}) => {
    const offset = getOffset(limit, page)
    const tweets = await Tweet.findAll({
      include: [
        {
          model: User,
          required: true
        }
      ],
      where: { UserId: viewingUserId },
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
          [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${loggingUserId})`), 'isLiked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      offset,
      limit
    })
    tweets.forEach(tweet => {
      tweet.createdFromNow = relativeTimeFromNow(tweet.createdAt)
    })
    return tweets
  },

  getLikeTweets: async (viewingUserId, loggingUserId, { limit = 8, page = 0 }) => {
    const offset = getOffset(limit, page)

    let tweets = await Tweet.findAll({
      include: [
        {
          model: User,
          required: true,
          attributes: ['id', 'avatar', 'name', 'account']
        },
        {
          model: Like,
          required: true,
          where: { UserId: viewingUserId },
          attributes: []
        }
      ],
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
          [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${loggingUserId})`), 'isLiked']
          //
        ]
      },
      // order: [['likeCreatedAt', 'DESC']],
      order: [[sequelize.literal(`(SELECT created_at FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${viewingUserId})`), 'DESC']],
      offset,
      limit
    })
    tweets = tweets.map(tweet => {
      tweet = tweet.toJSON()
      tweet.createdFromNow = relativeTimeFromNow(tweet.createdAt)
      return tweet
    })
    return tweets
  },
  getUserReplies: async (viewingUserId, { limit = 8, page = 0 } = {}) => {
    const offset = getOffset(limit, page)
    const replies = await Reply.findAll({
      where: {
        UserId: viewingUserId
      },
      include: [
        {
          model: Tweet,
          include: [{
            model: User,
            attributes: ['account'],
            require: true
          }],
          attributes: [],
          required: true
        },
        {
          model: User,
          attributes: ['name', 'account', 'avatar'],
          require: true
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      offset,
      limit
    })
    replies.forEach(reply => {
      reply.createdFromNow = relativeTimeFromNow(reply.createdAt)
    })
    return replies
  }
}
module.exports = userServices
