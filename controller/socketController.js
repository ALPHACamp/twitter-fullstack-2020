const socketController = {
  getPublicSocket: (req, res) => {

    //選染畫面用的變數
    const publicSocketPage = true

    return res.render('publicSocket', {
      publicSocketPage
    })
  }
}
module.exports = socketController