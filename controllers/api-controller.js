const { User } = require('../models')
const helper = require('../_helpers')

const apiController = {
    editApi: (req, res, next) => {
        const id = Number(helper.getUser(req).id)
        if (id !== Number(req.params.id)) {
            return res.json({ status: 'error' })
        }
        return User.findByPk(id, { raw: true })
            .then(user => {
                if (!user) throw new Error('使用者不存在')
                return res.status(200).json(user)
            })
            .catch(err => next(err))
    },
    postApi: (req, res, next) => {
        const { name } = req.body
        const id = Number(helper.getUser(req).id)
        if (id !== Number(req.params.id)) {
            return res.json({ status: 'error' })
        }
        return User.findByPk(id)
            .then(user => {
                if (!user) throw new Error('使用者不存在')
                return user.update({ name })
            })
            .then(user => res.json({ status: 'success', user }))
            .catch(err => next(err))
    }
}


module.exports = apiController