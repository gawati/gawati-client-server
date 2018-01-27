const axios = require('axios');

const aknobject = require('./aknobject');
const urihelper = require('./utils/urihelper');
const servicehelper = require('./utils/servicehelper');

/** */


/**
 * Receives the Form posting
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveFormObject = (req, res, next) =>  {
    const formObject = req.body.data ; 
    res.locals.formObject = formObject; 
    next();
};

/**
 * Converts the Form Posting to an AKN Object which is the input for the
 * Handlebars template that outputs XML
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const convertFormObjectToAknObject = (req, res, next) => {
    let formObj = res.locals.formObject;
    let aknObject = aknobject.formObject2AknTemplateObject(formObj);
    res.locals.aknObject = aknObject;
    next();
};

/**
 * Convert the AKN Object to XML by applying the pre-compiled template
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const convertAknObjectToXml = (req, res, next) => {
    let xml = aknobject.aknTemplateToAknXML(res.locals.aknObject);
    let iriThis = res.locals.aknObject.exprIRIthis;

    res.locals.xmlPackage = {
        "fileXml": urihelper.fileNameFromIRI(iriThis, "xml"),
        "iri": iriThis,
        "data": xml
    };

    next();
};


const saveToXmlDb = (req, res, next) => {
    const saveXmlApi = servicehelper.getApi('xmlServer', 'saveXml');
    console.log(" SAVE XML DB ", saveXmlApi);
    axios({
        method: 'post',
        url: saveXmlApi,
        data: res.locals.xmlPackage
    }).then(
        (response) => {
            res.locals.returnResponse = response.data;
            next();
        }
    ).catch(
        (err) => {
            res.locals.returnResponse = err;
            next();
        }
    )
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const returnResponse = (req, res, next) => {
    res.json(res.locals.returnResponse);
};

/**
 * API stack for each Request end point. 
 * THey are called one after the other in the order of the array
 * YOu need to call next() at the end to ensure the next api in the chain
 * gets called.
 */
const documentManageAPIs = {
    "/document/add": [
        receiveFormObject,
        convertFormObjectToAknObject,
        convertAknObjectToXml,
        saveToXmlDb,
        returnResponse
    ]
};

module.exports.documentManage = documentManageAPIs ;