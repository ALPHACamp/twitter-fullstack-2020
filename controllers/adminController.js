let adminController = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login');
  },
  getTweets: (req, res) => {
    return res.render('admin/tweetsHome')
  }

};

module.exports = adminController;
