module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER,
    },
    email: {
      type  : DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    account : {
      type  : DataTypes.STRING,
      unique: true,
    },
    name        : DataTypes.STRING,
    avatar      : DataTypes.STRING,
    introduction: DataTypes.TEXT,
    cover       : DataTypes.STRING,
    role        : DataTypes.STRING,
    createdAt   : {
      allowNull: false,
      type     : DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type     : DataTypes.DATE,
    },
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Tweet);
    User.hasMany(models.Reply);
    User.hasMany(models.Like);
    User.belongsToMany(models.Tweet, {
      through   : models.Like,
      foreignKey: 'UserId',
      as        : 'LikedTweets',
    });
    User.belongsToMany(User, {
      through   : models.Followship,
      foreignKey: 'followingId',
      as        : 'Followers',
    });
    User.belongsToMany(User, {
      through   : models.Followship,
      foreignKey: 'followerId',
      as        : 'Followings',
    });
  };
  return User;
};
