'use strict';
module.exports = (sequelize, DataTypes) => {
  const Privatechat = sequelize.define('Privatechat', {
    text: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    relativeId: DataTypes.INTEGER
  }, {});
  Privatechat.associate = function (models) {
    Privatechat.belongsTo(models.User, { foreignKey: 'UserId' })
    Privatechat.belongsTo(models.User, { foreignKey: 'relativeId' })
  };
  return Privatechat;
};