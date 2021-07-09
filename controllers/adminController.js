




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
  }
}

module.exports = adminController