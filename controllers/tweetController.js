const db = require('../models') 
const Tweet = db.Tweet

let tweetController = {
    //main
    getTweets: (req, res) => {
        return res.render('tweets')
    }
}

module.exports = tweetController
