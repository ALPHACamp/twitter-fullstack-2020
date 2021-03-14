const helpers = require('../_helpers');
const db = require('../models');

const { Subscription, Tweet } = db;

module.exports = {
  getAndNotifyFollowingUpdate: (userUpdatedId = null, req, res, cb) => {
    // userUpdatedId 是發出更新的user id
    // - 可以是 null, 為了後面的自己的更新部分
    // - 目前暫定更新都是 tweet 而已
    (async () => {
      if (userUpdatedId !== null) {
        // 抓最新的tweet
        const latestTweet = await Tweet.findOne({
          where: { UserId: userUpdatedId },
          order: [['createdAt', 'DESC']],
        });

        // 抓所有在線上的user
        await req.app.io.sockets.sockets.forEach(async (eaSocket) => {
          if (eaSocket.request.user !== undefined) {
            const socketUserId = eaSocket.request.user.id;

            // 如果是某個用戶更新了tweet要推送給上線的用戶
            if (userUpdatedId !== null) {
              // 看看 user 有沒有在追蹤這個更新的用戶
              const isSubscribed = await Subscription.findAll({
                where: {
                  subscriberId : socketUserId,
                  subscribingId: userUpdatedId,
                },
              });

              // 這個上線的用戶有訂閱這個更新的用戶
              if (isSubscribed.length > 0) {
                req.app.io.to(eaSocket.id).emit('unreadNewTweetNotification', { tweet: latestTweet });
              }
            }
          }
        });
      }
      // TODO: 前面沒有做return是因為這裡後面可以 return 你抓到的更新列表傳回給user，這個是給 res.render的情況下使用的
      // return cb();
    })();
  },
};
