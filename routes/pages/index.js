const express = require('express')

const errorHandler = require('../../middlewares/error-handler')

const router = express.Router()
router.get('/', (req, res) => res.render('main/homepage'))
router.use('/', (req, res) => {
// 預留，將找不到router的網址都先轉入root
  res.redirect('/')
})

/* Error handleling, 接住所有的error */
router.use('/', errorHandler)
module.exports = router
