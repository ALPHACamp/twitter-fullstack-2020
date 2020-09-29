const adminController = require('../controllers/adminController.js')

module.exports = app => {
 app.get('/admin', (req, res) => res.redirect('/admin/tweets'))

 // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
 app.get('/admin/tweets', adminController.getTweets)
}