const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            include: [
                User
            ]
        }).then(tweets => {

            return res.render('admin/tweetsAdmin', { tweets })
        }).catch(error => {
            console.log(error)
        })
    },

    getSignInPage: (req, res) => {
        return res.render('admin/signin')
    },

    postSignInPage: (req, res) => {
        req.flash('success_messages', '成功登入！')
        // res.json({ status: 'success', message: 'ok' })
        res.redirect('/admin/tweets')
    },

    getUsers: (req, res) => {
        User.findAll({
            raw: true,
            nest: true
        }).then(users => {
            return res.render('admin/users', { users })
        }).catch(error => {
            console.log(error)
        })


    },

    deleteTweet: (req, res) => {
        const id = req.params.id
        Tweet.findByPk(id)
            .then(tweet => {
                tweet.destroy()
                    .then((tweet) => {
                        req.flash('success_messages', '成功刪除推文！')
                        return res.redirect('/admin/tweets')
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })

    }

}

module.exports = adminController