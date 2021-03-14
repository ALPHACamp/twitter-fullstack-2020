const { getUser } = require('../middleware/authenticationHelper');
const db = require('../models');

const { Subscription } = db;

const subscriptionController = {
  addSubscribe: (req, res) => {
    const subscribingId = (req.body.id !== undefined) ? Number(req.body.id) : Number(req.params.id);
    const subscriberId = getUser(req).id;

    if (!Number.isInteger(subscribingId) || (subscriberId === subscribingId)) {
      req.flash('error_messages', '無法訂閱此用戶');
      return res.redirect(200, 'back');
    }
    return Subscription
    .create({
      subscriberId,
      subscribingId,
    })
    .then((subscription) => res.redirect('back'))
    .catch((error) => console.log('Add Subscription error', error));
  },
};
module.exports = subscriptionController;
