'use strict'
const model = (sequelize, DataTypes) => {
  const Secondreply = sequelize.define(
    'Secondreply',
    {
      UserId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      replyTo: DataTypes.STRING,
      likeCount: DataTypes.INTEGER
    }
  )
  Secondreply.associate = (models) => {
    Secondreply.belongsTo(models.User)
    Secondreply.belongsTo(models.Reply)
    Secondreply.hasMany(models.Like)
    // Secondreply.belongsToMany(models.User, {
    //   through: models.Like,
    //   foreignKey: 'SecondreplyId',
    //   as: 'LikedUsers'
    // })
  }

  return Secondreply
}

module.exports = model

// const {
//   Model
// } = require('sequelize')
// module.exports = (sequelize, DataTypes) => {
//   class Secondreply extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate (models) {
//       // define association here
//       Secondreply.belongsTo(models.User)
//       Secondreply.belongsTo(models.Reply)
//       Secondreply.hasMany(models.Like)
//       // Secondreply.belongsToMany(models.User, {
//       //   through: models.Like,
//       //   foreignKey: 'SecondreplyId',
//       //   as: 'LikedUsers'
//       // })
//     }
//   };
//   Secondreply.init({
//     UserId: DataTypes.INTEGER,
//     ReplyId: DataTypes.INTEGER,
//     comment: DataTypes.TEXT,
//     replyTo: DataTypes.STRING,
//     likeCount: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Secondreply'
//   })
//   return Secondreply
// };
