const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get('/', (req, res) => res.redirect('/tweets'))

module.exports = router