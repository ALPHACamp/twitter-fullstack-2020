'use strict'
const model = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    'Followship',
    {
      FollowerId: DataTypes.INTEGER,
      FollowingId: DataTypes.INTEGER
    }
  )

  return Followship
}

module.exports = model

// -----Testing for Model.init----- //
// const { Model } = require('sequelize')
// module.exports = (sequelize, DataTypes) => {
//   class Followship extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate (models) {
//       // define association here
//     }
//   }
//   Followship.init(
//     {
//       FollowerId: DataTypes.INTEGER,
//       FollowingId: DataTypes.INTEGER
//     },
//     {
//       sequelize,
//       modelName: 'Followship'
//     }
//   )
//   return Followship
// }
