const express = require('express')
const router = express.Router()
const { User } = require('../../models')

router.post('/', (req, res) => {
  let meg = { check: '', status: 0 }
  return User.findOne({ where: { account: req.body.account } }).then(a => {
    if (!a) {
      meg.check = '可以使用！',
        meg.status = 1
      return res.send(meg)
    } else {
      meg.check = '已經被註冊！'
      return res.send(meg)
    }
  })
})
module.exports = router