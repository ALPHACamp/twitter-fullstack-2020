const db = require('../models') 
const Tweet = db.Tweet

const adminController = {
    getTweets: (req, res) => {
      return Tweet.findAll({raw: true}).then(tweets => {
        return res.render('admin/tweets', {tweets: tweets })
      })
    }
  }
  
module.exports = adminController