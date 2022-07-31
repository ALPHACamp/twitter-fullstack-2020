const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const apiController = {
  getUser: (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      return res.json({ status: 'error', message: "Can't update others data" })
    }

    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        Reply,
        { model: Tweet, as: 'LikeTweets' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(data => {
        if (!data) return res.json({ status: 'error', message: "user isn't existed!" })
        const user = data.toJSON()
        delete user.password

        res.json({ status: 'success', ...user })
      })
      .catch(err => next(err))
  }
}

module.exports = apiController
