const mysql = require( 'mysql' );
config = {
    host: 'localhost',
    user:'root',
    password:'',
    database: 'DB_MBA2',
};
module.exports = class Database {
    constructor() {
        this.connection = mysql.createConnection( {
            host: 'localhost',
            user:'root',
            password:'',
            database: 'DB_MBA2',
        } );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

// var connection = mysql.createConnection({
//     host: 'localhost',
//     user:'root',
//     password:'',
//     database: 'DB_MBA2',
// });

// connection.connect(function(err){
//     if(err) throw err;
//     console.log('connected to the database');
// });
