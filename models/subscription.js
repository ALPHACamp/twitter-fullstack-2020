module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    subscriberId : DataTypes.INTEGER,
    subscribingId: DataTypes.INTEGER,
    createdAt    : DataTypes.DATE,
    updatedAt    : DataTypes.DATE,
  }, {});
  Subscription.associate = function (models) {
    // associations can be defined here
  };
  return Subscription;
};
