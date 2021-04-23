const { Tweet, User } = require('../models')
const { getUser } = require('../_helpers')

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
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']]
      }
    ).then((tweets) => {
      tweets = tweets.map((d, i) => ({
        ...d,
        description: showFiftyString(d.description)
      }))

      const pageTitle = '推文清單'
      const isAdminPage = true

      res.render('admin/tweets', { tweets, pageTitle, isAdminPage })
    })
      .catch(e => {
        console.warn(e)
      })
  },
  deleteTweets: (req, res) => {
    const tweet_id = req.params.id
    const user_id = getUser(req).id

    Tweet.findOne({ where: { UserId: user_id, id: Number(tweet_id) } })
      .then(tweet => {
        return tweet.destroy()
      }).then(() => {
        res.redirect('back')
      })
      .catch(e => console.warn(e))
  }
}

module.exports = adminController