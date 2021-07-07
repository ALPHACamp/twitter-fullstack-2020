const adminController = {
  getUsers: (req, res) => {
    return res.render('admin/users')
  }
}
module.exports = adminController
