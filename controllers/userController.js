const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply

const userController = {
  getSignup: (req, res) => {
    return res.render('signup', { layout: 'userMain' })
  },

  postSignup: (req, res) => {
    const { account, name, email, password } = req.body

    User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }).then(user => {
      console.log('done')
      return res.redirect('/signin')
    })
  },

  getUser: (req, res) => {
    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Tweet.findAndCountAll({
      include: [
        User
      ],
      where: whereQuery
    }).then(result => {
      const totalTweet = Number(result.count)
      const data = result.rows.map(r => ({
        ...r.dataValues,
        content: r.dataValues.content
      }))
      User.findByPk(req.params.id)
        .then(user => {
          return res.render('profile', {
            user: user.toJSON(),
            totalTweet: totalTweet,
            tweet: data
          })
        })
    })



  }
}

module.exports = userController