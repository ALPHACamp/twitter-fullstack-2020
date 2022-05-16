const multer = require('multer')
const upload = multer({ dest: 'temp/' })
// limit: {
// // 限制上傳檔案的大小為 1MB
//   fileSize: 1000000
// },
// fileFilter (req, file, cb) {
//   // 只接受三種圖片格式 jpg jpeg png
//   if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//     cb(new Error('Please upload an image'))
//   }
//   cb(null, true)
// }
module.exports = upload
