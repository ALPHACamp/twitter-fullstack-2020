'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    roomName: DataTypes.STRING,
    toId: { 
      type:DataTypes.INTEGER,
      reference: {
        model:'User',
        key:'id'
      }
    },
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User);
  };
  return Message;
};