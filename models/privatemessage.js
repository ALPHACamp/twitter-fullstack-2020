'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define('PrivateMessage', {
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  PrivateMessage.associate = function(models) {
    // associations can be defined here
  };
  return PrivateMessage;
};