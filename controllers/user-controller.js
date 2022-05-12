const userController = {
  getUser: (req, res, next) => {
    const isFavorited = 0

    res.render('user', { isFavorited })
  }
}

module.exports = userController
