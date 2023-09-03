const bcrypt = require('bcryptjs')
const { User, Followship } = require('../../models')
const helpers = require('../../_helpers')

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
  }
}

module.exports = userController
