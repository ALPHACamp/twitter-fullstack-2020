'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    follower_id: DataTypes.INTEGER,
    following_id: DataTypes.INTEGER
  }, {
    underscored: true
  })
  Followship.associate = function (models) {
    // associations can be defined here
  }
  return Followship
}
