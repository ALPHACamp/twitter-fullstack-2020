'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: DataTypes.STRING,
    roomId: DataTypes.INTEGER,
    sendId: DataTypes.INTEGER,
    // createdAt: DataTypes.DATE
  }, {});
  Message.associate = function (models) {
    Message.belongsTo(models.Room)

    // Message.belongsTo(models.User, { foreignKey: 'userId', as: 'messageReceiveLinks' });
    // Message.belongsTo(models.User, { foreignKey: 'toId', as: 'messageSendLinks' })
  };
  return Message;
};