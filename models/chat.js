'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    UserId: DataTypes.INTEGER,
    channel: DataTypes.STRING,
    room: DataTypes.STRING,
    behavior: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  Chat.associate = function (models) {
    // associations can be defined here
    Chat.belongsTo(models.User)
  };
  return Chat;
};