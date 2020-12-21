const db = require('../../models')
const { User, Tweet, Reply, Like } = db
const helpers = require('..//../_helpers')

const userController = {
  //////////////
  //Profile
  //////////////

  userProfile: (req, res) => {
    const id = req.params.id
    User.findByPk(id)
      .then(user => res.json(user))
      .catch(err => console.log(err))
  },

  updateProfile: (req, res) => {
    const { cover, avatar, name, introduction } = req.body
    const id = req.params.id
    User.findByPk(id)
      .then(user => {
        user.update({
          cover: cover,
          avatar: avatar,
          name: name,
          introduction: introduction
        }).then(user => res.json(user))
      }).catch(err => err)

  }
}

module.exports = userController