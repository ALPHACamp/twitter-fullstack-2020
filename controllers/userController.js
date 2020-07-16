const db = require("../models");
const User = db.User;
const Tweet = db.Tweet;

const userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: Tweet }],
    }).then((user) => {
      let results = user.toJSON();
      return res.json(results);
    });
  },
};

module.exports = userController;
