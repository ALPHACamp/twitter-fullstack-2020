const { use } = require('chai')
const express = require('express')
const { helpers } = require('faker')
const router = express.Router()

const adminController = require('../controller/adminController')
const userController = require('../controller/userController')

const db = require('../models')
const Followship = db.Followship
const User = db.User
const getTopFollowing = async (req, res, next) => {
  try {
    const users = await User.findAll({
      raw: true,
      nest: true,
    })

    let Data = []
    Data = users.map(async (user, index) => {
      const [following] = await Promise.all([
        Followship.findAndCountAll({
          raw: true,
          nest: true,
          where: {
            followingId: user.id
          }
        })
      ])
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        account: user.account,
        followerCount: following.count
      }
    })
    Promise.all(Data).then(data => {
      data = data.sort((a, b) => b.followerCount - a.followerCount)
      res.locals.data = data
      return next()
    })
  }
  catch (err) {
    console.log('getTopFollowing err')
    return next()
  }
}

module.exports = (app) => {
  app.get('/', adminController.getAdminTweets)
  app.get('/admin/tweets', adminController.getAdminTweets)

  app.get('/users/:userId/tweets', getTopFollowing, userController.getUserTweets)
}