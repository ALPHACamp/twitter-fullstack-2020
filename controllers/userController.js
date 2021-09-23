const bcrypt = require('bcrypt-nodejs')
const helpers = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Followship, Like } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signupPage: (req, res) => {
    return res.render('signup')
  },

  signup: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { account: req.body.account } }).then((user) => {
        if (user) {
          req.flash('error_messages', '帳號已重複註冊！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { email: req.body.email } }).then((user) => {
            if (user) {
              req.flash('error_messages', '信箱已重複註冊！')
              return res.redirect('/signup')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(
                  req.body.password,
                  bcrypt.genSaltSync(10),
                  null
                )
              }).then((user) => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }
          })
        }
      })
    }
  },

  signinPage: (req, res) => {
    return res.render('signin')
  },

  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: Tweet,
      order: [[Tweet, 'createdAt', 'DESC']]
    }).then((user) => {
      const users = user.toJSON()
      return res.render('user/userTweets', {
        users: users
      })
    })
  },
  editUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.json({ status: 'error' })
    } else {
      User.findByPk(req.params.id).then((user) => {
        return res.json({ name: user.name })
      })
    }
  },

  putUser: async (req, res) => {
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
              .then((user) => {
                user
                  .update({
                    name,
                    introduction,
                    cover: img.data.link
                  })
                  .them((user) => {
                    req.flash(
                      'success_messages',
                      'user was successfully updated'
                    )
                    return res.redirect('back')
                  })
              })
              .catch((error) => console.log(error))
          })
        }
        if (avatar) {
          await imgur.upload(avatar[0].path, (err, img) => {
            return User.findByPk(id)
              .then((user) => {
                user
                  .update({
                    name,
                    introduction,
                    avatar: img.data.link
                  })
                  .then(() => {
                    req.flash(
                      'success_messages',
                      'user was successfully updated'
                    )
                    return res.redirect('back')
                  })
                  .catch((error) => console.log(error))
              })
              .catch((error) => console.log(error))
          })
        }
      } else {
        const user = await User.findByPk(id)
        user
          .update({
            name,
            introduction
          })
          .then((user) => {
            req.flash('success_messages', 'user was successfully updated')
            return res.redirect('back')
          })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = userController
