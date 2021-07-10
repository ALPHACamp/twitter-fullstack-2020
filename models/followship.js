'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
  }, {});
  Followship.associate = function (models) {
    Followship.belongsTo(models.User)
  };
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Followship'
  })
  return Followship;
};