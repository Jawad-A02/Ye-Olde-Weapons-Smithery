const mysql = require('mysql')
require('dotenv').config()

/*
// localhost mysql server
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : '',
    user            : '',
    password        : '',
    database        : ''
})
*/

// engr server
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : '',
    user            : '',
    password        : ,
    database        : ''
})

// Export it for use in our applicaiton
module.exports.pool = pool;
