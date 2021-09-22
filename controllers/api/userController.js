const helpers = require('../../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = require('../../services/userService.js')

const { Op } = require("sequelize")
const sequelize = require('sequelize')

let userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.account
    let password = req.body.password

    User.findOne({ where: { account: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, account: user.account, isAdmin: user.isAdmin
        }
      })
    })
    


  },


  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.status(200).json(data)
    })
  },

  //for test
  renderUserEdit: (req, res) => {
    userService.renderUserEdit(req, res, (data) => {
      return res.status(200).json(data)
    })
  },

  //for test
  putUserEdit: (req, res) => {
    userService.putUserEdit(req, res, (data) => {
      return res.status(200).json(data)
    })
  }
}

module.exports = userController