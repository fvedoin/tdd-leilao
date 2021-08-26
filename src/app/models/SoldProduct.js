module.exports = (sequelize, DataTypes) => {
  const SoldProduct = sequelize.define(
    "SoldProduct",
    {
      order: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      lowerBid: DataTypes.FLOAT,
      buyOut: DataTypes.FLOAT,
      bid: DataTypes.FLOAT,
      name: DataTypes.STRING,
      description: DataTypes.STRING
    }
  );

  return SoldProduct;
};
