const db = require('../models');
const Followship = db.Followship;

const helpers = require('../_helpers');

const followshipController = {
  addFollow: (req, res) => {
    const followerId = helpers.getUser(req).id;
    const followingId = Number(req.body.id);

    if (followerId === followingId) {
      req.flash('errorMessage', '無效的追蹤');
      return res.render('error');
    }

    return Followship.findOne({ where: { followerId, followingId } }).then(
      (followship) => {
        if (followship === null) {
          Followship.create({ followerId, followingId }).then(() => {
            req.flash('successMessage', '追蹤成功！');
            //return res.redirect('back');
            return res.redirect(`/users/${followingId}/tweets`);
          });
        } else {
          req.flash('errorMessage', '不得重複追蹤同一位使用者！');
          //return res.redirect('back');
          return res.redirect(`/users/${followingId}/tweets`);
        }
      },
    );
  },
  unFollow: async (req, res) => {
    const followerId = helpers.getUser(req).id;
    const followingId = Number(req.params.id);

    await Followship.destroy({ where: { followerId, followingId } });
    return res.redirect('back');
    // .then(() => {
    // if (followship !== null) {
    //   followship.destroy().then(() => {
    //     return res.redirect('back');
    //   });
    // } else {
    // req.flash('errorMessage', '無效的操作！');

    // }
    // },
    // );
  },
};

module.exports = followshipController;
