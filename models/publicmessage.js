'use strict';
module.exports = (sequelize, DataTypes) => {
  const PublicMessage = sequelize.define('PublicMessage', {
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  PublicMessage.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.User)
  };
  return PublicMessage;
};