const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const { Op } = require("sequelize")
const sequelize = require('sequelize')
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship


const imgur = require('imgur-node-api')
const { fakeServer } = require('sinon')
const followship = require('../models/followship')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (account.length < 5 || !name || name.length > 50 || !email || checkPassword !== password) {
      req.flash('error_messages', '表單內容不符合條件！')
      return res.redirect('/signup')
    }
    //註冊時，account 和 email 不能與其他人重覆
    User.findAll({
      raw: true, nest: true,
      where: { [Op.or]: [{ email }, { account }] }
    })
      .then(users => {
        if (users.some(item => item.account === account)) {
          req.flash('error_messages', '註冊失敗，account 已重覆註冊！')
          //64656
          return res.redirect('/signup')
        }
        if (users.some(item => item.email === email)) {
          req.flash('error_messages', '註冊失敗，email 已重覆註冊！')
          return res.redirect('/signup')
        }
        User.create({
          name,
          account,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          req.flash('success_messages', 'Your account had been successfully registered!')
          return res.redirect('/signin')
        })
      })
  },

  getUserSetting: (req, res) => {
    //檢查使用者是否在編輯自己的資料
    if (req.params.id !== String(helpers.getUser(req).id)) {
      req.flash('error_messages', '無法編輯其他使用者的資料')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
    }
    User.findByPk(req.params.id)
      .then(user => {
        return res.render('setting', { currentUser: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  putUserEdit: async (req, res) => {
    const { name, introduction } = req.body
    console.log(req.body)
    if (!name) {
      req.flash('error_messages', '暱稱不能空白！')
      return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
    }
    if (name.length > 50 || introduction.length > 160) {
      req.flash('error_messages', '字數超出上限！')
      return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
    }

    // const file = Object.assign({}, req.files)
    const { files } = req
    const isCoverDelete = req.body.isDelete
    const user = await User.findByPk(req.params.id)

    // if (files) {
    //files會有[Object: null prototype] {}
    imgur.setClientID(IMGUR_CLIENT_ID)
    if (files.avatar && files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        imgur.upload(files.cover[0].path, async (err, covImg) => {
          await user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: avaImg.data.link,
            cover: isCoverDelete ? '' : covImg.data.link
          })
          req.flash('success_messages', 'user profile was successfully updated!')
          return res.redirect('back')
        })
      }
      )
    } else if (files.avatar && !files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          avatar: avaImg.data.link,
          cover: isCoverDelete ? '' : user.cover
        })
        req.flash('success_messages', 'user profile was successfully updated!')
        return res.redirect('back')
      })
    } else if (!files.avatar && files.cover) {
      imgur.upload(files.cover[0].path, async (err, covImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          cover: isCoverDelete ? '' : covImg.data.link,
        })
        req.flash('success_messages', 'user profile was successfully updated!')
        return res.redirect('back')
      })
    } else {
      await user.update({
        name: req.body.name,
        introduction: req.body.introduction,
        cover: isCoverDelete ? '' : user.cover
      })
      req.flash('success_messages', 'user profile was successfully updated!')
      return res.redirect('back')
    }
  },

  // //new get Tweets
  getUserTweets: (req, res) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Like, include: [User] },
          { model: Reply, include: [User] },
        ],
        order: [['createdAt', 'DESC']]
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      }),
    ]).then(([tweets, user, users]) => {
      //整理某使用者的所有推文 & 每則推文的留言數和讚數 & 登入中使用者是否有按讚
      const data = tweets.map(tweet => ({
        id: tweet.id,
        description: tweet.description,
        tweetedAt: tweet.createdAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: tweet.Likes.map(d => d.UserId).includes(currentUser.id)
      }))
      //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
      const viewUser = Object.assign({}, {
        id: user.id,
        name: user.name,
        account: user.account,
        introduction: user.introduction,
        cover: user.cover,
        avatar: user.avatar,
        tweetsCount: user.Tweets.length,
        followingsCount: user.Followings.length,
        followersCount: user.Followers.length,
        isFollowed: req.user.Followings.map((d) => d.id).includes(user.id),
        isSelf: Boolean(user.id === currentUser.id)
      })
      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
      return res.render('tweets', { data, viewUser, currentUser, topUsers })
    })
      .catch(err => console.log(err))
  },

  // //old getTweets
  // getUserTweets: (req, res) => {
  //   const currentUser = helpers.getUser(req)
  //   return Promise.all([
  //     Tweet.findAll({
  //       where: { UserId: req.params.id },
  //       include: [
  //         { model: Like, include: [User] },
  //         { model: Reply, include: [User] },
  //       ],
  //       order: [['createdAt', 'DESC']]
  //     }),
  //     User.findAll({
  //       where: { role: { [Op.ne]: 'admin' } },
  //       include: [
  //         { model: Tweet },
  //         { model: User, as: 'Followers' },
  //         { model: User, as: 'Followings' }
  //       ]
  //     })
  //   ]).then(([tweets, users]) => {
  //     //整理某使用者的所有推文 & 每則推文的留言數和讚數 & 登入中使用者是否有按讚
  //     const data = tweets.map(r => ({
  //       ...r.dataValues,
  //       isLiked: r.dataValues.Likes.map(d => d.UserId).includes(currentUser.id)
  //     }))
  //     //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
  //     const viewUser = users.filter(obj => { return obj.dataValues.id === Number(req.params.id) })
  //     const isFollowed = viewUser[0].Followers.map((d) => d.id).includes(currentUser.id)
  //     //B. 取得所有使用者 & 依 followers 數量排列前 10 的使用者推薦名單
  //     const allUsers = users.map(user => ({
  //       ...user.dataValues,
  //       FollowerCount: user.Followers.length,
  //       myself: Boolean(user.id === currentUser.id),
  //       isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
  //     }))
  //     const topUsers = allUsers.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
  //     return res.render('tweets', {
  //       data,
  //       viewUser: viewUser[0].toJSON(),
  //       currentUser,
  //       isFollowed,
  //       topUsers
  //     })
  //   })
  //     .catch(err => console.log(err))
  // },

  getUserReplied: (req, res) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      Reply.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Tweet, include: [User] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true, nest: true
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      }),
    ]).then(([replies, user, users]) => {
      //整理某使用者的所有回覆
      const data = replies.map(reply => ({
        comment: reply.comment,
        tweetId: reply.TweetId,
        repliedAt: reply.createdAt,
        repliedByAccount: reply.Tweet.User.account,
        repliedById: reply.Tweet.User.id
      }))
      //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
      const viewUser = Object.assign({}, {
        id: user.id,
        name: user.name,
        account: user.account,
        introduction: user.introduction,
        cover: user.cover,
        avatar: user.avatar,
        tweetsCount: user.Tweets.length,
        followingsCount: user.Followings.length,
        followersCount: user.Followers.length,
        isFollowed: user.Followers.map((d) => d.id).includes(currentUser.id),
        isSelf: Boolean(user.id === currentUser.id)
      })
      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
      return res.render('replied', { data, viewUser, currentUser, topUsers })
    })
  },

  getUserLikes: (req, res) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      Like.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Tweet, include: [Reply, Like, User] }
        ],
        order: [['createdAt', 'DESC']]
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      }),
    ]).then(([likes, user, users]) => {
      //整理某使用者所有讚過的推文 & 每則推文的留言數和讚數 & 登入中使用者是否有按讚
      const data = likes.map(like => ({
        id: like.Tweet.User.id,
        name: like.Tweet.User.name,
        account: like.Tweet.User.account,
        avatar: like.Tweet.User.avatar,
        likedAt: like.createdAt,
        tweetId: like.TweetId,
        tweetDescription: like.Tweet.description,
        tweetReplyCount: like.Tweet.Replies.length,
        tweetLikeCount: like.Tweet.Likes.length,
        isLiked: like.Tweet.Likes.map(d => d.UserId).includes(currentUser.id)
      }))
      //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
      const viewUser = Object.assign({}, {
        id: user.id,
        name: user.name,
        account: user.account,
        introduction: user.introduction,
        cover: user.cover,
        avatar: user.avatar,
        tweetsCount: user.Tweets.length,
        followingsCount: user.Followings.length,
        followersCount: user.Followers.length,
        isFollowed: user.Followers.map((d) => d.id).includes(currentUser.id),
        isSelf: Boolean(user.id === currentUser.id)
      })
      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
      return res.render('likes', { data, viewUser, currentUser, topUsers })
    })
      .catch(err => console.log(err))
  },

  putUserSetting: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    //後端驗證表單內容
    if (account.length < 5 || !name || name.length > 50 || !email || checkPassword !== password) {
      req.flash('error_messages', '表單內容不符合條件！')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
    }
    //編輯時，account 和 email 不能與其他人重覆
    User.findAll({
      raw: true, nest: true,
      where: {
        [Op.or]: [{ email }, { account }],
        id: { [Op.ne]: helpers.getUser(req).id }
      }
    })
      .then(users => {
        if (users.some(item => item.account === account)) {
          req.flash('error_messages', 'account 已被他人使用！')
          return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
        }
        if (users.some(item => item.email === email)) {
          req.flash('error_messages', 'email 已被他人使用！')
          return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
        }
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              account,
              name,
              email,
              password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password
            })
              .then(() => {
                req.flash('success_messages', '使用者設定已成功被更新!')
                res.redirect('back')
              })
              .catch(err => console.error(err))
          })
      })
  },


  signInPage: (req, res) => {
    return res.render('signIn')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserFollowings: (req, res) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findOne({
        where: { id: req.params.id },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      }),
    ]).then(([user, users]) => {
      //整理某使用者的所有推文 & 每則推文的留言數和讚數 & 登入中使用者是否有按讚
      const usersFollowings = user.Followings.map(d => ({
        ...d.dataValues,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(d.dataValues.id)
      }))

      let noFollowing = usersFollowings.length === 0 ? true : false

      //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
      const viewUser = Object.assign({}, {
        id: user.id,
        name: user.name,
        // account: user.account,
        // introduction: user.introduction,
        // cover: user.cover,
        // avatar: user.avatar,
        tweetsCount: user.Tweets.length,
        // followingsCount: user.Followings.length,
        // followersCount: user.Followers.length,
        // isFollowed: currentUser.Followers.map((d) => d.id).includes(user.id),
        // isSelf: Boolean(user.id === currentUser.id)
      })
      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
      return res.render('followship', {
        usersFollowings: usersFollowings.length !== 0 ? usersFollowings : true,
        user: req.user,
        topUsers,
        viewUser,
        noFollowing
      })
    })
  },

  getUserFollowers: (req, res) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findOne({
        where: { id: req.params.id },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      }),
    ]).then(([user, users]) => {
      //整理某使用者的所有推文 & 每則推文的留言數和讚數 & 登入中使用者是否有按讚
      const usersFollowers = user.Followers.map(d => ({
        ...d.dataValues,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(d.dataValues.id)
      }))

      let noFollower = usersFollowers.length === 0 ? true : false

      //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
      const viewUser = Object.assign({}, {
        id: user.id,
        name: user.name,
        // account: user.account,
        // introduction: user.introduction,
        // cover: user.cover,
        // avatar: user.avatar,
        tweetsCount: user.Tweets.length,
        // followingsCount: user.Followings.length,
        // followersCount: user.Followers.length,
        // isFollowed: currentUser.Followings.map((d) => d.id).includes(user.id),
        // isSelf: Boolean(user.id === currentUser.id)
      })
      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
      return res.render('followship', {
        usersFollowers: usersFollowers.length !== 0 ? usersFollowers : true,
        user: req.user,
        topUsers,
        viewUser,
        noFollower
      })
    })
  },

  addFollowing: async (req, res) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.body.id)
      const user = await User.findByPk(followerId)
      const targetUser = await User.findByPk(followingId)
      const followship = await Followship.findOne({
        where: {
          [Op.and]: [
            { followerId },
            { followingId }
          ]
        }
      })


      if (!user || !targetUser) {
        req.flash('error_messages', '無效使用者')
        return res.status(400).redirect('/tweets')
      }

      if (followerId === followingId) {
        req.flash('error_messages', '無法追蹤自己')
        return res.status(400).redirect('/tweets')
      }

      if (followship) {
        req.flash('error_messages', '不得重複追蹤')
        return res.status(400).redirect('back')
      } else {
        await Followship.create({
          followerId,
          followingId
        })
        req.flash('success_messages', '成功追蹤')
        console.log(req.body)
        return res.status(200).redirect('back')
      }
    }
    catch (err) {
      console.log(err)
    }
  },

  removeFollowing: (req, res) => {
    const currentUserId = helpers.getUser(req).id
    return Followship.destroy({
      where: {
        followerId: currentUserId,
        followingId: req.params.id
      }
    }).then(() => {
      return res.redirect('back')
    })

    // return Followship.findOne({
    //   where: {
    //     followerId: req.user.id,
    //     followingId: req.params.id
    //   }
    // })
    //   .then(followship => {
    //     console.log('------------')
    //     followship.destroy()
    //       .then(() => {
    //         return res.redirect('back')
    //       })
    //   })
  }
}



module.exports = userController