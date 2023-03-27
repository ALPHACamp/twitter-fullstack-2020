const { User, Tweet } = require('../models')
const helpers = require('../_helpers')

const likesController = {
  getLikes:async (req,res)=>{ // 取得喜歡的內容
    let [users, user] = await Promise.all([
            User.findAll({ where: { role: 'user' }, raw: true, nest: true, attributes: ['id'] }),
            User.findByPk((req.params.id), {
                where: { role: 'user' },
                include: [
                    Tweet,
                    { model: Tweet, as: 'LikedTweets', include: [User] },
                ],
                order: [
                    ['LikedTweets', 'updatedAt', 'DESC']
                ],
            })
        ])
        const isLiked = helpers.getUser(req).LikedTweets.some(l => l.id === req.user.id)
        return res.render('like-content', {
            users: user.toJSON(),isLiked
        })
    }
}

module.exports = likesController