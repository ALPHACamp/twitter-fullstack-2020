'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define('PrivateMessage', {
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  PrivateMessage.associate = function (models) {
    PrivateMessage.belongsTo(models.User, {
      foreignKey: 'SenderId',
      as: 'Sender'
    })
    PrivateMessage.belongsTo(models.User, {
      foreignKey: 'ReceiverId',
      as: 'Receiver'
    })

  };
  return PrivateMessage;
};