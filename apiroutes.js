const express = require('express');
const path = require('path');
const winston = require('winston');
const aknobject = require('./aknobject');
const docmanage = require ('./documentmanage');

var bodyParser = require('body-parser')
var multer = require('multer');

var upload = multer();

/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;

var router = express.Router();

var jsonParser = bodyParser.json();

/*
Map all the routes 
*/
Object.keys(docmanage.documentManage).forEach( 
    (routePath) => {
        console.log(" ROUTE PATH ", routePath);
     if (routePath !== '/document/upload') {
        router.post(
            routePath,
            jsonParser,
            docmanage.documentManage[routePath]
        );
     }
});

var cpUpload = upload.fields(); //[{ name: 'file_0', maxCount: 1 }]
router.post("/document/upload",
    upload.any(),
    docmanage.documentManage["/document/upload"]
);

/*
router.post("/document/add",
    jsonParser,
    docmanage.documentManage["/document/add"]
);

router.post("/document/load",
    jsonParser,
    docmanage.documentManage["/document/load"]
);

*/

module.exports = router;

