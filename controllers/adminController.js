const adminController = {
  //admin登入
  signInPage: (req, res) => {
    return res.render("admin/signin")
  },

  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！")
    res.redirect("/admin/tweets")
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！")
    req.logout()
    res.redirect("/admin/signin")
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
