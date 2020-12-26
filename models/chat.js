'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    UserId: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  Chat.associate = function(models) {
    Chat.belongsTo(models.User)
    // associations can be defined here
  };
  return Chat;
};