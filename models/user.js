'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.hasMany(models.Like, { foreignKey: 'UserId' })
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
      User.hasMany(models.Message, { foreignKey: 'senderId', as: 'sentMessages' })
      User.hasMany(models.Message, { foreignKey: 'receiverId', as: 'receivedMessages' })
      // User.belongsToMany(User, {
      //   through: models.Message,
      //   foreignKey: 'senderId',
      //   as: 'receivers'
      // })
      // User.belongsToMany(User, {
      //   through: models.Message,
      //   foreignKey: 'receiverId',
      //   as: 'senders'
      // })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    account: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
