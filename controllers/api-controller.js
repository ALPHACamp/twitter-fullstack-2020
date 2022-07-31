const { User } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const apiController = {
  getUserInfo: (req, res, next) => {
    const id = req.params.id
    User.findByPk(id)
      .then(data => {
        if (!data) throw new Error("user didn't exist")
        const user = data.toJSON()
        delete user.password
        res.json({ status: 'success', ...user })
      })
      .catch(err => next(err))
  },
  postUser: async (req, res, next) => {
    const userId = req.params.id
    const { files } = req
    const { name, introduction } = req.body

    const user = await User.findByPk(userId)
    let avatarFilePath = user.dataValues.avatar
    let coverFilePath = user.dataValues.cover

    if (files?.image) {
      avatarFilePath = await localFileHandler(...files.image)
    }

    if (files?.coverImage) {
      coverFilePath = await localFileHandler(...files.coverImage)
    }

    if (!user) throw new Error("user didn't exist")
    await user.update({
      name,
      introduction,
      avatar: avatarFilePath,
      cover: coverFilePath
    })

    return res.json({ status: 'success', ...user.toJSON() })
  }
}

module.exports = apiController
