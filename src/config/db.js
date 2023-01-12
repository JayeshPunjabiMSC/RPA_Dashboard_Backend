
const mySql = require("mysql");

const db = mySql.createConnection({
    host : "db-covid-ingest.cdtwfhh1phml.ap-southeast-1.rds.amazonaws.com",
    port : "3306",
    user : "wt_admin",
    password : "R+OElVhod7{xE",
    database : "ford_ingest",
});

module.exports = db;