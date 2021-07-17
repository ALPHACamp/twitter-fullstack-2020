

const db = require('../models')
const User = db.User
const Tweet = db.Tweet



const adminController = {
  getTwitters: (req, res) => {
    return res.render('admin/twitters')
  },

  adminSignin: (req, res) => {
    return res.render('admin/signin')
  },

  adminUsers: (req, res) => {

    User.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,

    }).then(users => {
      console.log(users)

      return res.render('admin/users', { userData: users })
    })

  },

  tweetsAdmin: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      // raw: true,
      // nest: true,
      include: User
    }).then(tweet => {
      console.log(tweet)
      const data = tweet.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 47) + '...',
        userName: r.User.name,
        avatar: r.User.avatar

      }))
      console.log(tweet)
      console.log(data) // 加入 console 觀察資料的變化
      return res.render('admin/tweetsAdmin', { tweet: data })
    })
  },

  toAdminSignin: (req, res) => {
    if (req.user.role) {
      req.flash('success_messages', '成功登入！')
      res.redirect('/admin/tweets')

    } else {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/admin/signin')
    }
  },

  getTwitter: (req, res) => {
    res.send('12345')
  },

  deleteUser: (req, res) => {
    res.send('1234234')
  },

  deleteTwitter: (req, res) => {

    Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then(() => {
            res.redirect(`/admin/tweets`)
          })
      })


  }

}

module.exports = adminController