'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
      Post.hasMany(models.PostHashtag)
    }
  }
  Post.init({
    text: DataTypes.STRING,
    postImg: {
      type : DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull : {
          msg : "Post can't be empty"
        }
      }
    },
    like: {
      type : DataTypes.INTEGER,
      defaultValue: 0
    },
    dislike: {
      type : DataTypes.INTEGER,
      defaultValue: 0
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};