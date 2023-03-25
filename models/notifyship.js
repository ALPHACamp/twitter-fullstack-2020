'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notifyship = sequelize.define('Notifyship', {
    notifiedId: DataTypes.INTEGER,
    notifyingId: DataTypes.INTEGER
  }, {
    modelName: 'Notifyship',
    tableName: 'Notifyships',
    underscored: true,
  });
  Notifyship.associate = function(models) {
    // associations can be defined here
  };
  return Notifyship;
};