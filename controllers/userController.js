const { sequelize } = require('../models')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like



// -----------------------------------------------------------------------------------

module.exports = {

  getUser: (req, res) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Tweet.findAll({
        // raw: true,
        // nest: true,
        where: { UserId: req.params.id },
        include: [User, Reply, { model: Like, include: [User] }],
        order: [['createdAt', 'DESC']],
      }),
      User.findAll({
        // raw: true,
        // nest: true,
        include: [{ model: User, as: 'Followers' }]
      }),
      Like.findAll({
        where: { UserId: req.params.id },
        include: [User, { model: Tweet, include: [User, Reply, Like] }],
      })
    ]).then(([user, tweets, followings, likedTweets]) => {

      followings = followings.map(user => ({
        ...user.dataValues,
        isFollowed: user.Followers.map(d => d.id).includes(Number(req.params.id))
      }))
      followings = followings.filter(user => user.role !== "admin")
      followings = followings.filter(user => user.id !== Number(req.params.id))
      // console.log(req.query.page)

      // switch for pages, including '', reply, like
      let data = null
      if (req.query.page === '') {
        data = tweets.map(tweet => ({
          ...tweet.dataValues,
          countLikes: tweet.Likes.length,
          countReplies: tweet.Replies.length,
          User: tweet.User.dataValues,
          isLike: tweet.Likes.map(d => d.UserId).includes(Number(req.params.id)),
        }))
      } else if (req.query.page === 'like') {
        data = likedTweets.map(like => ({
          ...like.dataValues,
          User: like.Tweet.dataValues.User.dataValues,
          countLikes: like.Tweet.dataValues.Likes.length,
          countReplies: like.Tweet.dataValues.Replies.length,
          description: like.Tweet.dataValues.description,
          isLike: true,
        }))
      }

      return res.render('profile', {
        user: user.toJSON(),
        FollowersLength: user.dataValues.Followers.length,
        FollowingsLength: user.dataValues.Followings.length,
        tweetsLength: tweets.length,
        data: data,
        followings: followings,
        page: req.query.page
      })
    })
  },

  putUser: async (req, res) => {
    const nextURL = `/users/${req.params.id}`

    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect(nextURL)
    }

    if (!req.body.introduction) {
      req.flash('error_messages', 'introduction didn\'t exist')
      return res.redirect(nextURL)
    }

    const user = await User.findByPk(req.params.id)
    const avatarFile = req.files.avatar
    const coverFile = req.files.cover

    imgur.setClientID(process.env.IMGUR_CLIENT_ID);
    console.log(process.env.IMGUR_CLIENT_ID)

    if (coverFile) {
      imgur.upload(coverFile[0].path, (err, img) => {
        return user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          cover: coverFile ? img.data.link : user.cover,
          avatar: user.avatar,
        })
          .then(() => {
            if (avatarFile) {
              imgur.upload(avatarFile[0].path, (err, img) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: avatarFile ? img.data.link : user.avatar,
                  cover: user.cover,
                }).then(() => {
                  return user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    cover: user.cover,
                    avatar: user.avatar,
                  }).then(() => {
                    return res.redirect(`/users/${req.params.id}`)
                  })
                })
              })
            } else {
              return user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                cover: user.cover,
                avatar: user.avatar,
              }).then(() => {
                return res.redirect(`/users/${req.params.id}`)
              })
            }
          })
      })
    }

    if (avatarFile) {
      imgur.upload(avatarFile[0].path, (err, img) => {
        return user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          avatar: avatarFile ? img.data.link : user.avatar,
          cover: user.cover,
        })
          .then(() => {
            if (coverFile) {
              imgur.upload(coverFile[0].path, (err, img) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  cover: coverFile ? img.data.link : user.cover,
                  avatar: user.avatar,
                }).then(() => {
                  return user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    cover: user.cover,
                    avatar: user.avatar,
                  }).then(() => {
                    return res.redirect(`/users/${req.params.id}`)
                  })
                })
              })
            } else {
              return user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                cover: user.cover,
                avatar: user.avatar,
              }).then(() => {
                return res.redirect(`/users/${req.params.id}`)
              })
            }
          })
      })
    }

    return user.update({
      name: req.body.name,
      introduction: req.body.introduction,
      cover: user.cover,
      avatar: user.avatar,
    }).then(() => {
      return res.redirect(`/users/${req.params.id}`)
    })
  }

}
