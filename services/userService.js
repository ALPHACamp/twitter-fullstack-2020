const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  getUser: async (req, res, callback) => {
    const user = helpers.getUser(req)
    return callback(user)
  },

  getUserTweets: async (req, res, callback) => {
    const thisPageUser = await getThisPageUser(req)
    const tweets = await getTweets(req, { UserId: thisPageUser.id })
    return callback({
      thisPageUser,
      tweets,
      Appear: { navbar: true, top10: true }
    })
  },

  putProfile: async (req, res, callback) => {
    if (req.params.id !== helpers.getUser(req).id.toString()) {
      req.flash('error_messages', '您無權限修改內容')
      return callback()
    }
    if (!req.body.name) {
      req.flash('error_messages', '名稱不能為空白')
      return callback()
    }
    if (req.body.password !== req.body.confirmedPassword) {
      req.flash('error_messages', '兩次密碼不相同')
      return callback()
    }
    const files = req.files

    imgur.setClientID(IMGUR_CLIENT_ID)
    const getAvatarLink = new Promise((resolve, reject) => {
      if (files.avatarImage) {
        imgur.upload(files.avatarImage[0].path, (err, img) => {
          if (err) return reject(err)
          resolve(img.data.link)
        })
      } else {
        resolve()
      }
    })
    const getCoverLink = new Promise((resolve, reject) => {
      if (files.coverImage) {
        imgur.upload(files.coverImage[0].path, (err, img) => {
          if (err) return reject(err)
          resolve(img.data.link)
        })
      } else {
        resolve()
      }
    })
    let avatar = await getAvatarLink
    let cover = await getCoverLink
    if (req.body.cancelBackground) {
      cover = "https://i.imgur.com/gJ4dfOZ.jpeg"
    }
    user = await User.findByPk(helpers.getUser(req).id)
    await user.update({
      name: req.body.name,
      introduction: req.body.introduction,
      avatar: avatar,
      cover: cover,
      password: req.body.password,
    })
    req.flash('success_messages', '修改成功')
    return callback()


  },

  getUserReplies: async (req, res, callback) => {
    const thisPageUser = await getThisPageUser(req)
    let tweets = await getTweets(req, { '$Replies.UserId$': thisPageUser.id })
    return callback({
      thisPageUser,
      tweets,
      Appear: { navbar: true, top10: true }
    })
  },

  getUserLikes: async (req, res, callback) => {
    const thisPageUser = await getThisPageUser(req)
    const tweets = await getTweets(req, { '$LikedUsers.id$': thisPageUser.id })
    return callback({
      thisPageUser,
      tweets,
      Appear: { navbar: true, top10: true }
    })
  },

  getUserFollowers: async (req, res, callback) => {
    const thisPageUser = await getThisPageUser(req)
    let Followers = await User.findAll({
      where: {
        '$Followings.id$': thisPageUser.id
      },
      include: [
        { model: User, as: 'Followings' }
      ]
    })
    Followers = Followers.map(follower => ({
      ...follower.dataValues,
      isFollowing: helpers.getUser(req).Followings.map(following => following.id).includes(follower.id)
    }))
    return callback({
      thisPageUser,
      Followers,
      Appear: { navbar: true, top10: true }
    })
  },

  getUserFollowings: async (req, res, callback) => {
    const thisPageUser = await getThisPageUser(req)
    let Followings = await User.findAll({
      where: {
        '$Followers.id$': thisPageUser.id
      },
      include: [
        { model: User, as: 'Followers' }
      ]
    })
    Followings = Followings.map(following => ({
      ...following.dataValues,
      isFollowing: helpers.getUser(req).Followings.map(following => following.id).includes(following.id)
    }))
    return callback({
      thisPageUser,
      Followings,
      Appear: { navbar: true, top10: true }
    })
  },

}

async function getThisPageUser(req) {
  let thisPageUser = await User.findByPk(req.params.id, {
    include: [
      Tweet,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  thisPageUser = {
    ...thisPageUser.dataValues,
    TweetsCount: thisPageUser.Tweets.length,
    FollowersCount: thisPageUser.Followers.length,
    FollowingsCount: thisPageUser.Followings.length,
  }
  if (req.user.id !== req.params.id) {
    thisPageUser.isFollowing = thisPageUser.Followers.map(Follower => Follower.id).includes(req.user.id)
  }
  return thisPageUser
}

async function getTweets(req, whereCondition) {
  let tweets = await Tweet.findAll({
    include: [
      User,
      Reply,
      { model: User, as: 'LikedUsers' }
    ],
    where: whereCondition
  })
  tweets = tweets.map(tweet => ({
    ...tweet.dataValues,
    User: tweet.User.dataValues,
    RepliesCount: tweet.Replies.length,
    LikedUsersCount: tweet.LikedUsers.length,
    isLiked: tweet.LikedUsers.map(User => User.id).includes(req.user.id)
  }))
  return tweets
}

module.exports = userService