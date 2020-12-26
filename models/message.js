'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    type: DataTypes.STRING,
    body: DataTypes.JSON,
    fromId: DataTypes.INTEGER,
    toId: DataTypes.INTEGER
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};