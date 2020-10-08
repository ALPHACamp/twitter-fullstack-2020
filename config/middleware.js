const helpers = require('../_helpers');
const db = require('../models');
const User = db.User;

module.exports = {
  topUsers: (req, res, next) => {
    if (helpers.getUser(req)) {
      User.findAll({
        where: { isAdmin: '0' },
        include: [{ model: User, as: 'Followers' }],
      }).then((users) => {
        users = users
          .map((data) => ({
            ...data.dataValues,
            FollowerCount: data.Followers.length,
            isFollowed: helpers.getUser(req)
              ? helpers
                .getUser(req)
                .Followings.map((d) => d.id)
                .includes(data.id)
              : false,
          }))
          .filter((user) => user.name !== helpers.getUser(req).name);
        helpers.getUser(req).TopUsers = users
          .sort((a, b) => b.FollowerCount - a.FollowerCount)
          .slice(0, 10);
        //console.log(helpers.getUser(req))
        return helpers.getUser(req);
      });
    }
    next();
  },
};
