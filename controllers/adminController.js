




const adminController = {
  getTwitters: (req, res) => {
    return res.render('admin/twitters')
  },

  adminSignin: (req, res) => {
    return res.render('admin/signin')
  },

  adminUsers: (req, res) => {
    return res.render('admin/users')
  },

  tweetsAdmin: (req, res) => {
    res.render('admin/tweetsAdmin')
  },

  toAdminSignin: (req, res) => {
    if (req.user.role) {
      req.flash('success_messages', '成功登入！')
      res.redirect('/admin/tweets')

    } else {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/admin/signin')
    }

  },

  getTwitter: (req, res) => {
    res.send('12345')
  },

  deleteUser: (req, res) => {
    res.send('1234234')
  },

  deleteTwitter: (req, res) => {
    res.send('1234')
  },
}

module.exports = adminController