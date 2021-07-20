const { sequelize } = require('../models')
const db = require('../models')
const helpers = require('../_helpers')
const Reply = db.Reply

const replyController = {
  postReply: async (req, res) => {
    try {
      const { comment } = req.body
      const { tweetId } = req.params
      console.log(comment)
      console.log('comment------------')


      if (comment === '') {
        return res.redirect('/')
      }

      await Reply.create({
        comment: comment,
        UserId: helpers.getUser(req).id,
        TweetId: tweetId
      })
      return res.redirect(`/tweets/${tweetId}`)
    } catch (err) {
      console.log('------------')
      console.warn(err)
      console.log('------------')

    }
  }
}
module.exports = replyController