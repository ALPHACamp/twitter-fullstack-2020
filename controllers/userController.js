const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const userController = {
  getIndexPage: (req, res) => res.redirect('/signin'),
  signUpPage: (req, res) => res.render('signup'),
  signInPage: (req, res) => res.render('signin'),
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const error = []
    if (!account || !name || !email || !password || !checkPassword) {
      error.push({ message: '所有欄位皆為必填' })
      return res.render('signup', { account, name, email, error })
    }
    if (password !== checkPassword) {
      error.push({ message: '密碼與確認密碼必須相同' })
      return res.render('signup', { account, name, email, error })
    }

    User.findOne({ where: { $or: [{ email }, { account }] }, raw: true })
      .then(user => {
        if (user) {
          if (user.email === email) { error.push({ message: 'Email已被註冊' }) }
          if (user.account === account) { error.push({ message: '帳號已被使用' }) }
          return res.render('signup', { account, email, name, error })
        }
        if (!user) {
          return User.create({ account, name, email, password: hashPassword })
            .then(() => {
              req.flash('successMessage')
              res.redirect('/signin')
            })
        }
      })
  },
  signIn: (req, res) => {
    req.flash('successMessages', '登入成功！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('successMessage', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  editUser: (req, res) => {
    if (!helpers.getUser(req)) { return res.redirect('back') }
    else { res.render('setting') }
  },
  // putUser: (req, res) => {
  //   const id = req.params.id
  //   const userId = helpers.getUser(req)
  //   const name = 'abc'
  //   if (id === userId) {
  //     return User.findByPk(id).then(user => {
  //       console.log(user.name)
  //       user.update({ name })
  //     })
  //   }
  // },
  putUser: async (req, res) => {
    const id = req.params.id
    const { email: originalEmail, account: originalAccount } = helpers.getUser(req)
    const { account, name, email, password, passwordCheck } = req.body
    // const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const error = []
    let newEmail = ''
    let newAccount = ''

    console.log('dddddddddffffff')

    if (originalEmail === email) { newEmail = originalEmail }
    if (originalAccount === account) { newAccount = originalAccount }
    if (!account || !name || !email || !password || !passwordCheck) { error.push({ message: '所有欄位皆為必填' }) }
    if (password !== passwordCheck) { error.push({ message: '密碼與確認密碼必須相同!' }) }

    if (originalEmail !== email) {
      await User.findOne({ where: { email } })
        .then(user => {
          if (user) { error.push({ message: '信箱已經被註冊' }) }
          else { newEmail = email }
        })
    }

    if (originalAccount !== account) {
      await User.findOne({ where: { account } })
        .then(user => {
          if (user) { error.push({ message: '帳號已存在' }) }
          else { newAccount = account }
        })
    }
    console.log('ffffffffffffuck')

    if (error.length !== 0) { return res.render('setting', { error }) }
    else {
      await User.findByPk(id)
        .then(user => {
          // console.log(user.name)
          return user.update({ name, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), email: newEmail, account: newAccount })
        })
        .then(() => {
          req.flash('successMessage', '更新成功！')
        })
        .then(() => res.redirect('back'))
    }
  },
  getTweets: (req, res) => {
    const id = req.params.id
    return User.findByPk(id, {
      include: [
        { model: Tweet, include: [Reply, { model: User, as: 'LikedUsers' },] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['Tweets', 'createdAt', 'DESC']]
    })
      .then(user => {
        const pageUser = user.toJSON()
        pageUser.Tweets.forEach(t => {
          // t.isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(t.id)
          t.isLiked = t.LikedUsers.map(d => d.id).includes(helpers.getUser(req))
        })
        pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(user.id)
        res.render('user-tweets', { pageUser })
      })
  },
  getLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: Tweet, as: 'LikedTweets', include: [User, Reply, { model: User, as: 'LikedUsers' }] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['LikedTweets', 'createdAt', 'DESC']],
    })
      .then(pageUser => {
        pageUser.dataValues.LikedTweets.forEach(t => {
          // t.dataValues.isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(t.dataValues.id)
          t.dataValues.isLiked = true
        })
        pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)
        return pageUser
      })
      .then(pageUser => res.render('user-likes', { pageUser }))
  },
  getReplies: (req, res) => {
    User.findOne({
      where: { id: req.params.id },
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        {
          model: Reply, include: [
            {
              model: Tweet, include: [
                User,
                { model: User, as: 'LikedUsers' }]
            }
          ],
        }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    })
      .then(pageUser => {
        pageUser.dataValues.Replies.forEach(r => {
          r.dataValues.Tweet.dataValues.isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(r.dataValues.Tweet.dataValues.id)
        })
        pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)
        res.render('user-replies', { pageUser })
      })

  },
  putUserProfile: (req, res) => {
    const id = Number(req.params.id)
    const { name, introduction } = req.body
    const { avatar, cover } = req.files
    const { files } = req

    if (helpers.getUser(req).id !== id) {
      req.flash('errorMessage', 'error')
      res.redirect('/tweets')
    }

    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      if (avatar) {
        avatarPath = avatar[0].path
        imgur.upload(avatarPath, (err, img) => {
          User.findByPk(id)
            .then(user => user.update({ avatar: img.data.link }))
        })
      }
      if (cover) {
        coverPath = cover[0].path
        imgur.upload(coverPath, (err, img) => {
          User.findByPk(id)
            .then(user => user.update({ cover: img.data.link }))
        })
      }
    }
    return User.findByPk(id)
      .then(user => {
        user.update({ name, introduction })
      })
      .then(() => {
        res.redirect('/tweets')
      })
  },
  getFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' }, { model: Tweet }]
    }).then(user => {
      const Followings = user.Followings.map(following => ({
        ...following.dataValues,
        isFollowed: user.Followings.map((i) => i.id).includes(following.id)
      }))
      const results = {
        user,
        tweetCounts: user.Tweets.length,
        Followings
      }
      res.render('user-followings', { results })
    })
  },
  getFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers' }, { model: Tweet }]
    }).then(user => {
      const Followers = user.Followers.map(follower => ({
        ...follower.dataValues,
        isFollowed: helpers.getUser(req).Followings.map((i) => i.id).includes(follower.id)
      }))
      const results = {
        user,
        tweetCounts: user.Tweets.length,
        Followers
      }
      res.render('user-followers', { results })
    })
  },
  addFollow: async (req, res) => {
    const followingId = Number(req.body.id)
    const followerId = helpers.getUser(req).id

    if (followerId === followingId) { return res.render('error') }

    await Followship.create({ followingId, followerId })
    return res.redirect('back')
  },
  removeFollow: async (req, res) => {
    const followingId = Number(req.params.id)
    const followerId = helpers.getUser(req).id

    if (followerId === followingId) { return res.redirect('back') }

    await Followship.findOne({ where: { followingId, followerId } })
      .then(followship => followship.destroy())
    return res.redirect('back')
  }
}

module.exports = userController