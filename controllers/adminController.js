const db = require('../models')
const { Tweet, User } = db

const adminController = {
  getTweets: async (req, res) => {
    let tweets = await Tweet.findAll({ 
      raw: true, 
      nest: true, 
      order: [[ 'createdAt', 'DESC' ]], 
      include: [ { model: User } ] 
    })

    tweets = tweets.map(tweet => ({
      ...tweet,
      description: tweet.description.slice(0, 50)
    }))
    
    return res.render('admintweets', { tweets })
    // return res.json(tweets)
  },

  deleteTweet: async (req, res) => {
    await Tweet.destroy({ where: { id: req.params.id } })
    return res.redirect('/admin/tweets')
  }
}

module.exports = adminController