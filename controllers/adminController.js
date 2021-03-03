const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  getTweets: (req, res) => {
    let offset = 0
    const whereQuery = {}
    const pageLimit = 7
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Tweet.findAndCountAll({
      include: [User],
      offset,
      limit: pageLimit
    })
      .then(result => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = result.rows.map(tweet => ({
          ...tweet.dataValues,
          description: tweet.dataValues.description.substring(0, 50)
        }))
        res.render('admin/tweets', { tweets: data, page, totalPage, prev, next })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  }
}

module.exports = adminController