const adminController = {
	getTweets: (req, res,next) => {
		Tweet.findAll({
			raw: true
		})
		.then(tweets =>{
			return res.render('admin/tweets',{tweets})
		})
	}
}
module.exports = adminController