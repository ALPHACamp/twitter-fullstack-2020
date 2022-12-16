'use strict'
<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const FollowShip = sequelize.define('FollowShip', {
  }, {})
  FollowShip.associate = function (models) {
  }
  return FollowShip
}
=======
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {

    }
  };
  Followship.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}
>>>>>>> fe99ea42a98a36c1b067f7d56776b8d43d2f57f4
