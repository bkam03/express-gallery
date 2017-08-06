module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define("Gallery", {
    name: DataTypes.STRING,
    fish: DataTypes.STRING


  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Gallery;
};