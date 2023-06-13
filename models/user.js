'use strict'
const { DataTypes, Model } = require('sequelize')

module.exports = sequelize => {
  class User extends Model {
    static associate(models) {
      //* 推文
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      //* 回覆
      User.hasMany(models.Reply, { foreignKey: 'userId' })
      //* likes
      User.hasMany(models.Like, { foreignKey: 'userId' })
      //* follow
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
    }
  }
  User.init(
    {
      // ? name 不能做其他的條件限制，只能由後端來做... 不然TEST會卡住
      name: DataTypes.STRING,
      account: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      introduction: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true
    }
  )
  return User
}
