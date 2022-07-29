const { User } = require('../models')

const apiController = {
  getUserInfo: (req, res, next) => {
    const id = req.params.id
    User.findByPk(id)
      .then(data => {
        if (!data) throw new Error("user didn't exist")
        const user = data.toJSON()
        delete user.password
        res.json({ status: 'success', ...user })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    const { cover, avatar, name, introduction } = req.body
    const id = req.params.id
    User.findByPk(id)
      .then(data => {
        if (!data) throw new Error("user didn't exist")
        return data.update({ cover, avatar, name, introduction })
      })
      .then(newData => {
        const user = newData.toJSON()
        delete user.password
        res.json({ status: 'success', ...user })
      })
      .catch(err => next(err))
  }
}

module.exports = apiController
