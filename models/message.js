'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    type: DataTypes.STRING,
    body: DataTypes.JSON,
    FromId: DataTypes.INTEGER,
    ToId: DataTypes.INTEGER
  }, {});
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User, { foreignKey: 'FromId', sourceKey: 'id', as: 'fromId' })
    Message.belongsTo(models.User, { foreignKey: 'ToId', sourceKey: 'id', as: 'toId' })
  };
  return Message;
};