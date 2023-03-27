'use strict'
// Use extending model instead of sequelize.define to define model
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedTweets'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    coverage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    // underscored: true
  })
  return User
}
