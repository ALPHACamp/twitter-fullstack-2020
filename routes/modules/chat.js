const express = require('express')
const router = express.Router()
const helpers = require('../../_helpers')

const chatController = require('../../controllers/chatController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return next()
  }
  res.redirect('/signin')
}

router.get('/' , authenticated, chatController.getChat)



module.exports = router
