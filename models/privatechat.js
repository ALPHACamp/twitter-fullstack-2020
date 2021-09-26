'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateChat = sequelize.define('PrivateChat', {
    message: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    toUserId: DataTypes.INTEGER,
    readed: DataTypes.BOOLEAN
  }, {});
  PrivateChat.associate = function(models) {
    PrivateChat.belongsTo(models.User)
  };
  return PrivateChat;
};