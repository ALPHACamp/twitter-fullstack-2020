const db = require('../models')
const helpers = require('../_helpers')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const apiController = {
    getUser: async (req, res, next) => {
        try {
            const currentUser = helpers.getUser(req)
            const UserId = req.params.id
            const user = await User.findOne({
                where: { id: UserId },
                include: [
                    { model: User, as: 'Followings' },
                    { model: User, as: 'Followers' },
                ]
            })
            if (currentUser.id !== user.id) {
                return res.json({ status: 'error', messages: '無法編輯其他使用者資料' })
            }
            res.json(user.toJSON())
        } catch (err) {
            next(err)
        }
    },
    putUser: async (req, res, next) => {
        try {
            const logInUserId = helpers.getUser(req).id
            const UserId = req.params.id
            const { name } = req.body
            let introduction = req.body.introduction || ''
            const avatar = req.files ? req.files.avatar : ''
            const cover = req.files ? req.files.cover : ''

            let uploadAvatar = ''
            let uploadCover = ''
            if (avatar) {
                uploadAvatar = await imgurFileHandler(avatar[0])
            }
            if (cover) {
                uploadCover = await imgurFileHandler(cover[0])
            }
            const user = await User.findByPk(UserId)

            if (user.id !== Number(logInUserId)) return res.json({ status: 'error', message: '不可編輯其他使用者資料!' })
            if (!name) return res.json({ status: 'error', message: '名稱不可為空白!' })
            if (name.length > 50) return res.json({ status: 'error', message: '名稱內容不可超過50字!' })
            if (introduction.length > 160) return res.json({ status: 'error', message: '自我介紹內容不可超過160字!' })

            const data = await user.update({
                name,
                introduction,
                avatar: uploadAvatar || user.avatar,
                cover: uploadCover || user.cover
            })
            res.json({ status: 'success', message: '已成功更新!', data })
        } catch (err) {
            next(err)
        }
    },
}

module.exports = apiController