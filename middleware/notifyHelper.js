const helpers = require('../_helpers');
const db = require('../models');

const {
  Subscription, Tweet, Notification, User,
} = db;

module.exports = {
  getAndNotifyFollowingUpdate: (req, type, data) => {
    // userUpdatedId 是發出更新的user id
    // - 可以是 null, 為了後面的自己的更新部分
    // - 目前暫定更新都是 tweet 而已
    (async () => {
      if (type === 'Tweet') {
        // find latest tweet + subscribers
        const latestTweet = data;
        const userUpdatedId = data.UserId;

        const [notificationUserObj, subscribers] = await Promise.all([
          User.findByPk(userUpdatedId, {
            raw : true,
            nest: true,
          }),
          Subscription.findAll({
            raw  : true,
            nest : true,
            where: {
              subscribingId: userUpdatedId,
            },
          }),
        ]);

        delete notificationUserObj.password;

        const latestTweetJsonStr = JSON.stringify(latestTweet);

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
      } else {

      }
    })();
  },
};
