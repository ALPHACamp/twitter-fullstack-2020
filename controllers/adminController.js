const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const pageLimit = 10

const adminController = {
    getTweets: (req, res) => {
        console.log(req.query)

        Tweet.findAndCountAll({
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true,
            include: [
                User
            ],

        }).then(result => {

            const data = result.rows.filter(row => {
                if (row.description.length > 50) {
                    row.description = row.description.substring(0, 50) + '...'
                }
                return row
            })
            return res.render('admin/tweetsAdmin', { tweets: data })

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
        console.log("進入 getUsers...")
        User.findAll({
            include: [
                { model: Tweet, order: [['createdAt', 'DESC']] },
                { model: Tweet, as: 'LikedTweets' },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ],

        }).then(users => {

            users = users.map(user => ({
                ...user.dataValues,
            }))

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