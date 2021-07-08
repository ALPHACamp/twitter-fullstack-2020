




const adminController = {
  getTwitters: (req, res) => {
    return res.render('admin/twitters')
  },

  adminSignin: (req, res) => {
    return res.render('admin/signin')
  }
}

module.exports = adminController