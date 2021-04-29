const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const sequelize = require('sequelize')
const { Op } = require('sequelize')

const userService = require('../services/userService')

const userController = {

  //getTopUsers
  getTopUsers: (req, res) => {
    userService.getTopUsers(req, res, (data) => {
      return res.render('topUser', data)
    })
  },

  // 一般使用者 註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  // 一般使用者 註冊
  signUp: async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []
    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ message: '所有資訊都要輸入！' })
    }
    if (!email.match(/.+@.+\..+/)) {
      errors.push({ message: '請填入正確的信箱格式' })
    }
    if (!password.match(/.{8,}/)) {
      errors.push({ message: '密碼需要為8位' })
    }
    if (password !== checkPassword) {
      errors.push({ message: '兩次密碼輸入不同！' })
    }
    if (errors.length) {
      return res.render('signup', {
        errors,
        account,
        name,
        email,
      })
    }
    try {
      const userAccount = await User.findOne({ where: { account } })
      if (userAccount) {
        errors.push({ message: '帳號重複!' })
        return res.render('signup', { errors, name, email })
      }
      const userEmail = await User.findOne({ where: { email } })
      if (userEmail) {
        errors.push({ message: 'Email重複!' })
        return res.render('signup', { errors, account, name })
      }
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      req.flash('success_msg', '註冊成功，請登入！')
      return res.redirect('/signin')
    } catch (err) {
      console.log(err)
      definitionErrHandler(err, req, res, { account, name, email, password })
    }
  },

  // 一般使用者 登入頁面
  signInPage: (req, res) => {
    return res.render('signin')
  },

  // 一般使用者 登入
  signIn: (req, res) => {
    if (!getUser(req).isAdmin) {
      req.flash('success_messages', '成功登入')
      return res.redirect('/tweets')
    } else {
      req.flash('warning_msg', '請使用一般權限')
      return res.redirect('/signIn')
    }
  },

  // 登出
  logout: (req, res) => {
    req.flash('success_msg', '成功登出')
    req.logout()
    return res.redirect('/signin')
  },

  settingPage: (req, res) => {
    const loginUser = getUser(req)
    console.log(`id:${loginUser.id}`)
    User.findByPk(loginUser.id)
      .then(result => {
        return res.render('userSetting', { result: result.toJSON() })
      })
      .catch(err => res.send(err))
  },
  putSetting: (req, res) => {
    //trim input
    Object.keys(req.body).map(k => req.body[`${k}`] = req.body[`${k}`].trim())
    const { account, name, email, oldPassword, newPassword, checkNewPassword } = req.body
    const loginUser = getUser(req)
    //check no empty input
    if (!account || !name || !email) {
      req.flash('warning_msg', '請填入account、name、email');
      return res.redirect('back');
    }
    //require old password before changing it
    User.findByPk(loginUser.id)
      .then(user => {
        if (oldPassword && !bcrypt.compareSync(oldPassword, user.password)) {
          req.flash('warning_msg', 'Wrong Old Password!')
          return res.redirect('back')
        }
        //confirm new password input
        if (newPassword !== checkNewPassword) {
          req.flash('warning_msg', '兩次密碼輸入不同！')
          return res.redirect('back')
        }
        //update with password change
        if (oldPassword && newPassword) {
          user.update({
            account,
            name,
            email,
            password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
          })
            .then(user => {
              req.flash('success_msg', 'Your setting was successfully updated')
              return res.redirect('/tweets')
            })
            .catch(err => definitionErrHandler(err, req, res,)
            )
        } else {
          //update without password change
          user.update({
            account,
            name,
            email
          })
            .then(user => {
              req.flash('success_msg', 'Your setting was successfully updated')
              return res.redirect('/tweets')
            })
            .catch(err => definitionErrHandler(err, req, res,)
            )
        }
      })
      .catch(err => {
        return res.send(err)
      })
  },

  followUser: (req, res) => {
    const followerId = Number(getUser(req).id)
    const followingId = Number(req.params.id)
    //不能追蹤自己
    if (followerId === followingId) {
      req.flash('warning_msg', 'You cannot be your own follower')
      return res.redirect('back')
    }
    //不能重複追蹤
    Followship.findOne({ where: { followerId, followingId } })
      .then(followship => {
        if (followship) {
          req.flash('warning_msg', 'You cannot follow the same person twice')
          return res.redirect('back')
        }
        return Followship.create({
          followerId,
          followingId
        })
          .then(() => res.redirect('back'))
          .catch(err => res.send(err))
      })
  },
  unfollowUser: (req, res) => {
    return Followship.destroy({
      where: {
        followerId: getUser(req).id,
        followingId: req.params.id
      }
    })
      .then(() => res.redirect('back'))
      .catch(err => res.send(err))
  },
  getFollowers: (req, res) => {
    const loginUserId = getUser(req).id
    const paramUserId = req.params.id
    return Promise.all([
      User.findByPk(paramUserId, {
        include: [
          Tweet,
          { model: User, as: 'Followers' }
        ],
        order: [['Followers', 'createdAt', 'DESC']]
      }),
      User.findByPk(loginUserId, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
    ])
      .then(([pUser, lUser]) => {
        pUser.Followers = pUser.Followers.map(follower => ({
          ...follower.dataValues,
          isFollowed: lUser.Followings.map(f => f.id).includes(follower.id)
        }))
        userService.getTopUsers(req, res, (data) => {
          res.render('follower', {
            paramUser: pUser.toJSON(),
            followers: pUser.Followers,
            loginUserId: lUser.id,
            ...data
          })
        })
      })
      .catch(err => res.send(err))
  },
  getFollowings: (req, res) => {
    const loginUserId = getUser(req).id
    const paramUserId = req.params.id
    return Promise.all([
      User.findByPk(paramUserId, {
        include: [
          Tweet,
          { model: User, as: 'Followings' }
        ],
        order: [['Followings', 'createdAt', 'DESC']]
      }),
      User.findByPk(loginUserId, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
    ])
      .then(([pUser, lUser]) => {
        pUser.Followings = pUser.Followings.map(following => ({
          ...following.dataValues,
          isFollowed: lUser.Followings.map(f => f.id).includes(following.id)
        }))
        userService.getTopUsers(req, res, (data) => {
          res.render('following', {
            paramUser: pUser.toJSON(),
            followings: pUser.Followings,
            loginUserId: lUser.id,
            ...data
          })
        })
      })
      .catch(err => res.send(err))
  },
  getLikes: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        Tweet,
        {
          model: Tweet, as: 'LikedTweets',
          include: [User, Reply, Like]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['LikedTweets', 'Likes', 'createdAt', 'DESC']]
    })
      .then(user => {
        res.render('like', {
          paramUser: user.toJSON()
        })
      })
  },
  getProfile: async (req, res) => {
    //路徑名稱
    let pathName = req.path.split('/')
    pathName = pathName[pathName.length - 1]
    const profile_id = req.params.id //被選取的使用者 id

    let getUserData = User.findByPk(
      profile_id,
      {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      }
    )
    let getTweetAmount = Tweet.count({ where: { UserId: profile_id } })
    let [user, tweetAmount] = await Promise.all([getUserData, getTweetAmount])

    //頁面基礎資料
    const baseData = {
      userId: profile_id,
      isSelf: profile_id == getUser(req).id,
      isUserPage: true,
      pathName,
      profileUser: user.toJSON(),
      followerNumber: user.Followers.length,
      followingNumber: user.Followings.length,
      isFollowed: user.Followers.map(d => d.id).includes(getUser(req).id),
      pageTitle: user.name,
      tweetAmount
    }


    switch (pathName) {
      case 'tweets':
        try {
          let tweets = await Tweet.findAll(
            {
              where: { UserId: profile_id },
              include: [
                User,
                Reply,
                Like
              ],
              order: [['createdAt', 'DESC']]
            }
          )
          tweets = tweets.map(d => {
            return {
              ...d.dataValues,
              name: d.User.name,
              account: d.User.account,
              avatar: d.User.avatar,
              replyAmount: d.Replies.length,
              isLike: d.Likes.map(l => l.UserId).includes(getUser(req).id),
              likeNumber: d.Likes.length
            }
          })
          userService.getTopUsers(req, res, (data) => {
            return res.render('myTweets', { tweets, ...baseData, ...data })
          })
        }
        catch (e) {
          console.warn(e)
        }
        finally { break }

      case 'replies':
        try {
          let tweets = await Tweet.findAll(
            {
              include: [
                User,
                Like,
                { model: Reply, where: { UserId: profile_id }, include: [User] }
              ]
            }
          )
          tweets = tweets.map(d => {
            return {
              ...d.dataValues,
              name: d.User.name,
              account: d.User.account,
              avatar: d.User.avatar,
              replyAmount: d.Replies.length,
              isLike: d.Likes.map(l => l.UserId).includes(getUser(req).id),
              likeNumber: d.Likes.length,
              Replies: d.Replies.map(r => ({
                ...r.dataValues,
                User: r.User.dataValues,
                tweetUser: d.User.account
              }))
            }
          })
          userService.getTopUsers(req, res, (data) => {
            return res.render('myTweets', { tweets, ...baseData, withReply: true, ...data })
          })
        } catch (e) {
          console.warn(e)
        }
        finally {
          break
        }

      case 'likes':
        try {
          let likeTweets = await Like.findAll(
            {
              where: { UserId: profile_id },
              include: [
                { model: Tweet, include: [User, Reply, Like] }
              ]
            }
          )
          likesTweets = likeTweets.map(d => ({
            ...d.Tweet.dataValues,
            id: d.Tweet.id,
            name: d.Tweet.User.name,
            account: d.Tweet.User.account,
            avatar: d.Tweet.User.avatar,
            replyAmount: d.Tweet.Replies.length,
            isLike: d.Tweet.Likes.map(l => l.UserId).includes(getUser(req).id),
            likeNumber: d.Tweet.Likes.length
          }))
          userService.getTopUsers(req, res, (data) => {
            return res.render('myTweets', { tweets: likesTweets, ...baseData, ...data })
          })
        } catch (e) {
          console.warn(e)
        } finally {
          break
        }

      case 'likemost':
        try {
          let tweets = await Tweet.findAll(
            {
              where: { UserId: profile_id },
              attributes: {
                include: [
                  [
                    sequelize.literal(`(
              SELECT COUNT(*)
              FROM likes
              WHERE
                likes.TweetId = Tweet.id
                )`),
                    'likeCount',
                  ],
                ]
              },
              include: [
                User,
                Reply,
                Like
              ],
              order: [[sequelize.literal('likeCount'), 'DESC']]
            }
          )
          tweets = tweets.map(d => {
            return {
              ...d.dataValues,
              name: d.User.name,
              account: d.User.account,
              avatar: d.User.avatar,
              replyAmount: d.Replies.length,
              isLike: d.Likes.map(l => l.UserId).includes(getUser(req).id),
              likeNumber: d.Likes.length
            }
          })
          userService.getTopUsers(req, res, (data) => {
            return res.render('myTweets', { tweets, ...baseData, ...data })
          })
        }
        catch (e) {
          console.warn(e)
        }
        finally { break }

      case 'replymost':
        try {
          let tweets = await Tweet.findAll(
            {
              where: { UserId: profile_id },
              attributes: {
                include: [
                  [
                    sequelize.literal(`(
              SELECT COUNT(*)
              FROM replies
              WHERE
                replies.TweetId = Tweet.id
                )`),
                    'replyCount',
                  ],
                ]
              },
              include: [
                User,
                Reply,
                Like
              ],
              order: [[sequelize.literal('replyCount'), 'DESC']]
            }
          )
          tweets = tweets.map(d => {
            return {
              ...d.dataValues,
              name: d.User.name,
              account: d.User.account,
              avatar: d.User.avatar,
              replyAmount: d.Replies.length,
              isLike: d.Likes.map(l => l.UserId).includes(getUser(req).id),
              likeNumber: d.Likes.length
            }
          })
          userService.getTopUsers(req, res, (data) => {
            return res.render('myTweets', { tweets, ...baseData, ...data })
          })
        }
        catch (e) {
          console.warn(e)
        }
        finally { break }
    }
  },

  // 更新個人資訊
  putEdit: async (req, res) => {
    const id = req.params.id
    const { name, introduction } = req.body
    const { files } = req
    try {
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const { cover, avatar } = files
        if (cover) {
          await imgur.upload(cover[0].path, (err, img) => {
            return User.findByPk(id)
              .then(user => {
                user.update({
                  name,
                  introduction,
                  cover: img.data.link,
                })
                return res.redirect('back')
              })
              .catch(e => console.log(e))
          })
        }
        if (avatar) {
          await imgur.upload(avatar[0].path, (err, img) => {
            return User.findByPk(id)
              .then(user => {
                user.update({
                  name,
                  introduction,
                  avatar: img.data.link,
                })
                  .then(() => {
                    return res.redirect('back')
                  })
                  .catch(e => console.log(e))
              })
              .catch(e => console.log(e))
          })
        }
      } else {
        const user = await User.findByPk(id)
        user.update({
          name,
          introduction
        })
        return res.redirect('back')
      }
    }
    catch (e) {
      console.log(e)
    }
  },
  search: (req, res) => {
    const loginUser = getUser(req)
    const keyword = req.query.name
    return User.findAll({
      where: {
        [Op.or]: [
          {
            account: {
              [Op.like]: `%${keyword}%`
            }
          },
          {
            name: {
              [Op.like]: `%${keyword}%`
            }
          }
        ]
      },
      include: { model: User, as: 'Followers' },
    }).then(users => {
      users = users.map(u => ({
        ...u.dataValues,
        isFollowed: u.Followers.map(u => u.id).includes(loginUser.id)
      }))
      userService.getTopUsers(req, res, (data) => {
        return res.render('search', {
          keyword,
          resultUsers: users,
          loginUser,
          ...data
        })
      })
    })
      .catch(e => res.send(e))
  }
}

function definitionErrHandler(err, req, res, obj) {
  if (err.name === 'SequelizeValidationError') {
    req.flash('warning_msg', err.errors[0].message)
    if (obj) {
      return res.render('signup', obj)
    }
    return res.redirect('back')
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    if (err.errors[0].path === 'users.account') {
      req.flash('warning_msg', 'Sorry, account name already registered!')
      if (obj) {
        return res.render('signup', obj)
      }
      return res.redirect('back')
    } else {
      req.flash('warning_msg', 'Sorry, email already registered!')
      if (obj) {
        return res.render('signup', obj)
      }
      return res.redirect('back')
    }
  }
  return res.send(err)
}

module.exports = userController