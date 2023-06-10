'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Tweet, { foreignKey: 'userId' })

      User.hasMany(models.Reply, { foreignKey: 'userId' })

      User.hasMany(models.Like, { foreignKey: 'userId' })
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedTweets'
      })

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
  };
  User.init({
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
