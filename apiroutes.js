const express = require('express');
const path = require('path');
const winston = require('winston');
const aknobject = require('./aknobject');
const docmanage = require ('./documentmanage');
const gauth = require('./gauth');
const authJSON = require('./auth');

var bodyParser = require('body-parser')
var multer = require('multer');

var upload = multer();

/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;

var router = express.Router();

var jsonParser = bodyParser.json();

const EXCLUDE_FROM_AUTO_ROUTE = ['/document/upload', '/document/auth'];

/*
Map all the routes 
*/
Object.keys(docmanage.documentManage).forEach( 
    (routePath) => {
        console.log(" ROUTE PATH ", routePath);
        // map all the paths except /document/upload
        if (EXCLUDE_FROM_AUTO_ROUTE.indexOf(routePath) < 0) {
            router.post(
                routePath,
                jsonParser,
                docmanage.documentManage[routePath]
            );
        }
});

// handle /document/upload here because it is special as it has attachments
var cpUpload = upload.fields(); //[{ name: 'file_0', maxCount: 1 }]
router.post("/document/upload",
    upload.any(),
    docmanage.documentManage["/document/upload"]
);


router.post("/document/auth",
        jsonParser,
        [testAuth]
);

function testAuth(req, res, next) {
    const data = req.body; 
    const token = req.token;
    console.log(" BODY DATA ", data);
    gauth.introspect(authJSON, token)
        .then( (introsp) => {
            res.json(introsp);
        })
        .catch( (err) => {
            res.json(err);
        })
} 

module.exports = router;

