
const twitController = {
  getTwitters: (req, res) => {
    return res.render('twitters')
  },

  getFollower: (req, res) => {
    return res.render('follower')
  },

  getFollowing: (req, res) => {
    return res.render('following')
  }


}
module.exports = twitController