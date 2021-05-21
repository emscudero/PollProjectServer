module.exports = (sequelize, DataTypes) => {
    const Responses = sequelize.define("responses", {
        pollID: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        pollSelection: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ownerID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return Responses;
  };