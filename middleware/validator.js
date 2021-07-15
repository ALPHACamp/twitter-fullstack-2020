const { User } = require('../models')
const helpers = require('../_helpers')
module.exports = {
  settingValidator: async (req, res, next) => {
    const { account, name, email, password, confirmedPassword } = req.body

    if (!(account && name && email && password && confirmedPassword)) {
      req.flash('error_messages', 'empty feilds!！')
    }
    if (password !== confirmedPassword) {
      req.flash('error_messages', '2 passwords are different!')
    }
    const isMySelf = helpers.getUser(req).id.toString() === req.params.id.toString()
    if (!isMySelf) {
      req.flash('error_messages', 'you can only edit your own setting!')
    }

    const user = await User.findByPk(req.params.id)

    if (user.account !== account) {
      const userByAccount = await User.findOne({ where: { account } })
      if (userByAccount) {
        req.flash('error_messages', 'the account you want already exists!')
      }
    }
    if (user.email !== email) {
      const userByEmail = await User.findOne({ where: { email } })
      if (userByEmail) {
        req.flash('error_messages', 'the email you want already exists!')
      }
    }
    res.locals.error_messages = req.flash('error_messages')
    res.locals.userSetting = {
      id: req.params.id,
      ...req.body
    }
    next()
  }
}