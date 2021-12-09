const db = require('../models')
const tweet = require('../models/tweet')
const user = require('../models/user')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
    getTweets: (req, res) => {

        // console.log(req.user)
        const tweetFindAll = Tweet.findAll({
            order: [['createdAt', 'DESC']],
            include: [User,
                { model: Reply, include: [Tweet] },
                { model: User, as: 'LikedUsers' },
            ]
        })

        const userFindAll = User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })

        const likeFindAll = Like.findAll({
            raw: true,
            nest: true,
            include: [
                User, Tweet
            ]
        })

        Promise.all([tweetFindAll, userFindAll, likeFindAll])
            .then(responses => {
                let tweets = responses[0]
                let users = responses[1]
                let likes = responses[2]


                tweets = tweets.map(tweet => ({
                    ...tweet.dataValues,
                    reliesCount: tweet.Replies.length,
                    likeCount: tweet.LikedUsers.length,
                    isLikedTweet: req.user.LikedTweets.map(d => d.id).includes(tweet.id)

                }))
                console.log(tweets)
                users = users.map(user => ({
                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }))
                // 依追蹤者人數排序清單
                users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

                console.log(tweets)
                return res.render('main', { tweets, users })
            }).catch(error => {
                console.log(error)
            })

    },

    postTweets: (req, res) => {
        const description = req.body.description
        const userId = req.user.id
        Tweet.create({
            description: description,
            UserId: userId
        }).then(tweet => {
            // console.log(tweet)
            req.flash('success_messages', '成功新增推文!')
            return res.redirect('/tweets')
        }).catch(error => {
            console.log(error)
        })
        // 收到post信息, 寫入tweets表, 完成後跳轉推文首頁

    },

    postReplies: (req, res) => {
        console.log(req.user.id)
        console.log(req.params.id)
        console.log(req.body)
        return Reply.create({
            UserId: req.user.id,
            TweetId: req.params.id,
            comment: req.body.description
        }).then(reply => {
            return res.redirect(`/tweets/${req.params.id}/replies`)
        }).catch(error => console.log(error))


    },

    getReplies: (req, res) => {
        const tweetFindAll = Tweet.findByPk(req.params.id, {
            include: [User]
        })

        const userFindAll = User.findAll({

            include: [

                { model: User, as: 'Followers' }
            ]
        })

        const replyFindAll = Reply.findAll({
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            include: [User, { model: Tweet, include: [User] }],
            where: { TweetId: req.params.id }
        })

        Promise.all([tweetFindAll, userFindAll, replyFindAll])
            .then(responses => {
                // console.log(responses[0])

                let tweets = responses[0]
                let users = responses[1]
                let replies = responses[2]
                // console.log(tweets.toJSON())
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
                // console.log(users)

                users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

                return res.render('replyUser', { tweets: tweets.toJSON(), users, replies })
            }).catch(error => {
                console.log(error)
            })
    },

    postLike: (req, res) => {
        Like.create({
            UserId: req.user.id,
            TweetId: req.params.id
        }).then(like => {
            return res.redirect('back')
        }).catch(error => {
            console.log(error)
        })
    },

    postUnLike: (req, res) => {
        return Like.findOne({
            where: {
                UserId: req.user.id,
                TweetId: req.params.id
            }
        }).then(like => {
            like.destroy()
        }).then(unlike => {
            return res.redirect('back')
        }).catch(error => {
            console.log(error)
        })

    }
}

module.exports = tweetController