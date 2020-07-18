let userController = {
  loginPage: (req, res) => {
    return res.render('login');
  },
  signupPage: (req, res) => {
    return res.render('signup');
  }
};

module.exports = userController;
