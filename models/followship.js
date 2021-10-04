'use strict'

module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {})
  Followship.associate = function (models) {
    // associations can be defined here
    // self-referential
    Followship.belongsTo(models.User, { 
      foreignKey: 'followerId', 
      as: 'FollowerLinks' 
    })
    Followship.belongsTo(models.User, { 
      foreignKey: 'followingId', 
      as: 'FollowingLinks' 
    })
  }
  return Followship
}