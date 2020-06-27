'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    post: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    models.Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Post;
};