'use strict';
module.exports = (sequelize, DataTypes) => {
  const PublicChat = sequelize.define('PublicChat', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  PublicChat.associate = function(models) {
    PublicChat.belongsTo(models.User)
  };
  return PublicChat;
};