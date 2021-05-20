const Sequelize = require("sequelize");

const sequelize = new Sequelize("Poll-Project", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
});

sequelize.authenticate().then(
  function () {
    console.log("Connected to Poll-Project postgres database");
  },
  function (err) {
    console.log(err);
  }
);
module.exports = sequelize;
