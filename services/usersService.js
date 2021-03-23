const helpers = require('../_helpers');
const customHelpers = require('../custom_helpers');

const db = require('../models');

const {
  User,
} = db;

const usersService = {
  getUser: (req, res, callback) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return callback({
        status: 'error',
      });
    }
    User.findByPk(helpers.getUser(req).id).then((me) => {
      callback(me);
    });
  },

  putUser: async (req, res, callback, errorCallback) => {
    const {
      name, introduction,
    } = req.body;
    let cover;
    let avatar;

    if (req.files) {
      cover = req.files.cover ? req.files.cover[0] : null;
      avatar = req.files.avatar ? req.files.avatar[0] : null;
    }

    if (!name) {
      return errorCallback('名稱不可以空白');
    }

    if (name.length > 50) {
      return errorCallback('名稱不能超過50字');
    }
    if (introduction && introduction.length > 160) {
      return errorCallback('自我介紹不能超過160字');
    }

    if (cover || avatar) {
      const updateData = {
        name        : req.body.name,
        introduction: req.body.introduction,
      };

      if (cover) {
        const image = await customHelpers.uploadFile(cover);
        updateData.cover = image.link;
      }

      if (avatar) {
        const image = await customHelpers.uploadFile(avatar);
        updateData.avatar = image.link;
      }

      User.findByPk(req.user.id).then((me) => {
        me.update(updateData)
        .then(() => callback(me));
      });
    } else {
      User.findByPk(helpers.getUser(req).id).then((me) => {
        me.update({
          name        : req.body.name,
          introduction: req.body.introduction,
          cover       : me.cover,
          avatar      : me.avatar,
        }).then(() => callback(me));
      });
    }
  },
};
module.exports = usersService;
