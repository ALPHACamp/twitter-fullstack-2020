const { off } = require('../app')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const pageLimit = 10

const adminController = {
  getAdminTweets: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (Number(req.query.page) - 1) * pageLimit
    }
    return Tweet.findAndCountAll({
      raw: true,
      nest: true,
      include: [User],
      offset,
      limit: pageLimit,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(tweets.count / pageLimit)
      const totalPage = Array.from({ length: pages }, (item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      return res.render('admin/tweets', {
        tweets: tweets.rows,
        page,
        totalPage,
        prev,
        next
      })
    })
  }
}
module.exports = adminController