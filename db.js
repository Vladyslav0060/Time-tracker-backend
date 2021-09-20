const Pool = require("pg").Pool
const pool = new Pool({
    user:"vlad",
    password:"vlad",
    host:"pg_db",
    port:5432,
    // database:"node_postgres"
    database:"time_management"
})

module.exports = pool

// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize("node_postgres", "vlad", "vlad", {
//   host: "pg_db",
//   dialect: "postgres",
// });
// //const sequelize = new Sequelize("postgresql://localhost:5432/node_postgres");

// module.exports = sequelize;

