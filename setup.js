/**
 * This Script generates a shell script that sets up 
 */
var fs = require('fs');
var dot = require('dot');
console.log(" SETUP SCRIPT GENERATING..." );

var SETUP_CONFIGS = require('./setup.json');

let file = fs.readFileSync("./setup.txt", "utf8" );
dot.templateSettings.strip = false;
let templFunc = dot.template(file);
let out = fs.writeFileSync("./setup.sh", templFunc(SETUP_CONFIGS));
console.log(" SETUP SCRIPT GENERATED" );


