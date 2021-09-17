const db = require('../models')


const userController = {
  getUserTweets: (req, res) => {
    res.render('userTweets')

  }, 
  getSetting: (req, res) => {

  }, 
  editSetting: (req, res) => {

  }, 
  getReplies: (req, res) => {
    res.render('userReply')
  }, 
  getLikes: (req, res) => {
    res.render('userLike')
  }, 
  getFollowings: (req, res) => {

  }, 
  getFollowers: (req, res) => {

  }
}



module.exports = userController