
const adminController = {
  signinPage: (req, res) => {
    return res.status(200).render('adminSigninForm', { layout: 'form' })
  },

  signin: (req, res) => {
    return res.redirect('/admin/tweets')
  }
}

module.exports = adminController