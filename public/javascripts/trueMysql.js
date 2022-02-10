const mysql = require('mysql')
var pool = mysql.createPool({
    connectionLimit:99,
    host: "localhost",
    user: "root",
    password: "",
    database: "zemljopisv2",
    multipleStatements: true
})
module.exports = pool;
//ovo je bolje kada imamo vise podquerija 
/*
pool.getConnection(function(err, connection) {
  if (err) throw err; // not connected!

  // Use the connection
  connection.query('SELECT something FROM sometable', function (error, results, fields) {
    // When done with the connection, release it.
    connection.release();

    // Handle error after the release.
    if (error) throw error;

    // Don't use the connection here, it has been returned to the pool.
  });
});
*/
//Ovo bolje ako se ima samo jedna mysql operacija
/*
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
*/