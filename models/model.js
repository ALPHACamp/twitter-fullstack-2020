'use strict';
module.exports = (sequelize, DataTypes) => {

  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: DataTypes.STRING,
    roomId: DataTypes.INTEGER,
  }, {});

Message.associate = function (models) {
  Message.belongsTo(models.Room);
  };
  return Message;
};