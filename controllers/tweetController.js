const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
    getTweets: (req, res) => {

        const tweetFindAll = Tweet.findAll({
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            include: [
                User
            ]
        })

        const userFindAll = User.findAll({

            include: [
                { model: User, as: 'Followers' }
            ]
        })

        Promise.all([tweetFindAll, userFindAll])
            .then(responses => {
                // console.log(responses[0])
                const tweets = responses[0]
                let users = responses[1]
                // console.log(users)
                // console.log(responses[1])
                users = users.map(user => ({

                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }))
                // 依追蹤者人數排序清單
                console.log(users)

                users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

                return res.render('main', { tweets, users })
            }).catch(error => {
                console.log(error)
            })

        // Tweet.findAll({
        //     raw: true,
        //     nest: true,
        //     order: [['createdAt', 'DESC']],
        //     include: [
        //         User
        //     ]
        // }).then(tweets => {
        //     // console.log(tweets)
        //     return res.render('main', { tweets })
        // }).catch(error => {
        //     console.log(error)
        // })

    },

    postTweets: (req, res) => {
        const description = req.body.description
        const userId = req.user.id
        Tweet.create({
            description: description,
            UserId: userId
        }).then(tweet => {
            console.log(tweet)
            req.flash('success_messages', '成功新增推文!')
            return res.redirect('/tweets')
        }).catch(error => {
            console.log(error)
        })
        // 收到post信息, 寫入tweets表, 完成後跳轉推文首頁

    }
}

module.exports = tweetController