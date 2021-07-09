




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
    res.send('1234')
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