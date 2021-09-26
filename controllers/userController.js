const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const userController = {
  getSignup: (req, res) => {
    return res.render('signup', { layout: 'userMain' })
  },

  postSignup: async (req, res) => {
    const { name, account, email, password, checkPassword } = req.body
    const error = []
    if (req.body.password !== req.body.checkPassword) {
      req.flash('error_messages', '兩次密碼輸入不符！')
      res.redirect('/signup')
    }
    const userEmail = await User.findOne({ where: { email: req.body.email } })
    const userAccount = await User.findOne({ where: { account: req.body.account } })
    if (userEmail) {
      error.push({ message: '此Email已註冊過' })
      return res.render('signup', {
        layout: 'userMain',
        error,
        account,
        name,
        email,
        password,
        checkPassword
      })
    }
    if (userAccount) {
      error.push({ message: '此Account已註冊過' })
      return res.render('signup', {
        layout: 'userMain',
        error,
        account,
        name,
        email,
        password,
        checkPassword
      })
    }

    await User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }).then(() => {
      req.flash('success_messages', '註冊成功')
      res.redirect('/signin')
    })
  },

  getLogin: (req, res) => {
    return res.render('userLogin', { layout: 'userMain' })
  },

  postLogin: (req, res) => {
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },

  getUserTweets: (req, res) => {
    const whereQuery = {}
    whereQuery.userId = req.params.id
    let loginUser = false

    if (helpers.getUser(req).id === Number(req.params.id)) {
      loginUser = true
    }

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
            return res.render('selfTweets', {
              user: user.toJSON(),
              nameWordCount: nameWordCount,
              introWordCount: introWordCount,
              totalTweet: totalTweet,
              tweet: data,
              followerCount: followerCount.length,
              followingCount: followingCount.length,
              isLoginUser: loginUser,
              isFollowed: helpers.getUser(req).Followings ?
                helpers.getUser(req).Followings.map(d => d.id).includes(user.id) : false
            })
          })
      })
    })
  },

  getUserReply: (req, res) => {
    let loginUser = false
    if (helpers.getUser(req).id === Number(req.params.id)) {
      loginUser = true
    }

    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Reply.findAndCountAll({
      include: [
        { model: Tweet, include: [User] }
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']],
    }).then(result => {
      const data = result.rows.map(r => ({
        ...r.dataValues,
        comment: r.dataValues.comment,
        replyTweetId: r.dataValues.Tweet.id,
        replyUserId: r.dataValues.Tweet.dataValues.User.id,
        replyUserAccount: r.dataValues.Tweet.dataValues.User.account
      }))
      Tweet.findAndCountAll({
        where: whereQuery,
      }).then(result => {
        const totalTweet = result.rows.length


        Followship.findAndCountAll({
          raw: true,
          nest: true,
        }).then(result => {
          const followerCount = result.rows.filter(followerUser => followerUser.followerId === Number(req.params.id))
          const followingCount = result.rows.filter(followingUser => followingUser.followingId === Number(req.params.id))

          User.findByPk(req.params.id)
            .then(user => {
              const nameWordCount = user.dataValues.name.length
              const introWordCount = user.dataValues.introduction.length
              return res.render('selfReply', {
                user: user.toJSON(),
                nameWordCount: nameWordCount,
                introWordCount: introWordCount,
                totalTweet: totalTweet,
                Reply: data,
                followerCount: followerCount.length,
                followingCount: followingCount.length,
                isLoginUser: loginUser
              })
            })
        })
      })
    })
  },

  getUserLike: async (req, res) => {
    let loginUser = false
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      loginUser = false
    } else {
      loginUser = true
    }

    const currentUser = await User.findByPk(req.params.id, {
      include: [Like]
    })
    const currentUserLikes = currentUser.dataValues.Likes
    console.log('currentUser', currentUserLikes)

    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Like.findAndCountAll({
      include: [
        { model: Tweet, include: [User, Reply, Like] }
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']],
    }).then(result => {
      const data = result.rows.map(r => ({
        ...r.dataValues,
        ...currentUserLikes.dataValues,
        tweetId: r.dataValues.Tweet.dataValues.id,
        description: r.dataValues.Tweet.dataValues.description,
        createdAt: r.dataValues.createdAt,
        likeUserId: r.dataValues.Tweet.dataValues.User.id,
        isLiked: helpers.getUser(req).LikedTweets ?
          helpers.getUser(req).LikedTweets.map(d => d.id).includes(r.TweetId) : false,
        likeAvatar: r.dataValues.Tweet.dataValues.User.avatar,
        likeUserName: r.dataValues.Tweet.dataValues.User.name,
        likeUserAccount: r.dataValues.Tweet.dataValues.User.account,
        replyCount: r.dataValues.Tweet.dataValues.Replies.length,
        likeCount: r.dataValues.Tweet.dataValues.Likes.length
      }))
      console.log('data', data)
      Tweet.findAndCountAll({
        where: whereQuery,
      }).then(result => {
        const totalTweet = result.rows.length

        Followship.findAndCountAll({
          raw: true,
          nest: true,
        }).then(result => {
          const followerCount = result.rows.filter(followerUser => followerUser.followerId === Number(req.params.id))
          const followingCount = result.rows.filter(followingUser => followingUser.followingId === Number(req.params.id))

          User.findByPk(req.params.id)
            .then(user => {
              let nameWordCount = ''
              let introWordCount = ''
              if (user.dataValues.introduction) {
                nameWordCount = user.dataValues.name.length
                introWordCount = user.dataValues.introduction.length
              }
              return res.render('selfLike', {
                user: user.toJSON(),
                nameWordCount: nameWordCount,
                introWordCount: introWordCount,
                totalTweet: totalTweet,
                Like: data,
                followerCount: followerCount.length,
                followingCount: followingCount.length,
                isLoginUser: loginUser
              })
            })
        })
      })
    })
  },

  // putUserEdit: (req, res) => {
  //   if (helpers.getUser(req).id !== Number(req.params.id)) {
  //     req.flash('error_messages', "you can't enter other's profile!")
  //     return res.redirect('back')
  //   }

  //   const { files } = req
  //   const fileCountsArr = Object.keys(files)
  //   const fileCounts = fileCountsArr.length

  //   const getUploadLink = (link) => {
  //     return new Promise((resolve, reject) => {
  //       imgur.setClientID(IMGUR_CLIENT_ID)
  //       imgur.upload(link, (err, img) => {
  //         return resolve(img.data.link)
  //       })
  //     })
  //   }

  //   if (fileCounts > 0) {
  //     const tempLink = []
  //     let image = ''
  //     if (files.avatar) {
  //       tempLink.push(files.avatar[0].path)
  //       image = 'avatar'
  //       editedUploadLink(tempLink, image)
  //     } else if (files.cover) {
  //       tempLink.push(files.cover[0].path)
  //       image = 'cover'
  //       editedUploadLink(tempLink, image)
  //     } else {
  //       tempLink.push(files.avatar[0].path, files.cover[0].path)
  //       image = 'both'
  //       editedUploadLink(tempLink, image)
  //     }

  //     async function editedUploadLink(tempLink, image) {
  //       try {
  //         const uploadImgs = await Promise.all(tempLink.map(async (link) => {
  //           const result = await getUploadLink(link)
  //           return result
  //         }))
  //         if (image === 'both') {
  //           User.findByPk(req.params.id)
  //             .then(user => {
  //               user.update({
  //                 name: req.body.name,
  //                 introduction: req.body.introduction,
  //                 avatar: uploadImgs[0],
  //                 cover: uploadImgs[1]
  //               }).then(user => {
  //                 req.flash('success_messages', 'profile was successfully to update')
  //                 res.redirect(`/users/self/${user.id}`)
  //               })
  //             })
  //         } else if (image === 'avatar') {
  //           User.findByPk(req.params.id)
  //             .then(user => {
  //               user.update({
  //                 name: req.body.name,
  //                 introduction: req.body.introduction,
  //                 avatar: uploadImgs[0],
  //                 cover: user.cover
  //               }).then(user => {
  //                 req.flash('success_messages', 'profile was successfully to update')
  //                 res.redirect(`/users/self/${user.id}`)
  //               })
  //             })
  //         } else if (image === 'cover') {
  //           User.findByPk(req.params.id)
  //             .then(user => {
  //               user.update({
  //                 name: req.body.name,
  //                 introduction: req.body.introduction,
  //                 avatar: user.avatar,
  //                 cover: uploadImgs[0]
  //               }).then(user => {
  //                 req.flash('success_messages', 'profile was successfully to update')
  //                 res.redirect(`/users/self/${user.id}`)
  //               })
  //             })
  //         }
  //       } catch (err) {
  //         console.warn(err)
  //       }
  //     }
  //   } else {
  //     return User.findByPk(req.params.id)
  //       .then(user => {
  //         user.update({
  //           name: req.body.name,
  //           introduction: req.body.introduction,
  //           cover: user.cover,
  //           avatar: user.avatar
  //         }).then(user => {
  //           req.flash('success_messages', 'profile was successfully to update')
  //           res.redirect(`/users/self/${user.id}`)
  //         })
  //       })
  //   }
  // },

  getUserFollower: (req, res) => {
    User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers' },],
      oder: ['createdAt', 'DESC']
    }).then(followers => {
      const followersData = followers.dataValues.Followers.map(follower => ({
        ...follower,
        followerAvatar: follower.avatar,
        followerName: follower.name,
        followerAccount: follower.account,
        followerIntroduction: follower.introduction,
        isFollowed: helpers.getUser(req).Followings ?
          helpers.getUser(req).Followings.map(d => d.id).includes(follower.id) : false
      }))
      return res.render('selfFollower', { followersData })
    })
  },

  getUserFollowing: (req, res) => {
    User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' },],
      oder: ['createdAt', 'DESC']
    }).then(followings => {
      const followingsData = followings.dataValues.Followings.map(following => ({
        ...following,
        followingAvatar: following.avatar,
        followingName: following.name,
        followingAccount: following.account,
        followingIntroduction: following.introduction,
        isFollowed: helpers.getUser(req).Followings ?
          helpers.getUser(req).Followings.map(d => d.id).includes(following.id) : false
      }))
      return res.render('selfFollowing', { followingsData })
    })
  },

  getUserSetting: (req, res) => {
    const id = req.user.id

    User.findByPk(id)
      .then(user => {
        return res.render('setting', {
          layout: 'settingMain',
          user: user.toJSON()
        })
      })
  },

  putUserSetting: (req, res) => {
    const { account, name, email, password } = req.body
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          return res.redirect(`/users/${user.id}/tweets`)
        })
      })
  },

}

module.exports = userController