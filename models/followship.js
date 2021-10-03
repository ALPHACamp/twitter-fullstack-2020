'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    'Followship',
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER
    },
    {}
  )
  Followship.associate = function (models) {
    Followship.belongsTo(models.User, {
      as: 'follower',
      foreignKey: 'followerId'
    })
    Followship.belongsTo(models.User, {
      as: 'following',
      foreignKey: 'followingId'
    })
  }
  return Followship
}
