const userController = {
  getSigninPage: (req, res) => {
    return res.render('signin');
  },

  signin: (req, res) => {
    return res.redirect('/tweets');
  },
  getUser: (req, res) => {
    let user = req.user;
    console.log(user);
    return res.render('user', user);
  },
};

module.exports = userController;
