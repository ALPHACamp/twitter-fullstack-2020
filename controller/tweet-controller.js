// 後續做到 User, Reply, Like 記得加進來
const { Tweet } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: (req, res) => { 

    const UserId = helpers.getUser(req).id
    const description = req.body.description

    if (!description.trim()) {
      req.flash('error_messages', '推文不可空白')
      res.redirect('back')
    } else if (description.length > 140) {
      req.flash('error_messages', '推文不得超過 140 個字')
      res.redirect('back')
    } else {
      return Tweet.create({
        UserId,
        description
      })
        .then(() => {
          return res.redirect('/tweets')
        })
        .catch((error) => console.log(error))
    }
  }
}


module.exports = tweetController