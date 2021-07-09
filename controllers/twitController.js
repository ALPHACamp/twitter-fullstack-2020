
const twitController = {
  getTwitters: (req, res) => {
    return res.render('twitters')
  },

  getFollower: (req, res) => {
    return res.render('follower')
  },

  getFollowing: (req, res) => {
    return res.render('following')
  },

  getUser: (req, res) => {
    return res.render('user')
  },

  getUserLike: (req, res) => {
    return res.render('userLike')
  }



}
module.exports = twitController