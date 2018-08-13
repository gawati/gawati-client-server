const axios = require("axios");
const FormData = require('form-data');
const logr = require("./logging");
const path = require("path");
const extract = require("extract-zip");
const urihelper = require("./utils/UriHelper");
const servicehelper = require("./utils/ServiceHelper");
const zipFolder = require("./utils/ZipHelper");
const fileHelper = require("./utils/FileHelper");
const constants = require("./constants");

/**
 * Extract a zip folder
 */
const unzip = (src, dest) => {
  return new Promise(function(resolve, reject) {
    extract(src, {dir: dest}, function(err) {
      if (err) reject(err);
      else resolve(true);
    })
  });
}

/**
 * Receives the submitted data. 
 * Input Data: {"data": {"iri": iri}}
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveSubmitData = (req, res, next) => {
    console.log(" IN: receiveSubmitData");
    res.locals.iri = req.body.data.iri;
    res.locals.formObject = req.body.data;
    next();
};

/**
 * Receives the submitted data. This particular API expects multipart form data.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveFilesSubmitData = (req, res, next) => {
    // convert the formdata multipart object to use the json object form expected in formObject.
    console.log(" IN: receiveFilesSubmitData");
    res.locals.formObject = req.body;
    res.locals.formFiles = req.files;
    next();
};

/**
 * Generates a uid of length 5
 */
const getUid = () => {
  return Math.random().toString(36).substr(2, 5);
}

/**
 * Create a temporary folder 'akn/' to hold
 * a. Doc XML
 * b. Attachments
 * We also create the attachment folder structure inside akn/
 * Create and return a zip folder.
 */
const prepareAndSendPkg = (req, res, next) => {
  console.log(" IN: prepareZip");

  //metadata + public key (if present) loaded from DB
  const unzippedPkgPath = path.join(constants.TMP_PKG_FOLDER(), "pkg");

  const tmpUid = 'tmp' + getUid();
  const tmpAknDir = path.join(constants.TMP_PKG_FOLDER(), tmpUid);
  const zipPath = tmpAknDir + '.zip';

  //Remove existing folders with the same tmpUid
  fileHelper.removeFileFolder(tmpAknDir)
  .then((result) => {
    const iri = res.locals.iri;

    //Create the folder structure for attachments
    let arrIri = iri.split("/");
    let subPath = arrIri.slice(1, arrIri.length - 1 ).join("/");
    let dest = tmpAknDir;
    let attSrc = path.join(constants.AKN_ATTACHMENTS(), subPath);

    //creates the parent folder 'tmp/tmpxxxx'
    return fileHelper.createFolder(dest)
    .then(result => {
        return fileHelper.fileFolderExists(attSrc)
    })
    .then(attExists => {
        return attExists 
        ? Promise.all([
            fileHelper.copyFiles(unzippedPkgPath, dest),
            fileHelper.copyFiles(attSrc, dest)
        ])
        : fileHelper.copyFiles(unzippedPkgPath, dest)
    })
    //Pass returnPkg as callback on completion of zip.
    .then(result => zipFolder(tmpUid, zipPath, () => returnPkg(res, zipPath)))
    .catch((err) => {
      res.locals.returnResponse = {"status": "failure"};
      console.log(err);
      next();
    });
  })
  .catch(err => {
    res.locals.returnResponse = {"status": "failure"}
    console.log(err)
    next();
  });
}

/**
 * Unzips the pkg received from the DB
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const unzipDBPkg = (req, res, next) => {
    console.log(" IN: unzipDBPkg");
    const pkgZipPath = path.join(constants.TMP_PKG_FOLDER(), "pkg.zip");
    const unzippedPkgPath = path.join(constants.TMP_PKG_FOLDER(), "pkg");

    fileHelper.removeFileFolder(unzippedPkgPath)
    .then(result => {
        return unzip(pkgZipPath, path.resolve(unzippedPkgPath))
    })
    .then(result => next())
    .catch((err) => {
        res.locals.returnResponse = {"status": "failure"};
        console.log(err);
        next();
    });
}

/**
 * Loads the metadata XML document and public key (if present) from the db given a specific IRI
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const loadPkgForIri = (req, res, next) => {
    console.log(" IN: loadPkgForIri");
    const loadPkgApi = servicehelper.getApi("xmlServer", "loadPkg");
    const {url, method} = loadPkgApi;

    const pkgZipPath = path.join(constants.TMP_PKG_FOLDER(), "pkg.zip");

    axios({
        method: method,
        url: url,
        data: res.locals.formObject
    }).then((response) => {
        return fileHelper.writeFile(new Buffer(response.data, "base64"), pkgZipPath);
    })
    .then(result => {
        formObj = res.locals.formObject;
        if (formObj.hasOwnProperty('noAtt') && formObj.noAtt) {
            returnPkg(res, pkgZipPath);
        } else {
            next();
        }
    })
    .catch((err) => {
        res.locals.returnResponse = {"status": "failure"};
        console.log(err);
        next();
    });
};

/**
 * Check if return response status is errored
 */
const isFailed = (returnResponse) => {
	if (returnResponse && 'status' in returnResponse)
		return returnResponse.status === 'failure';
	else
		return false;
}

/**
 * Returns the zipped package in the response.
 */
const returnPkg = (res, zipPath) => {
	if (isFailed(res.locals.returnResponse)) {
		res.json(res.locals.returnResponse);	
	} else {
		res.contentType('zip');
		res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(zipPath));
		res.sendFile(path.resolve(zipPath));
	}
}

/**
 * Prepare package to save on database
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const prepToSavePkg = (req, res, next) => {
    console.log(" IN: prepToSavePkg");
    let {iri} = res.locals.formObject;
    let files = res.locals.formFiles;

    let aknXml = '';
    let publicKey = '';
    for (let i=0; i<files.length; i++) {
        if (files[i].fieldname === 'file') {
            aknXml = files[i].buffer.toString();
        } else if (files[i].fieldname === 'public_key') {
            publicKey = files[i].buffer.toString('base64');
        }
    }

    // set update = true to ensure the document gets overwritten
    res.locals.signedPkg = {
        "update": true,
        "iri": iri,
        "doc": aknXml,
        "publicKey": publicKey
    };

    next();
};

/**
 * Saves package on database
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const savePkgForIri = (req, res, next) => {
    console.log(" IN: savePkgForIri");
    const savePkgApi = servicehelper.getApi("xmlServer", "savePkg");
    const {url, method} = savePkgApi;
    axios({
        method: method,
        url: url,
        data: res.locals.signedPkg
    }).then(
        (response) => {
            res.locals.returnResponse = response.data;
            next();
        }
    ).catch(
        (err) => {
            console.log(err);
            res.locals.returnResponse = err;
            next();
        }
    );
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const returnResponse = (req, res) => {
    console.log(" IN: returnResponse");    
    res.json(res.locals.returnResponse);
};

module.exports = {
    //Load pkg methods
    receiveSubmitData: receiveSubmitData,
    loadPkgForIri: loadPkgForIri,
    unzipDBPkg: unzipDBPkg,
    prepareAndSendPkg: prepareAndSendPkg,

    //Upload pkg methods
    receiveFilesSubmitData: receiveFilesSubmitData,
    prepToSavePkg: prepToSavePkg,
    savePkgForIri: savePkgForIri,
    returnResponse: returnResponse
};