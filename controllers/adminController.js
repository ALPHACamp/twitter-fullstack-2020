const adminController = {
  //admin登入
  signInPage: (req, res) => {
    return res.render("admin/signin")
  },

  //admin管理推文
  getTweets: (req, res) => {
    return res.render("admin/tweets")
  },

  //admin管理使用者
  getUsers: (req, res) => {
    return res.render("admin/users")
  },
}
module.exports = adminController
