module.exports = (sequelize, DataTypes) => {
  const Responses = sequelize.define("responses", {
    pollid: {
      type: DataTypes.INTEGER,
    },
    pollselection: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
    },
  });
  return Responses;
};
