const db = require('../models')
const User = db.User
const helper = require('../_helpers')

module.exports = {
    getUser: (req, res) => {
        const userId = req.query.userId ? req.query.userId : helper.getUser(req).id
        const id = req.params.id
        if (Number(userId) !== Number(id)) {
            return res.json({ status: 'error', message: 'Access denied' })
        }
        User.findByPk(id).then(data => {
            return res.json(data)
        })
    },
    putUser: (req, res) => {
        const id = req.params.id
        const updatedData = req.body
        User.findByPk(id).then(user => {
            user.update(updatedData).then(() => {
                res.json({ status: 'success', message: 'User was successfully updated!' })
            })
        })
    }
}