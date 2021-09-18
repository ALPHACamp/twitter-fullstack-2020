const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
// setup passport strategy
// serialize and deserialize user
module.exports = passport