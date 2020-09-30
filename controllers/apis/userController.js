const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signin: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let account = req.body.account
    let password = req.body.password

    User.findOne({ where: { account } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'test')
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


}

module.exports = userController