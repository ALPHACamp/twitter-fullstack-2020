'use strict';
module.exports = (sequelize, DataTypes) => {
  const PublicMsg = sequelize.define('PublicMsg', {
    UserId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {});
  PublicMsg.associate = function(models) {
    // associations can be defined here
    PublicMsg.belongsTo(models.User)
  };
  return PublicMsg;
};