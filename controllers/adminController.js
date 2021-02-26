const adminController = {
  getTweet: (req, res) => {
    return res.render('admin/tweets')
  }
}


module.exports = adminController