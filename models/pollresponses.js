module.exports = (sequelize, DataTypes) => {
    const Responses = sequelize.define("responses", {
        pollID: {
            type: DataTypes.INTEGER
        },
        pollSelection: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userID: {
            type: DataTypes.INTEGER
        },
    });
    return Responses;
  };