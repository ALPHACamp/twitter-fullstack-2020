const bcrypt = require('bcryptjs')
const { Op } = require('sequelize');
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) console.log('密碼不一致!')

    User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { account: req.body.account }
        ]
      }
    })
      .then(user => {
        if (user) {
          if (user.toJSON().email === req.body.email) throw new Error('email 已重複註冊！')
          if (user.toJSON().account === req.body.account) throw new Error('account 已重複註冊！')
        }        

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        account: req.body.account,
      }))
      .then(() => {
        console.log('成功註冊！')
        return res.redirect('/signin')
      })
      .catch(err => console.log(err))
  },
  signInPage:(req,res) => {
    return res.render('signin')
  }
}

module.exports = userController