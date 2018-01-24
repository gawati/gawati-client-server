var PouchDB = require('pouchdb');
var fs = require('fs');
var dot = require('dot');
var SETUP_CONFIGS = require('./setup.json');

/** 
 *
 *  {
    "PROTOCOL" : "http://",
    "DB_HOST" : "localhost:5984",
    "ADMIN_USER": "admin",
    "ADMIN_PW": "admin",
    "DB_NAME" : "gawati",
    "DB_ADMIN_USER": "gwadmin",
    "DB_ADMIN_PW": "password",
    "DB_READER_USER" : "gwuser",
    "DB_READER_PW": "password"
}
 * 
 */

const dbLink = (PROTOCOL, DB_HOST, DB_NAME) =>
    `${PROTOCOL}${DB_HOST}/${DB_NAME}`;

const dbConnect = ({PROTOCOL, DB_HOST, DB_NAME, DB_READER_USER, DB_READER_PW}) =>
    new PouchDB(
        dbLink(PROTOCOL, DB_HOST, DB_NAME),
        {
            auth: {
                username: DB_READER_USER,
                password: DB_READER_PW
            }
        }
    );

const doc = {
    "PROTOCOL" : "http://",
    "DB_HOST" : "localhost:5984",
    "ADMIN_USER": "admin",
    "ADMIN_PW": "admin",
    "DB_NAME" : "gawati",
    "DB_ADMIN_USER": "gwadmin",
    "DB_ADMIN_PW": "password",
    "DB_READER_USER" : "gwuser",
    "DB_READER_PW": "password"
}

var db = dbConnect(SETUP_CONFIGS);

db.post(doc)
    .then( 
        (response) => {
            console.log(" DOCUMENT POSTED ", response);
        }
    )
    .catch(
        (err) => {
            console.log(" Document Save Failed ", err);
        }
    );

