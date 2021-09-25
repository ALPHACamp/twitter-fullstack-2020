const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../../_helpers')


const userController = {
  getUser: (req, res) => {
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
      req.flash('error_messages', '不能編輯別人的個人資料！')
      return res.json()
    }
    const whereQuery = {}
    whereQuery.userId = req.params.id

    Tweet.findAndCountAll({
      include: [
        User,
        Reply,
        Like
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']],
    }).then(result => {
      const totalTweet = result.rows.length
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description,
        replyCount: r.dataValues.Replies.length,
        likeCount: r.dataValues.Likes.length,
        isLiked: helpers.getUser(req).LikedTweets ?
          helpers.getUser(req).LikedTweets.map(d => d.id).includes(r.id) : false
      }))

      Followship.findAndCountAll({
        raw: true,
        nest: true,
      }).then(result => {
        const followerCount = result.rows.filter(followerUser => followerUser.followerId === res.locals.user.id)
        const followingCount = result.rows.filter(followingUser => followingUser.followingId === res.locals.user.id)

        User.findByPk(req.params.id)
          .then(user => {
            let nameWordCount = ''
            let introWordCount = ''
            if (user.dataValues.introduction) {
              nameWordCount = user.dataValues.name.length
              introWordCount = user.dataValues.introduction.length
            }
            return res.render('self', {
              user: user.toJSON(),
              nameWordCount: nameWordCount,
              introWordCount: introWordCount,
              totalTweet: totalTweet,
              tweet: data,
              followerCount: followerCount.length,
              followingCount: followingCount.length
            })
          })
      })
    })
  },
  putUserEdit: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', "you can't enter other's profile!")
      return res.redirect('back')
    }

    const { files } = req
    const fileCountsArr = Object.keys(files)
    const fileCounts = fileCountsArr.length

    const getUploadLink = (link) => {
      return new Promise((resolve, reject) => {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(link, (err, img) => {
          return resolve(img.data.link)
        })
      })
    }

    if (fileCounts > 0) {
      const tempLink = []
      let image = ''
      if (files.avatar) {
        tempLink.push(files.avatar[0].path)
        image = 'avatar'
        editedUploadLink(tempLink, image)
      } else if (files.cover) {
        tempLink.push(files.cover[0].path)
        image = 'cover'
        editedUploadLink(tempLink, image)
      } else {
        tempLink.push(files.avatar[0].path, files.cover[0].path)
        image = 'both'
        editedUploadLink(tempLink, image)
      }

      async function editedUploadLink(tempLink, image) {
        try {
          const uploadImgs = await Promise.all(tempLink.map(async (link) => {
            const result = await getUploadLink(link)
            return result
          }))
          if (image === 'both') {
            User.findByPk(req.params.id)
              .then(user => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: uploadImgs[0],
                  cover: uploadImgs[1]
                }).then(user => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/self/${user.id}`)
                })
              })
          } else if (image === 'avatar') {
            User.findByPk(req.params.id)
              .then(user => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: uploadImgs[0],
                  cover: user.cover
                }).then(user => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/self/${user.id}`)
                })
              })
          } else if (image === 'cover') {
            User.findByPk(req.params.id)
              .then(user => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: user.avatar,
                  cover: uploadImgs[0]
                }).then(user => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/self/${user.id}`)
                })
              })
          }
        } catch (err) {
          console.warn(err)
        }
      }
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            cover: user.cover,
            avatar: user.avatar
          }).then(user => {
            req.flash('success_messages', 'profile was successfully to update')
            res.redirect(`/users/self/${user.id}`)
          })
        })
    }
  },
}

module.exports = userController