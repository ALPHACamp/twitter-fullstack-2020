const { getUser } = require('../middleware/authenticationHelper');
const { getAndNotifyFollowingUpdate } = require('../middleware/notifyHelper');
const db = require('../models');

const { Followship, User } = db;

const followshipController = {
  addFollowship: (req, res) => {
    const followingId = (req.body.id !== undefined) ? Number(req.body.id) : Number(req.params.id);
    const followerId = getUser(req).id;

    if (!Number.isInteger(followingId) || (followerId === followingId)) {
      req.flash('error_messages', '無法跟隨此用戶');
      return res.redirect(200, 'back');
    }
    return Followship
    .create({
      followerId,
      followingId,
    })
    .then(async (followship) => {
      User.findByPk(followerId, {
        raw : true,
        nest: true,
      })
      .then(async (followerUser) => {
        delete followerUser.password;

        await getAndNotifyFollowingUpdate(req, 'Followship', followerUser, followingId);

        return res.redirect('back');
      });
    })
    .catch((error) => console.log('Add Followship error', error));
  },

  removeFollowship: (req, res) => {
    const followerId = getUser(req).id;
    const followingId = Number(req.params.id);

    if (!Number.isInteger(followingId)) {
      req.flash('error_messages', '無法跟隨此用戶');
      return res.redirect('back');
    }

    return Followship
    .findOne({
      where: {
        followerId,
        followingId,
      },
    })
    .then((followship) => followship.destroy().then(() => res.redirect('back')));
  },
};
module.exports = followshipController;
