// 載入使用者認證 middleware/auth.js
const { authenticatedAdmin } = require('../../middleware/auth')


// 要在 router 部分裡面  新增 authenticatedAdmin (管理者認證)