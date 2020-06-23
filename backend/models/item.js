module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {});
  Item.associate = function(models) {
    // Association définie ici
    
    models.Item.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Item;
};