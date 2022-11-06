const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')

const { sequelize, User, Tweet, Like } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, account, password, cb) => {
    User
      .findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return cb(null, false, req.flash('error_messages', '帳號不存在'))
        }
        const result = bcrypt.compareSync(password, user.password)
        if (!result) return cb(null, false, req.flash('error_messages', '輸入密碼錯誤'))
        return cb(null, user)
      })
      .catch(err => cb(err))
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User
    .findByPk(id, {
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    .then(async user => {
      if (user) {
        const userJSON = user.toJSON()
        if (userJSON.role === 'user') {
          const [topFollowings] = await sequelize.query('SELECT COUNT(`Users`.`id`) AS`followerCount`, `Users`.`id`, `Users`.`name`, `Users`.`account`, `Users`.`avatar`, `Followships`.`createdAt` FROM Users LEFT JOIN Followships ON`Users`.`id` = `Followships`.`followingId` GROUP BY`Users`.`id` ORDER BY`followerCount` DESC, `Followships`.`createdAt` DESC LIMIT 10;')
          userJSON.topFollowings = [...topFollowings.map(item => {
            if (item.name.length >= 10) item.name = item.name.slice(0, 6) + ' ...'
            if (item.account.length >= 10) item.account = item.account.slice(0, 6) + ' ...'
            item.isFollowing = userJSON.Followings.some(following => following.id === item.id)
            return item
          })]
        }
        return cb(null, userJSON)
      }
      return cb(null, false)
    })
    .catch(err => cb(err))
})

module.exports = passport
