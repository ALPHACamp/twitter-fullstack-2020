const { User } = require('../models')

module.exports = {
  settingValidator: async (req, res, next) => {
    const { account, name, email, password, confirmedPassword } = req.body
    const errors = []

    if (!(account && name && email && password && confirmedPassword)) {
      errors.push({ message: 'empty feilds!' })
    }
    if (password !== confirmedPassword) {
      errors.push({ message: '2 passwords are different!' })
    }
    const isMySelf = req.user.id.toString() === req.params.id.toString()
    if (!isMySelf) {
      errors.push({ message: 'you can only edit your own setting!' })
    }

    const user = await User.findByPk(req.params.id)

    if (user.account !== account) {
      const userByAccount = await User.findOne({ where: { account } })
      if (userByAccount) {
        errors.push({ message: 'the account you want already exists!' })
      }
    }
    if (user.email !== email) {
      const userByEmail = await User.findOne({ where: { email } })
      if (userByEmail) {
        errors.push({ message: 'the email you want already exists!' })
      }
    }

    res.locals.errors = errors
    res.locals.userSetting = {
      id: req.params.id,
      ...req.body
    }
    next()
  }
}