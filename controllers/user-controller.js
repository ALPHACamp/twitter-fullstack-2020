const { Tweet, User, Followship } = require("../models");

const userController = {
  postFollow: async (req, res, next) => {
    try{
       const { followingUserId } = req.params;
       const currentUserId = req.user.id;
       const user = await User.findByPk(followingUserId);
       const followship = await Followship.findOne({
         where: { followerId: currentUserId, followingId: followingUserId },
       });
       if (!user) throw new Error("User didn't exist");
       if (followship) throw new Error("You are already following this user!");
       await Followship.create({
         followerId: currentUserId,
         followingId: followingUserId,
       });
       res.redirect("back");
    } catch(err) {
      console.log(err)
    }
  },
};

module.exports = userController;
