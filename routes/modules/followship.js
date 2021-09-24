const express = require('express')
const router = express.Router()
const helpers = require('../../_helpers')

const followshipController = require('../../controllers/followshipController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return next()
  }
  res.redirect('/signin')
}


//add follow 與 delete follow傳入值的方法不同
router.post('/', authenticated, followshipController.addFollowing) 
router.delete('/:userId',authenticated,followshipController.removeFollowing)
