'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User)
  };
  return Message;
};