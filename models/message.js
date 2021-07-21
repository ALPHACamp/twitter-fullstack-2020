'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message: DataTypes.TEXT
  }, {});
  Message.associate = function (models) {
    Message.belongsTo(models.User)
  };
  return Message;
};