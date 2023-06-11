const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

// 取得特定使用者頁面
router.get('/:id/tweets', userController.getUserPage)
// 取得自己的帳戶設定頁面
router.get('/:id/setting', userController.getSettingPage)
// 送出帳戶設定資訊
router.put('/:id/setting', userController.putSetting)

module.exports = router
