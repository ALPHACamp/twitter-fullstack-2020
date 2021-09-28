const db = require('../models');
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const { User } = db;

//for test only
const { getTestUser } = require("../controllers/util.service.js");

const userService = {
  getUser: (req, res, callback) => {
    const user = getTestUser(req);
    if (user.id !== Number(req.params.id)) {
      return callback({
        status: 'error',
      });
    }
    User.findByPk(user.id).then((me) => {
      callback(me);
    });
  },

  putUser: async (req, res, callback, errorCallback) => {
    const user = getTestUser(req);
    const { name, introduction, avatar, cover } = req.body;
    if (!name || !introduction) {
      return errorCallback('名稱或自我介紹欄位，不可空白')
    }
    if (name.length > 50) {
      return errorCallback('名稱必須在50字符以內')
    }
    if (introduction && introduction.length > 160) {
      return errorCallback('自我介紹，必須在160字符以內')
    }

    const images = {};
    const { files } = req;
    const uploadImg = (path) => {
      return new Promise((resolve, reject) => {
        imgur.upload(path, (err, img) => {
          if (err) {
            return reject(err);
          }
          resolve(img);
        });
      });
    };
    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      for (const key in files) {
        images[key] = await uploadImg(files[key][0].path);
      }
    }
    User.findByPk(user.id).then((me) => {
      me.update({
        name: name,
        introduction: introduction,
        cover: images.cover ? images.cover.data.link : profile.cover,
        avatar: images.avatar ? images.avatar.data.link : profile.avatar,
      }).then(() => callback(me))
    })
  },
}

module.exports = userService