'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {

    followingId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER

  }, {});
  Followship.associate = function (models) {
    //self-referential super-many-to-many
    Followship.belongsTo(models.User, { foreignKey: 'followerId', as: 'FollowerLinks' });
    Followship.belongsTo(models.User, { foreignKey: 'followingId', as: 'FollowingLinks' });
  };
  return Followship;
};