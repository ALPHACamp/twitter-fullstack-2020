const twitterController = {
  getTwitters: (req, res) => {
    return res.render('twitters')
  },
  getModalsTabs: (req, res) => {
    res.render('modals/self')
  }
}

module.exports = twitterController
