const express = require('express');
const path = require('path');
const winston = require('winston');
const aknobject = require('./aknobject');
const docmanage = require ('./documentmanage');

var bodyParser = require('body-parser')

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
     router.post(
         routePath,
         jsonParser,
         docmanage.documentManage[routePath]
     );
});

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

