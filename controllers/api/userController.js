const db = require('../../models')
const { User, Tweet, Reply, Like } = db

const userController = {
  //////////////
  //Profile
  //////////////

  userProfile: (req, res) => {
    const id = req.params.id
    User.findByPk(id)
      .then(user => res.json(user))
      .catch(err => console.log(err))
  }
}

module.exports = userController