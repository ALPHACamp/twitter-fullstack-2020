// const express = require('express')
// const router = express.Router()
const helpers = require('../_helpers')
const adminController = require('../controller/adminController')
const tweetController = require('../controller/tweetController')

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
        //isFollow 等有使用者登入認證之後才做
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
  app.get('/', getTopFollowing, tweetController.getTweets)
  app.get('/admin/tweets', adminController.getAdminTweets)
  app.get('/admin/users', adminController.getAdminUsers)
  app.delete('/admin/tweets/:tweetId', adminController.deleteAdminTweet)

}