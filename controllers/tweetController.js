const db = require('../models')
const tweet = require('../models/tweet')
const user = require('../models/user')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const _helpers = require('../_helpers')
const tweetController = {
    getTweets: async (req, res) => {
        const tweetsFindAll = await Tweet.findAll({

            include: [
                // attributes => 可以從資料庫裡抓出的欄位進行過濾, 只抓取自己想要的欄位
                { model: User, attributes: ['id', 'name', 'avatar', 'account', 'createdAt'] },
                { model: Reply, },
                { model: Like, },
                { model: User, as: 'LikedUsers' },
            ],
            order: [['createdAt', 'DESC']]

        })
        const usersFindAll = await User.findAll({
            attributes: ['id', 'name', 'account', 'avatar'],
            include: [
                { model: User, as: 'Followers' },
            ],
            // 只抓取一般使用者帳號
            where: { role: '0' }
        })
        Promise.all([tweetsFindAll, usersFindAll])
            .then(responses => {
                let [tweets, users] = responses
                tweets = tweets.map(tweet => ({
                    ...tweet.dataValues,
                    likeCount: tweet.Likes.length,
                    isLike: tweet.LikedUsers.map(d => d.id).includes(_helpers.getUser(req).id),
                    replyCount: tweet.Replies.length,
                }))

                users = users.map(user => ({
                    ...user.dataValues,
                    FollowersCount: user.Followers.length,
                    isFollowed: _helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
                    isNotCurrentUser: !(user.id === _helpers.getUser(req).id)
                }))
                users = users.sort((a, b) => b.FollowersCount - a.FollowersCount)
                return res.render('index', { tweets: tweets, users: users })
            }).catch(error => {
                console.log(error)
            })


    },

    postTweets: (req, res) => {
        const description = req.body.description
        const userId = _helpers.getUser(req).id


        if (description.trim().length === 0) {
            req.flash('error_messages', '輸入不能為空白')
            return res.redirect('back')
        } else if (description.length > 140) {
            req.flash('error_messages', '輸入不能多於140個字')
            return res.redirect('back')
        } else {
            return Tweet.create({
                description: description,
                UserId: userId
            }).then(tweet => {
                // console.log(tweet)
                req.flash('success_messages', '成功新增推文!')
                return res.redirect('/tweets')
            }).catch(error => {
                console.log(error)
            })
        }

        // 收到post信息, 寫入tweets表, 完成後跳轉推文首頁

    },

    postReplies: (req, res) => {
        const { comment } = req.body

        if (comment.trim().length === 0) {
            req.flash('error_messages', '回覆輸入不能為空白'),
                res.redirect('back')
        } else {
            return Reply.create({
                UserId: _helpers.getUser(req).id,
                TweetId: req.params.id,
                comment: req.body.comment
            }).then(reply => {
                return res.redirect(`/tweets/${req.params.id}/replies`)
            }).catch(error => console.log(error))
        }

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
                let [tweets, users, replies] = responses
                users = users.map(user => ({

                    ...user.dataValues,
                    isUser: !user.Followers.map(d => d.id).includes(user.id),
                    // 計算追蹤者人數
                    FollowerCount: user.Followers.length,
                    // 判斷目前登入使用者是否已追蹤該 User 物件
                    isFollowed: _helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
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
        const userId = _helpers.getUser(req).id
        Like.create({
            UserId: userId,
            TweetId: req.params.id
        }).then(like => {
            return res.redirect('back')
        }).catch(error => {
            console.log(error)
        })
    },

    postUnLike: (req, res) => {
        const userId = _helpers.getUser(req).id
        return Like.findOne({
            where: {
                UserId: userId,
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