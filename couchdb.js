var PouchDB = require('pouchdb');
var fs = require('fs');
var dot = require('dot');

const SETUP_CONFIGS = {
    "PROTOCOL" : "http://",
    "DB_HOST" : "localhost:5984",
    "ADMIN_USER": "admin",
    "ADMIN_PW": "admin",
    "DB_NAME" : "gawati",
    "DB_ADMIN_USER": "gwadmin",
    "DB_ADMIN_PW": "password",
    "DB_READER_USER" : "gwuser",
    "DB_READER_PW": "password"
};

let file = fs.readFileSync("./setup.txt", "utf8" );
dot.templateSettings.strip = false;
let templFunc = dot.template(file);
let out = fs.writeFileSync("./setup.sh", templFunc(SETUP_CONFIGS));
console.log(" SETUP SCRIPT GENERATED" );


/* const SERVER_AUTH = {username: 'admin', password: 'admin'};

var db = new PouchDB("http://localhost:5984/gawati", {
    auth: SERVER_AUTH
});

db.info()
    .then(function (result) {

    })
    .catch(function (err) {
        console.log(" ERROR DATABASE NOT CREATED ", err);
    });


 */