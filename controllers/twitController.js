const bcrypt = require('bcryptjs')
const { text } = require('body-parser')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const fs = require('fs')

const twitController = {

  getTwitters: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: [User]
    }).then(tweet => {
      console.log(tweet) // 加入 console 觀察資料的變化
      return res.render('userAdmin', { tweet })
    })

  },
  toTwitters: (req, res) => {
    console.log(req.user.id)
    console.log(req.body)
    return Tweet.create({
      UserId: Number(req.user.id),
      description: req.body.description,
    })
      .then((tweet) => {
        req.flash('success_messages', 'tweet was successfully created')
        res.redirect('/')
      })
  },


  getFollower: (req, res) => {
    return res.render('follower')
  },

  getFollowing: (req, res) => {
    return res.render('following')
  },

  toFollowing: (req, res) => {
    return res.send('toFollowing')
  },

  deleteFollowing: (req, res) => {
    return res.send('deleteFollowing')
  },

  getUser: (req, res) => {
    const userId = req.user.id
    User.findByPk(userId, { raw: true })

      .then((user) => {
        console.log(user)
        Tweet.findAll({
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true,
          include: [User]
        }).then(tweet => {

          console.log(tweet) // 加入 console 觀察資料的變化
          console.log(user.introduction)
          return res.render('user', { tweet, user })
        })
      })


  },
  toUser: (req, res) => {
    console.log('+++++++++++'
    )
    console.log('7788')
    console.log(req.body)
    console.log('+++++++++++'
    )
    const userId = req.user.id
    const { file } = req // equal to const file = req.file
    console.log('//////////////')
    console.log(file)
    console.log('//////////////')

    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          User.findByPk(userId)
            .then((user) => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                avatar: file ? `/upload/${file.originalname}` : null
              })
                .then(() => {
                  req.flash('success_messages', 'user was successfully to update')
                  res.redirect('/user/self')
                })
            })
        })
      })
    } else {
      User.findByPk(userId)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: null
          })
            .then(() => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect('/user/self')
            })
        })
    }
  },

  getUserLike: (req, res) => {
    return res.render('userLike')
  },

  getReplies: (req, res) => {
    return res.render('replyUser')
  },

  toReplies: (req, res) => {
    return res.render('toReplies')
  },

  signin: (req, res) => {
    return res.render('signin')
  },

  toSignin: (req, res) => {
    if (req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/')
    }

  },

  getSignup: (req, res) => {
    res.render('signup')
  },

  toSignup: (req, res) => {
    console.log(req.body)
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複！')
              return res.redirect('/signup')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }

          })
        }
      })
    }
  },

  getSetting: (req, res) => {
    console.log(req.user.id)
    const userId = req.user.id
    User.findByPk(userId, { raw: true }).then(user => {
      res.render('setting', { userdata: user })

    })
  },

  putSetting: (req, res) => {
    console.log(req.user.id)
    const userId = req.user.id

    // confirm password()
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/setting')
    } else {
      User.findByPk(userId)
        .then((user) => {
          user.update({
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),

          })
            .then(() => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect('/setting')
            })
        })
    }
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }


}
module.exports = twitController