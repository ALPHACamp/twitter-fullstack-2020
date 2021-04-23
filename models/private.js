'use strict';
module.exports = (sequelize, DataTypes) => {
  const Private = sequelize.define('Private', {
    SendId: DataTypes.INTEGER,
    ReceiveId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isLooked: DataTypes.BOOLEAN
  }, {});
  Private.associate = function (models) {
    Private.belongsTo(models.User, {
      foreignKey: 'SendId',
      as: 'Sender',
    });
    Private.belongsTo(models.User, {
      foreignKey: 'ReceiveId',
      as: 'Receiver',
    });
    // associations can be defined here
  };
  return Private;
};