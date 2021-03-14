const helpers = require('../_helpers');
const db = require('../models');

const {
  Subscription, Tweet, Notification, User,
} = db;

module.exports = {
  getAndNotifyFollowingUpdate: (userUpdatedId = null, req) => {
    // userUpdatedId 是發出更新的user id
    // - 可以是 null, 為了後面的自己的更新部分
    // - 目前暫定更新都是 tweet 而已
    (async () => {
      if (userUpdatedId !== null) {
        // find latest tweet + subscribers
        const [latestTweet, subscribers] = await Promise.all([
          Tweet.findOne({
            raw    : true,
            nest   : true,
            where  : { UserId: userUpdatedId },
            include: [User],
            order  : [['createdAt', 'DESC']],
          }),
          Subscription.findAll({
            raw  : true,
            nest : true,
            where: {
              subscribingId: userUpdatedId,
            },
          }),
        ]);
        const latestTweetJsonStr = JSON.stringify(latestTweet);

        const notificationUserObj = latestTweet.User;
        delete notificationUserObj.password;

        // Create Notification records
        const notificationCreatePromiseArr = subscribers.map((subscriber) => new Promise(
          (resolve, reject) => {
            Notification.create({
              userId: subscriber.subscriberId,
              type  : 'Tweet',
              data  : latestTweetJsonStr,
            }).then((notification) => resolve(notification));
          },
        ));

        await Promise.all(notificationCreatePromiseArr)
        .then((data) => {
          // 抓所有在線上的user
          req.app.io.sockets.sockets.forEach((eaSocket) => {
            if (eaSocket.request.user !== undefined) {
              const socketUserId = eaSocket.request.user.id;
              if (subscribers.find((subscriber) => subscriber.subscriberId === socketUserId)) {
                // 推播給已上線用戶，告知有更新
                req.app.io.to(eaSocket.id).emit('unreadNotification', { type: 'Tweet', user: notificationUserObj, data: latestTweet });
              }
            }
          });
        })
        .catch((err) => console.log(err));
      }
    })();
  },
};
