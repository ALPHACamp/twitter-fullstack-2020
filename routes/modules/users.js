const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

// 取得特定使用者所有的追蹤者
router.get('/:id/followers', userController.getUserFollowers)
// 取得特定使用者所有的追蹤中
router.get('/:id/followings', userController.getUserFollowings)
// 取得特定使用者所有喜歡的內容頁面
router.get('/:id/likes', userController.getUserLikesPage)
// 取得特定使用者所有回覆頁面
router.get('/:id/replies', userController.getUserRepliesPage)
// 取得特定使用者所有推文頁面
router.get('/:id/tweets', userController.getUserTweetsPage)
// 取得自己的帳戶設定頁面
router.get('/:id/setting', userController.getSettingPage)
// 送出帳戶設定資訊
router.put('/:id/setting', userController.putSetting)

module.exports = router
