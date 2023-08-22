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
      User.hasMany(models.Tweet, { foreignKey: 'user_id' })
      User.hasMany(models.Reply, { foreignKey: 'user_id' })
      User.hasMany(models.Like, { foreignKey: 'user_id' })
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'user_id',
        as: 'LikedTweets'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'following_id',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'follower_id',
        as: 'Followings'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    cover: DataTypes.STRING,
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
