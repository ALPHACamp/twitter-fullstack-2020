const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  if (req.user.role === 'admin') {
    res.redirect('/admin/tweets')
  } else {
    res.render('tweets')
  }
})

module.exports = router
