const { Tweet, User, Reply, Like } = require('../models')

const adminService = {
  getTweets: async (req, res, callback) => {
    let tweets = await Tweet.findAll(
      { raw: true, nest: true, })
    return callback({
      tweets,
      isAdmin: true, 
      Appear: { navbar: true },
    })
  },
}

module.exports = adminService