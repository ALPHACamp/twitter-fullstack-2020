const express = require('express')
const router = express.Router()

const exampleController = require('../controller/example-controller')

router.get('/', exampleController.indexPage)

module.exports = router
