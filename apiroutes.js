const express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
const gauth = require("gawati-auth-middleware");

const logr = require("./logging");
const aknobject = require("./aknobject");
const docmanage = require ("./documentmanage");
const authJSON = require("./auth");
const packageJSON = require("./package.json");
const wfapis = require("./wfapis.routes");

var upload = multer();


var router = express.Router();


var jsonParser = bodyParser.json();

const EXCLUDE_FROM_AUTO_ROUTE = ["/document/upload", "/document/auth"];

/*
Map all the routes form docmanage automatically
except for indicated ones which need special treatement. 
*/
Object.keys(docmanage.documentManage).forEach( 
    (routePath) => {
        console.log(" ROUTE PATH ", routePath);
        // map all the paths except /document/upload, /document/auth
        if (EXCLUDE_FROM_AUTO_ROUTE.indexOf(routePath) < 0) {
            // only paths NOT IN  EXCLUDE_FROM_AUTO_ROUTE
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

/** adding workflow apis */
Object.keys(wfapis.wfAPIs).forEach( 
    (routePath) => {
        const wfRoute = wfapis.wfAPIs[routePath];
        console.log(` ROUTE PATH = ${routePath} with ${wfRoute.method}`);
        switch(wfRoute.method) {
            case "get":
                console.log()
                router.get(
                    routePath, 
                    jsonParser,
                    wfRoute.stack
                ); 
            break;
            case "post":
                router.post(
                    routePath, 
                    jsonParser,
                    wfRoute.stack
                ); 
            break;
            default:
                logr.error(`Unknown method provide ${wfRoute.method} only "get" and "post" are supported` );
            break; 
        }
    }
);


/** AUTH ROUTE TO TEST AUTHENTICATING SERVICES */
const AUTH_OPTIONS = {"authJSON": authJSON};
router.post("/document/auth",
    jsonParser,
    [
        function (req, res, next) {
            return gauth.authTokenValidate(req, res, next, AUTH_OPTIONS);
        },
        terminal
    ]
);

function terminal(req, res) {
    res.json({msg:"Completed !", auth: res.locals.gawati_auth});
}

/*
Shows keep alive status
*/
router.get(
    "/about",
    (req, res, next) => {
        const pkgName = packageJSON.name ; 
        const pkgVersion = packageJSON.version;
        const aboutInfo = `package=${pkgName};version=${pkgVersion};date=` ;
        res.status(200).send(aboutInfo);
    }
);

// Send the keycloak config file
router.get('/auth/config', function (req, res) {
  res.send(authJSON);
})
  

module.exports = router;

