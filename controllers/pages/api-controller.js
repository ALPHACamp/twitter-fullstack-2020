const userService = require('../../service/user-services')
const { User } = require('../../models')

const apiController = {
  getUserEditPage: async (req, res, next) => {
    userService.getUserEditPage(req, (err, user) => err ? next(err) : res.json({ ...user }))
  },
  postUserInfo: async (req, res, next) => {
    await userService.postUserInfo(req, (err, data) => err ? next(err) : res.json(data))
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")

      const { name, introduction } = req.body
      const errors = []

      if (!name) {
        errors.push({ messages: '暱稱不得為空白!' })
      }

      if (name.length > 50) {
        errors.push({ messages: '暱稱不得超過50字!' })
      }

      if (introduction.length > 160) {
        errors.push({ messages: '自我介紹不得超過160字!' })
      }

      if (errors.length) {
        return res.redirect('/users/tweets')
      }

      await user.update({
        ...user.toJSON(),
        name,
        introduction
      })

      return res.redirect(`/users/${req.params.id}/tweets`)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = apiController
