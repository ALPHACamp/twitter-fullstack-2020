const { Tweet } = require('../models')

const showFiftyString = (str) => {
  if (str.length < 50) {
    return str
  }
  return str.substring(0, 50) + '.....'
}

const adminController = {
  getTweets: (req, res) => {
    Tweet.findAll(
      {
        order: [['createdAt', 'DESC']]
      }
    ).then((tweets) => {
      tweets = tweets.map((d, i) => ({
        ...d.dataValues,
        description: showFiftyString(d.description)
      }))

      const pageTitle = '推文清單'
      const isAdminPage = true

      res.render('admin/tweets', { tweets, pageTitle, isAdminPage })
    })
      .catch(e => {
        console.warn(e)
      })
  }
}

module.exports = adminController