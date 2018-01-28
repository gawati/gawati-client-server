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



router.post("/document/add",
    jsonParser,
    docmanage.documentManage["/document/add"]
);

router.post("/document/load",
    jsonParser,
    docmanage.documentManager["/document/load"]
);


module.exports = router;

