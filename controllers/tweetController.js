const helpers = require("../_helpers")

const tweetController = {
  getTweets: (req, res) => {
    return res.render("tweets", { user: helpers.getUser(req) })
  },
}
module.exports = tweetController
