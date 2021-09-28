const userService = require('../../services/userService');

const usersController = {
  getUser: (req, res) => {
    userService.getUser(req, res, (data) =>
      res.json(data)
    );
  },

  putUser: async (req, res) => {
    userService.putUser(req, res, (data) => {
      req.flash('success_messages', '更新成功');
      return res.json(data);
    },
      (error) => {
        req.flash('error_messages', error);
        return res.redirect('/');
      },
    );
  },
};
module.exports = usersController;