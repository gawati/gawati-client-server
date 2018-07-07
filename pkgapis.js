const axios = require("axios");
const FormData = require('form-data');
const logr = require("./logging");
const path = require("path");
const urihelper = require("./utils/UriHelper");
const servicehelper = require("./utils/ServiceHelper");
const zipFolder = require("./utils/ZipHelper");
const fileHelper = require("./utils/FileHelper");
const constants = require("./constants");

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
 * Create a zip folder, 'akn.zip' 
 */
const prepareAndSendPkg = (req, res, next) => {
  console.log(" IN: prepareZip");  
  const tmpUid = 'tmp' + getUid();
  const tmpAknDir = path.join(constants.TMP_PKG_FOLDER(), tmpUid);
  const zipPath = tmpAknDir + '.zip';
  const docXml = res.locals.aknXml;

  //Remove existing folders with the same tmpUid
  fileHelper.removeFileFolder(tmpAknDir)
  .then((result) => {
    const iri = res.locals.iri;
    //Filename for doc XML
    const xmlFilename = path.join(tmpAknDir, urihelper.fileNameFromIRI(iri, "xml"));

    //Create the folder structure for attachments
    let arrIri = iri.split("/");
    let subPath = arrIri.slice(1, arrIri.length - 1 ).join("/");
    let dest = tmpAknDir;
    let attSrc = path.join(constants.AKN_ATTACHMENTS(), subPath);

    //creates the parent folder 'tmp/tmpxxxx'
    return fileHelper.createFolder(dest)
    .then((result) => {
      return axios.all([
        fileHelper.writeFile(docXml, xmlFilename), 
        fileHelper.copyFiles(attSrc, dest)
      ])
    })
    //Pass returnPkg as callback on completion of zip.
    .then(result => zipFolder(tmpUid, zipPath, () => returnPkg(res, zipPath)))
    .catch((err) => {
      console.log(err);
      next();
    });
  })
  .catch(err => {
    console.log(err)
    next();
  });
}

/**
 * Loads the XML document from the db given a specific IRI
 * Note: this loads the actual xml and not the json.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const loadXmlForIri = (req, res, next) => {
    console.log(" IN: loadXmlForIri");
    const loadXmlApi = servicehelper.getApi("xmlServer", "getXml");
    const {url, method} = loadXmlApi;
    axios({
        method: method,
        url: url,
        data: res.locals.formObject
    }).then(
        (response) => {
            res.locals.aknXml = response.data;
            next();
        }
    ).catch(
        (err) => {
            res.locals.aknXml = err;
            next();
        }
    );
};

/**
 * Returns the zipped package in the response.
 */
const returnPkg = (res, zipPath) => {
  res.contentType('zip');
  res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(zipPath));
  res.sendFile(path.resolve(zipPath));
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
    loadXmlForIri: loadXmlForIri,
    prepareAndSendPkg: prepareAndSendPkg,

    //Common methods
    returnResponse: returnResponse
};