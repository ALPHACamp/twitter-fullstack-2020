
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

  toFollowing: (req, res) => {
    return res.send('toFollowing')
  },

  deleteFollowing: (req, res) => {
    return res.send('deleteFollowing')
  },

  getUser: (req, res) => {
    return res.render('user')
  },

  getUserLike: (req, res) => {
    return res.render('userLike')
  },

  getReplies: (req, res) => {
    return res.render('replyUser')
  },

  toReplies: (req, res) => {
    return res.render('toReplies')
  },

  signin: (req, res) => {
    return res.render('signin')
  },

  toSignin: (req, res) => {
    return res.send('1234')
  },

  getSignup: (req, res) => {
    res.render('signup')
  },

  toSignup: (req, res) => {
    res.send('toSignup')
  },

  getSetting: (req, res) => {
    res.render('setting')
  },

  putSetting: (req, res) => {
    res.send('putSetting')
  }


}
module.exports = twitController