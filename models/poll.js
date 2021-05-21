module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define("poll", {
    question: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    response1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    response2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    response3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    response4: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  });
  return Poll;
};