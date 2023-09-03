const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// 因為一次會傳2張相片，avatar 以及 cover，因此使用multer提供的fields
const cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 }, // name 欄位名稱, maxCount: 此欄位一次上傳?張圖片
  { name: 'cover', maxCount: 1 }
])

module.exports = cpUpload
