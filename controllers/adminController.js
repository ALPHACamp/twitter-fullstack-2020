const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const pageLimit = 10

const adminController = {
    getTweets: (req, res) => {
        console.log(req.query)
        let offset = 0

        if (req.query.page) {
            offset = (req.query.page - 1) * pageLimit
        }
        Tweet.findAndCountAll({
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true,
            include: [
                User
            ],
            offset: offset,
            limit: pageLimit
        }).then(result => {
            // data for pagination
            const page = Number(req.query.page) || 1
            const pages = Math.ceil(result.count / pageLimit)
            const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
            const prev = page - 1 < 1 ? 1 : page - 1
            const next = page + 1 > pages ? pages : page + 1
            const data = result.rows.filter(row => {
                if (row.description.length > 50) {
                    row.description = row.description.substring(0, 50) + '...'
                }
                return row
            })
            console.log(data)
            return res.render('admin/tweetsAdmin', {
                tweets: data,
                page: page,
                totalPage: totalPage,
                prev: prev,
                next: next
            })



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
            console.log(users)
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