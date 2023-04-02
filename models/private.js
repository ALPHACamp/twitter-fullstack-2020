'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Private extends Model {
    static associate(models) {
      Private.belongsTo(models.User, {
        foreignKey: 'SendId',
        as: 'Sender',
      });
      Private.belongsTo(models.User, {
        foreignKey: 'ReceiveId',
        as: 'Receiver',
      });
    };
  }
  Private.init({
    SendId: DataTypes.INTEGER,
    ReceiveId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isLooked: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Private',
    tableName: 'Privates',
    underscored: true
  })
  return Private;
};
