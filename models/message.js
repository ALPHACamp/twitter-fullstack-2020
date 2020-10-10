'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {});
  message.associate = function(models) {
    // associations can be defined here
  };
  return message;
};