const { User } = require('../models')

const apiController = {
  getUserInfo: (req, res, next) => {
    const id = req.params.id
    User.findByPk(id)
      .then(data => {
        if (!data) {
          return res.json({ status: "user didn't exist" })
        }
        const user = data.toJSON()
        delete user.password
        res.json({ status: 'success', data: user })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    const { cover, avatar, name, introduction } = req.body
    const id = req.params.id
    User.findByPk(id)
      .then(data => {
        if (!data) {
          return res.json({ status: "user didn't exist" })
        }
        data.update({ cover, avatar, name, introduction })
        const user = data.toJSON()
        delete user.password
        res.json({ status: 'success', data: user })
      })
      .catch(err => next(err))
  }
}

module.exports = apiController
