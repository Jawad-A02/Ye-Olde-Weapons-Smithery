const mysql = require('mysql')
require('dotenv').config()

/*
// localhost mysql server
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'jvalcher',
    password        : '1234',
    database        : 'project'
})
*/

// engr server
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_valcherj',
    password        : process.env.DB_PASS,
    database        : 'cs340_valcherj'
})

// Export it for use in our applicaiton
module.exports.pool = pool;
