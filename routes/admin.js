const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

router.get('/signin', (req, res) => {
  return res.render('admin/signin')
})

router.post('/signin', (req, res) => {
  return User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        req.flash('error_msg', "User doesn't exist")
        return res.redirect('/admin/signin')
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        req.flash('error_msg', "Email or password incorrect")
        return res.redirect('/admin/signin')
      }

      return res.redirect('/admin/tweets')
    })
    .catch(err => console.log(err))
})

module.exports = router