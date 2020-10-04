const db = require('../models/followship');
const Followship = db.Followship;

const helpers = require('../_helpers');

const followshipController = {
  addFollow: (req, res) => {
    const followerId = helpers.getUser(req).id;
    const followingId = Number(req.body.id);

    if (followerId === followingId) {
      req.flash('errorMessage', '無效的追蹤');
      res.redirect(`/users/${followerId}`);
    }

    Followship.findOne({ where: { followerId, followingId } }).then(
      (followship) => {
        if (followship === null) {
          Followship.create({ followerId, followingId }).then(() => {
            req.flash('successMessage', '追蹤成功！');
            return res.redirect(`/users/${followerId}`);
          });
        } else {
          req.flash('errorMessage', '不得重複追蹤同一位使用者！');
          return res.redirect(`/users/${followerId}`);
        }
      },
    );
  },
  unFollow: (req, res) => {
    const followerId = helpers.getUser(req).id;
    const followingId = Number(req.body.id);

    return Followship.findAll({ where: { followerId, followingId } }).then(
      (followship) => {
        if (followship !== null) {
          followship.destroy().then(() => {
            return res.redirect('back');
          });
        } else {
          req.flash('errorMessage', '無效的操作！');
          return res.redirect('back');
        }
      },
    );
  },
};

module.exports = followshipController;
