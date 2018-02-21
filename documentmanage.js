const axios = require('axios');
const moment = require('moment');
const aknobject = require('./aknobject');
const urihelper = require('./utils/urihelper');
const servicehelper = require('./utils/servicehelper');
const langhelper = require('./utils/langhelper');
const generalhelper = require('./utils/generalhelper');
const path = require('path');
const mkdirp = require('mkdirp');
const constants = require('./constants');
const winston = require('winston');
const fs = require('fs');
/*
Generic Middleware ROute handlers 
*/

var documentManageAPIs  = {};


/**
 * Receives the Form posting, not suitable for multipart form data
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveSubmitData = (req, res, next) =>  {
    const formObject = req.body.data ; 
    res.locals.formObject = formObject; 
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
    res.locals.formObject = constructFormObject(req.body) ; 
    console.log(" FORM OBJECT ====> ", res.locals.formObject);
    res.locals.formFiles = req.files ; 
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

const getOnlineDocumentFromAknObject = (aknObject) => {
    return {
        created: aknObject.created,
        modified: aknObject.modified,
        akomaNtoso: formStateFromAknDocument(aknObject.akomaNtoso)
    } ;
}

const convertAknXmlToObject = (req, res, next) => {
    if (res.locals.aknObject.error) {
        res.locals.returnResponse = res.locals.aknObject;
    } else {
        let uiData = getOnlineDocumentFromAknObject(res.locals.aknObject);
        res.locals.returnResponse = uiData;
    }
    next();
};


documentManageAPIs["/document/load"] = [
    receiveSubmitData,
    loadXmlForIri,
    convertAknXmlToObject,
    //convertXmltoJsonObject,
    returnResponse
];


const convertAknXmlToObjects = (req, res, next) => {
    let aknObjects = res.locals.aknObjects.package.map(
        (aknObject) => getOnlineDocumentFromAknObject(aknObject)
    );
    res.locals.returnResponse = { 
            timestamp: res.locals.aknObjects.timestamp,
            start: 1, 
            end: 10,
            total: 10,
            documents: aknObjects
    };
    next();
};


const loadListing = (req, res, next) => {
    const loadDocumentsApi = servicehelper.getApi('xmlServer', 'getDocuments');
    axios({
        method: 'post',
        url: loadDocumentsApi,
        data: res.locals.formObject
    }).then(
        (response) => {
            res.locals.aknObjects = response.data;
            next();
        }
    ).catch(
        (err) => {
            res.locals.aknObjects = err;
            next();
        }
    );    
};

documentManageAPIs["/documents"] = [
    receiveSubmitData,
    loadListing,
    convertAknXmlToObjects,
    returnResponse
];

/**
 * Writes binary files to file system.
 * Multiple uploads are supported, they are processed from the files 
 * array provided by multer 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const writeSubmittedFiletoFS = (req, res, next) => {
    let iri = res.locals.formObject['docIri'].value;
    let formFiles = res.locals.formFiles ;

    let arrIri = iri.split('/');
    let subPath = arrIri.slice(1, arrIri.length - 1 ).join("/");
    let newPath = path.join(constants.AKN_ATTACHMENTS(), subPath);
    let aknFileName = urihelper.fileNameFromIRI(iri, "doc");
    let responseMsg = {
            "step_1": {"status": "", "msg": [] },
            "step_2": {"status": "", "msg": [] }
        };
    mkdirp(newPath, function(err) {
        if (err) {
            console.log(" ERROR while creating folder ", err) ;
            winston.log(" ERROR while creating folder ", err) ;
        } else {
            console.log(" formFiles = ", formFiles);
            // iterate through each submitted file 
            formFiles.forEach( (file, index) => {
                const attTitle = res.locals.formObject[`title_${index}`]; 
                const origName = file.originalname;
                const mimeType = file.mimetype ; 
                const buffer = file.buffer ; 
                const fileExt = path.extname(origName); 
                const filePrefix = urihelper.fileNamePrefixFromIRI(iri);
                const embeddedIri = `${iri}_${index + 1}`;
                console.log(" EMBEDDED URU ", embeddedIri);
                const newFileName = `${filePrefix}_${ index + 1 }${fileExt}` ;
                fs.writeFile(path.join(newPath, newFileName), buffer,  function(err) {
                    if (err) {
                        console.log(" ERROR while writing to file ", err);
                        winston.error("ERROR while writing to file ", err) ;
                        responseMsg.step_1.status = "failure";
                        responseMsg.step_1.msg.push(
                            {
                                'originalname': origName, 
                                'err': err 
                            }
                        );
                        throw err;
                        next();
                    } else {
                        console.log(" File was written to file system ");
                        winston.log(" File was written to file system ");
                        responseMsg.step_1.msg.push(
                            {
                                'title': attTitle,
                                'iri': embeddedIri,
                                'originalname': origName, 
                                'newname': newFileName,
                                'extension': fileExt
                            }
                        );
                        responseMsg.step_1.status = "write_to_fs_success";
                        res.locals.binaryFilesWriteResponse = responseMsg;
                        next();
                    }
                });
            });
        }
    });
};

/**
 * Restructures the formObject to a standard form that `convertFormObjectToAknObject` expects.
 * @param {object} req.body object 
 */
const constructFormObject = (bodyObject) => {
    var formObject = bodyObject; 
    var newObj = Object.assign({}, formObject);
    for (const key in formObject) {
        if (key.startsWith('doc')) {
            newObj[key] = JSON.parse(formObject[key]);
        }
    }
    return newObj;
};

/**
 * Convert the AKN Object to XML by applying the pre-compiled template
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const convertAknObjectToXmlWithAtts = (req, res, next) => {
    let xml = aknobject.aknTemplateToAknXML(res.locals.aknObject);
    let iriThis = res.locals.aknObject.exprIRIthis;

    res.locals.xmlPackage = {
        "fileXml": urihelper.fileNameFromIRI(iriThis, "xml"),
        "iri": iriThis,
        "data": xml
    };

    next();
};


const updateXmlData = (req, res, next) => {
    const writeResponse = res.locals.binaryFilesWriteResponse;
    if (writeResponse.step_1.status === 'write_to_fs_success') {
        console.log(" OBJECT === ", JSON.stringify(writeResponse.step_1));
        // see msg object shape below in comment 
        const writeInfo = writeResponse.step_1.msg ; 
        /*
        responseMsg.step_1.msg.push (
            {
                'title': attTitle,
                'originalname': origName, 
                'newname': newFileName,
                'extension': fileExt,
                'iri': embeddedIri
            }
        )
        ;
        */
       writeInfo.forEach( (item, index) => {
            var tmplObject = {} ;
            tmplObject.embeddedIndex = index + 1 ;
            tmplObject.embeddedOrigFileType = item.extension.replace(".", "");
            tmplObject.embeddedFileName = item.newname ; 
            tmplObject.embeddedOrigFileName = item.originalname ; 
            tmplObject.embeddedShowAs = item.title ; 
            tmplObject.embeddedIRIthis = item.iri ; 
            const embeddedObj = aknobject.aknTemplateToEmbeddedContentFragment(tmplObject);
            const componentRef = aknobject.aknTemplateToComponentRef(tmplObject);
            console.log(" EMBEDDED CONTENT == ", embeddedObj, componentRef);
       });
        //   <gw:embeddedContent eId="embedded-doc-{{ embeddedIndex }}" type="{{ embeddedOrigFileType }}" file="{{ embeddedFileName }}" origFile="{{ embeddedOrigFileName }}" state="true"/>
    }
    console.log(" WRITE RESPONSE ", writeResponse );
    res.locals.returnResponse = {success: "finished"};
    next();
}

/* 
* Receive the JSON containing the file info and the document info. 
* Write the file info to the file system
* Add the file info to the XML document in the XML Database
*/
documentManageAPIs["/document/upload"] = [
    receiveFilesSubmitData,
    convertFormObjectToAknObject,
    writeSubmittedFiletoFS,
    updateXmlData,
    returnResponse
];


/**
 * API stack for each Request end point. 
 * THey are called one after the other in the order of the array
 * YOu need to call next() at the end to ensure the next api in the chain
 * gets called.
 */

module.exports.documentManage = documentManageAPIs ;