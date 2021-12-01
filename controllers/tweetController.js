const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
  getTweets: (req, res) => {
    // for testing(helpers.getUser(req))
    const user = {
      id: 11,
      email: 'user1@example.com',
      role: 'user',
      name: 'user1',
      avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
      introduction: 'adkoer mknmfdl pwroeioros mdlmvlk',
      account: 'user1',
      cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`
    }

    Tweet.findAll({
      raw: true, 
      nest: true, 
      include: [User], 
      order: [
        ['createdAt', 'DESC']
      ]}).then(tweets => {
      // for popular users list on right bar
      User.findAll({ include: [{ model: User, as: 'Followers' }] }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          followerCount: user.Followers.length
          //isFollowed: req.user.Followings.map(item => item.id).includes(user.id)
        }))
        users = users.sort((a ,b) => b.followerCount - a.followerCount)

        console.log(tweets)
        console.log(users)
        return res.render('tweets', { user, tweets, users })
      })
    })
  },

  postTweet: (req, res) => {
    const description = req.body.description

    if (description.trim() === '') {
      return res.redirect('back')
    }
    if (description.length > 140) {
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: description
    })
      .then((tweet) => {
        return res.redirect('back')
      })
  }
}

module.exports = tweetController