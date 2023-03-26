const { User, Tweet } = require('../models')

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
        
        return res.render('like-content', {
            users: user.toJSON()
        })
    }
}

module.exports = likesController