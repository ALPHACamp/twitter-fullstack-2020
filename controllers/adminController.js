const db = require('../models')




const adminController = {
  signInPage: (req, res) => {
    
  },
  signIn: (req, res) => {

  },
  logOut: (req, res) => {
 
  },
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  deleteTweet: (req, res) => {

  },
  getUsers: (req, res) => {
    return res.render('admin/users')
  }
}



module.exports = adminController