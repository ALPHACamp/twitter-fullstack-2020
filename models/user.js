'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.hasMany(models.Like, { foreignKey: 'UserId' })
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikeTweets'
      })
      User.belongsToMany(User, { // 找出「被哪些人追蹤」
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, { // 找出「自己追蹤哪些人」
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      account: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      cover: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users'
    }
  )
  return User
}
