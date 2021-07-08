




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
}

module.exports = adminController