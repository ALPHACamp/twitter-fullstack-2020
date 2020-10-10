'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User);
  };
  return Message;
};