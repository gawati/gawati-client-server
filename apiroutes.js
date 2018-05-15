const express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
const gauth = require("gawati-auth-middleware");

const logr = require("./logging");
//const aknobject = require("./aknobject");
const authJSON = require("./auth");
const packageJSON = require("./package.json");
const dmapis = require ("./documentmanage.routes");
const wfapis = require("./wfapis.routes");
const attapis = require("./attapis.routes");

var upload = multer();


var router = express.Router();


var jsonParser = bodyParser.json();

const EXCLUDE_FROM_AUTO_ROUTE = ["/attachments/upload", "/document/auth"];

/** adding document apis */
Object.keys(dmapis.dmAPIs).forEach(
    (routePath) => {
        const dmRoute = dmapis.dmAPIs[routePath];
        console.log(` ROUTE PATH = ${routePath} with ${dmRoute.method}`);
        switch(dmRoute.method) {
        case "get":
            router.get(
                routePath,
                jsonParser,
                dmRoute.stack
            );
            break;
        case "post":
            if (EXCLUDE_FROM_AUTO_ROUTE.indexOf(routePath) < 0) {
                // only paths NOT IN  EXCLUDE_FROM_AUTO_ROUTE
                router.post(
                    routePath,
                    jsonParser,
                    dmRoute.stack
                );
            }
            break;
        default:
            logr.error(`Unknown method provide ${dmRoute.method} only "get" and "post" are supported` );
            break;
        }
    }
);

// handle /attachments/upload here because it is special as it has attachments
var cpUpload = upload.fields(); //[{ name: 'file_0', maxCount: 1 }]
router.post("/attachments/upload",
    upload.any(),
    attapis.attAPIs["/attachments/upload"].stack
);

/** adding attachment apis */
Object.keys(attapis.attAPIs).forEach(
    (routePath) => {
        const attRoute = attapis.attAPIs[routePath];
        console.log(` ROUTE PATH = ${routePath} with ${attRoute.method}`);
        switch(attRoute.method) {
        case "get":
            router.get(
                routePath,
                jsonParser,
                attRoute.stack
            );
            break;
        case "post":
            if (EXCLUDE_FROM_AUTO_ROUTE.indexOf(routePath) < 0) {
                // only paths NOT IN  EXCLUDE_FROM_AUTO_ROUTE
                router.post(
                    routePath,
                    jsonParser,
                    attRoute.stack
                );
            }
            break;
        default:
            logr.error(`Unknown method provide ${attRoute.method} only "get" and "post" are supported` );
            break;
        }
    }
);

/** adding workflow apis */
Object.keys(wfapis.wfAPIs).forEach( 
    (routePath) => {
        const wfRoute = wfapis.wfAPIs[routePath];
        console.log(` ROUTE PATH = ${routePath} with ${wfRoute.method}`);
        switch(wfRoute.method) {
        case "get":
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
router.get("/auth/config", function (req, res) {
    res.send(authJSON);
});
  

module.exports = router;

