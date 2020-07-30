'use strict'

const model = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: DataTypes.INTEGER
      // },
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      SecondreplyId: DataTypes.INTEGER
    }
  )
  Like.associate = (models) => {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
    Like.belongsTo(models.Reply)
    Like.belongsTo(models.Secondreply)
  }

  return Like
}

module.exports = model

// const { Model } = require('sequelize')
// module.exports = (sequelize, DataTypes) => {
//   class Like extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate (models) {
//       // define association here
//     }
//   }
//   Like.init(
//     {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.INTEGER
//       },
//       UserId: DataTypes.INTEGER,
//       TweetId: DataTypes.INTEGER,
//       ReplyId: DataTypes.INTEGER,
//       SecondreplyId: DataTypes.INTEGER
//     },
//     {
//       sequelize,
//       modelName: 'Like'
//     }
//   )
//   return Like
// }
