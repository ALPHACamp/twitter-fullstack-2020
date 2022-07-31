const express = require('express')
const router = express.Router()

const apiController = require('../../controllers/api-controller')

router.get('/users/:id', apiController.getUser)

router.use('/', (req, res) => res.redirect('/admin/signin'))

module.exports = router
