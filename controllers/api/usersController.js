const { Op } = require('sequelize');
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const helpers = require('../../_helpers');
const customHelpers = require('../../custom_helpers');

const db = require('../../models');

const {
  Tweet, User, Reply, Like, Followship,
} = db;

const usersController = {
  // 使用者取得個人資料
  getUser: (req, res, done) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.json({
        status: 'error',
      });
    }
    User.findByPk(helpers.getUser(req).id).then((me) => {
      res.json(me);
    });
  },
  // 使用者編輯個人資料
  putUser: async (req, res, done) => {
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
      req.flash('error_messages', '名稱不可以空白');
      return res.redirect('/');
    }
    if (name.length > 50) {
      req.flash('error_messages', '名稱不能超過50字');
      return res.redirect('/');
    }
    if (introduction && introduction.length > 160) {
      req.flash('error_messages', '自我介紹不能超過160字');
      return res.redirect('/');
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
        .then(() => {
          req.flash('success_messages', '成功更新');
          return res.json(me);
        });
      });
    } else {
      User.findByPk(helpers.getUser(req).id).then((me) => {
        me.update({
          name        : req.body.name,
          introduction: req.body.introduction,
          cover       : me.cover,
          avatar      : me.avatar,
        }).then(() => {
          req.flash('success_messages', '成功更新');
          return res.json(me);
        });
      });
    }
  },
};
module.exports = usersController;
