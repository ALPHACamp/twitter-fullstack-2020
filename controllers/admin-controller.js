const adminController = { 
  getSignin: (req, res) => {
    res.render('admin/login')
  }
}

module.exports = adminController
