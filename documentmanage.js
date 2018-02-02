const axios = require('axios');
const moment = require('moment');
const aknobject = require('./aknobject');
const urihelper = require('./utils/urihelper');
const servicehelper = require('./utils/servicehelper');
const langhelper = require('./utils/langhelper');
const generalhelper = require('./utils/generalhelper');
/*
Generic Middleware ROute handlers 
*/

var documentManageAPIs  = {};


/**
 * Receives the Form posting
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveSubmitData = (req, res, next) =>  {
    const formObject = req.body.data ; 
    //console.log(" RECEIVING ", req.body);
    res.locals.formObject = formObject; 
    next();
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


/*
ROUTEHANDLER_DOCUMENT_ADD
*/



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
    );
};


documentManageAPIs["/document/add"] = [
    receiveSubmitData,
    convertFormObjectToAknObject,
    convertAknObjectToXml,
    saveToXmlDb,
    returnResponse
];


const updateAknField = (req, res, next) => {
    const updateXmlApi = servicehelper.getApi('xmlServer', 'updateXml');
    const {docTitle, docIri} = res.locals.formObject ;
    const postData = {
        "iri": docIri.value,
        "data": [{
            "name": "docTitle",
            "value": docTitle.value
        }]
    };
    axios({
        method: 'post',
        url: updateXmlApi,
        data: postData
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
    );
};

documentManageAPIs["/document/edit"] = [
    receiveSubmitData,
    updateAknField,
    //convertXmltoJsonObject,
    returnResponse
];





/*
ROUTEHANDLER_DOCUMENT_LOAD
*/


const loadXmlForIri = (req, res, next) => {
    const loadXmlApi = servicehelper.getApi('xmlServer', 'getXml');
    axios({
        method: 'post',
        url: loadXmlApi,
        data: res.locals.formObject
    }).then(
        (response) => {
            res.locals.aknObject = response.data;
            console.log(" aknObject  ", res.locals.aknObject);
            next();
        }
    ).catch(
        (err) => {
            res.locals.aknObject = err;
            next();
        }
    );
};

const formStateFromAknDocument = (aknDoc) => {
    var uiData = {
        docLang: {value: {} , error: null },
        docType: {value: '', error: null },
        docAknType: {value: '', error: null },
        docCountry: {value: '', error: null },
        docTitle: {value: '', error: null},
        docOfficialDate: {value: undefined, error: null },
        docNumber: {value: '', error: null },
        docPart: {value: '', error: null },
        docIri : {value: '', error: null }
    };

    const aknTypeValue = Object.keys(aknDoc)[0];
    const docAknType = aknTypeValue;
    uiData.docAknType.value = docAknType ;
    const xmlDoc = aknDoc[aknTypeValue];
    uiData.docType.value = xmlDoc.name ;
    const langValue = xmlDoc.meta.identification.FRBRExpression.FRBRlanguage.language;
    uiData.docLang.value = { 
      value: langValue, 
      label: langhelper.getLangDesc(langValue).content
    };
    const countryValue = xmlDoc.meta.identification.FRBRWork.FRBRcountry.value;
    uiData.docCountry.value = countryValue;
    uiData.docTitle.value = xmlDoc.meta.publication.showAs;
    uiData.docOfficialDate.value = 
          xmlDoc.meta.identification.FRBRExpression.FRBRdate.date, 
    
    uiData.docNumber.value = xmlDoc.meta.identification.FRBRWork.FRBRnumber.showAs;
    uiData.docPart.value = xmlDoc.meta.proprietary.gawati.docPart;
    uiData.docIri.value = xmlDoc.meta.identification.FRBRExpression.FRBRthis.value;
    return uiData;
    /*
    {
      docLang: {value: {value:       } , error: null },
      docType: {value: '', error: null },
      docAknType: {value: '', error: null },
      docCountry: {value: '', error: null },
      docTitle: {value: '', error: null},
      docOfficialDate: {value: '', error: null },
      docNumber: {value: '', error: null },
      docPart: {value: '', error: null },
      docIri : {value: '', error: null }
    }
    */      
  }

const convertAknXmlToObject = (req, res, next) => {
    let uiData = formStateFromAknDocument(res.locals.aknObject.akomaNtoso);
    res.locals.returnResponse = uiData;
    next();
};

documentManageAPIs["/document/load"] = [
    receiveSubmitData,
    loadXmlForIri,
    convertAknXmlToObject,
    //convertXmltoJsonObject,
    returnResponse
];



/**
 * API stack for each Request end point. 
 * THey are called one after the other in the order of the array
 * YOu need to call next() at the end to ensure the next api in the chain
 * gets called.
 */

module.exports.documentManage = documentManageAPIs ;