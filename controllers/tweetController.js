const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User



const tweetController = {
  getTweets: (req, res) => {
    return Promise.all([
      User.findAll({
        raw: true,
        nest: true,
        where: {
          isAdmin: false,
          id: req.params.id
        },
        include: [{ model: User, as: 'Followers' }]
      }),
      Tweet.findAndCountAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User]
      })
    ]).then(([followship, tweets]) => {
      tweets = tweets.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
      }))
      return res.render('tweets', {
        tweets: tweets
      })

    })
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '推文內容不存在')
      console.log('推文內容不存在')
      return res.redirect('/tweets')
    } else if (req.body.description.trim().length === 0) {
      req.flash('error_messages', '請輸入推文內容!')
      console.log('請輸入推文內容')
      return res.redirect('/tweets')
    } else if (req.body.description.length > 140) {
      req.flash('error_messages', '推文超過140字數限制')
      console.log('推文超過140字數限制')
      return res.redirect('/tweets')
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description,
    })
      .then((tweet) => {
        req.flash('success_messages', '成功發布推文')
        console.log(`這是內容:${req.body.description}`)
        console.log(req.body.description.length)
        res.redirect('/tweets')

      })
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: User },
        { model: User, as: 'LikedbyUser' }
      ],
      order: [[Reply, 'createdAt', 'DESC']]
    }).then((tweet) => {
      const isLiked = tweet.LikedbyUser.map(d => d.id).includes(req.user.id)
      return res.render('tweet', {
        tweet: tweet.toJSON(),
        isLiked: isLiked
      })
    })

  }
}

module.exports = tweetController