const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;

const adminController = {

    getUsers: (req, res) => {
        User.findAll({
            include: [
                Like, Tweet,
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ],
        })
            .then(user => {
                let userFilter = user.filter(user => user.dataValues.account !== 'root')
                userFilter = userFilter.sort((a, b) => b.dataValues.Tweets.length - a.dataValues.Tweets.length)
                res.render('admin/users', { userByFind: userFilter })
            })
    },
    getTweets: (req, res) => {
        Tweet.findAll({
            include: User,
            order: [['createdAt', 'DESC']],
            limit: 9,
            raw: true,
            nest: true,
        })
            .then(tweets => {
                return res.render('admin/tweets', { tweets })
            })

    },
    deleteTweet: (req, res) => {
        Tweet.findByPk(req.params.tweetId)
            .then(tweet => {
                tweet.destroy()
                    .then(() => {
                        req.flash('successFlashMessage', '成功刪除');
                        return res.redirect('back')
                    })
                    .catch(() => {
                        req.flash('errorFlashMessage', 'ERROR #A101');
                        return res.redirect('back')
                    })
            })
            .catch(() => {
                req.flash('errorFlashMessage', 'ERROR #A102');
                return res.redirect('back')
            })
    },
    getSigninPage: (req, res) => {
        return res.render('admin/login')
    },
    signin: (req, res) => {
        return res.redirect('/admin/tweets')
    },
}
module.exports = adminController