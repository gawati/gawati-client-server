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
    console.log(" IN: receiveSubmitData");
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
    console.log(" IN: receiveFilesSubmitData");
    res.locals.formObject = constructFormObject(req.body) ; 
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
    console.log(" IN: returnResponse");    
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
    console.log(" IN: convertFormObjectToAknObject");    
    let formObj = res.locals.formObject;
    // convert the submitted form to an akn object
    let aknDoc = aknobject.formObject2AknTemplateObject(formObj);
    // validates the Akoma Ntoso Object using the Yup json schema
    aknobject.validateAknObject(aknDoc)
        .then( (value) => {
            res.locals.aknObject = aknDoc ;
            console.log(" IN: convertFormObjectToAknObject - then next() ");
            next();
        })
        .catch( (err) => {
            res.locals.aknObject = err;
            console.log(" IN: convertFormObjectToAknObject - catch next() ");
            next();
        })
};

/**
 * Convert the AKN Object to XML by applying the pre-compiled template
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const convertAknObjectToXml = (req, res, next) => {
    // convert the akn object to XML document applying the handlebars template
    //console.log("____AKNOBJECT______");
    //console.log(JSON.stringify(res.locals.aknObject));
    //console.log("____AKNOBJECT______");
    console.log(" IN: convertAknObjectToXml");    
    let xml = aknobject.aknTemplateToAknXML(res.locals.aknObject);
    let iriThis = res.locals.aknObject.exprIRIthis;
    // set update = true to ensure the document gets overwritten
    res.locals.xmlPackage = {
        "fileXml": urihelper.fileNameFromIRI(iriThis, "xml"),
        "update": true,
        "iri": iriThis,
        "data": xml
    };

    next();
};

/**
 * Saves the XML document to the database
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const saveToXmlDb = (req, res, next) => {
    console.log(" IN: saveToXmlDb");    
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

/**
 * Updates a specific field in the AKN database. 
 * For existing documents only title can be updated.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateAknField = (req, res, next) => {
    console.log(" IN: updateAknField");  
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

/**
 * Loads the XML document from the db given a specific IRI
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const loadXmlForIri = (req, res, next) => {
    console.log(" IN: loadXmlForIri");  
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

/**
 * Given an aknDoc from the database convert it to the format that the
 * form expects
 * @param {object} aknDoc 
 */
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

  /**
   * Takes an akn document and converts it to an online document
   * @param {object} aknObject 
   */
const getOnlineDocumentFromAknObject = (aknObject) => {
    return {
        created: aknObject.created,
        modified: aknObject.modified,
        akomaNtoso: formStateFromAknDocument(aknObject.akomaNtoso)
    } ;
}

const convertAknXmlToObject = (req, res, next) => {
    console.log(" IN: convertAknXmlToObject"); 
    if (res.locals.aknObject.error) {
        res.locals.returnResponse = res.locals.aknObject;
    } else {
        let uiData = getOnlineDocumentFromAknObject(res.locals.aknObject);
        res.locals.returnResponse = uiData;
    }
    next();
};

/*
* Pipeline that loads a document
*/
documentManageAPIs["/document/load"] = [
    receiveSubmitData,
    loadXmlForIri,
    convertAknXmlToObject,
    //convertXmltoJsonObject,
    returnResponse
];


const convertAknXmlToObjects = (req, res, next) => {
    console.log(" IN: convertAknXmlToObjects");  
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
    console.log(" IN: loadListing");  
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
    console.log(" IN: writeSubmittedFiletoFS", res.locals.formFiles.length, res.locals.formObject['docIri'].value);  
    let iri = res.locals.formObject['docIri'].value;
    let formFiles = res.locals.formFiles ;

    let arrIri = iri.split('/');
    let subPath = arrIri.slice(1, arrIri.length - 1 ).join("/");
    let newPath = path.join(constants.AKN_ATTACHMENTS(), subPath);
    // to fix
    //let aknFileName = urihelper.fileNameFromIRI(iri, "doc");
    var responseMsg = {
            "step_1": {"status": "", "msg": [] },
            "step_2": {"status": "", "msg": [] }
        };
    mkdirp(newPath, function(err) {
        if (err) {
            //console.log(" ERROR while creating folder ", err) ;
            winston.log(" ERROR while creating folder ", err) ;
            responseMsg.step_1.status = "failure";
            responseMsg.step_1.msg.push(
                {
                    'originalname': origName, 
                    'err': err 
                }
            );
            res.locals.binaryFilesWriteResponse = responseMsg;
            next();
        } else {
            //console.log(" formFiles = ", formFiles);
            // iterate through each submitted file 
            return Promise.all(formFiles.map(
                (file, index) => {
                    console.log(" CALLING PROMISE ", index);
                    const attTitle = res.locals.formObject[`title_${index}`]; 
                    const origName = file.originalname;
                    const mimeType = file.mimetype ; 
                    const buffer = file.buffer ; 
                    const fileExt = path.extname(origName); 
                    const filePrefix = urihelper.fileNamePrefixFromIRI(iri);
                    const embeddedIri = `${iri}_${index + 1}`;
                    //console.log(" EMBEDDED URU ", embeddedIri);
                    const newFileName = `${filePrefix}_${ index + 1 }${fileExt}` ;
                    return new Promise(function(resolve, reject) {
                        fs.writeFile(path.join(newPath, newFileName), buffer,  function(err) {
                            if (err) {
                                //console.log(" ERROR while writing to file ", err);
                                winston.error("ERROR while writing to file ", err) ;
                                responseMsg.step_1.status = "failure";
                                responseMsg.step_1.msg.push(
                                    {
                                        'originalname': origName, 
                                        'err': err 
                                    }
                                );
                                reject(err);
                            } else {
                                //console.log(" File was written to file system ");
                                winston.log(" File was written to file system ");
                                responseMsg.step_1.msg.push(
                                    {
                                        'index': index + 1,
                                        'showAs': attTitle,
                                        'iriThis': embeddedIri,
                                        'origFileName': origName, 
                                        'fileName': newFileName,
                                        'fileType': fileExt,
                                        'type': 'embedded'
                                    }
                                );
                                responseMsg.step_1.status = "write_to_fs_success";
                                //console.log(" RESPONSE MSG in PROMISE ", JSON.stringify(responseMsg));
                                resolve(responseMsg);
                            }
                        });
                    });
                }
            ))
            .then( (results) => {
                console.log(" RESPONSE MSG = ", JSON.stringify(responseMsg));
                res.locals.binaryFilesWriteResponse = responseMsg;
                next();
            })
            .catch(console.log.bind(console));
            /*
            formFiles.forEach( (file, index) => {
                const attTitle = res.locals.formObject[`title_${index}`]; 
                const origName = file.originalname;
                const mimeType = file.mimetype ; 
                const buffer = file.buffer ; 
                const fileExt = path.extname(origName); 
                const filePrefix = urihelper.fileNamePrefixFromIRI(iri);
                const embeddedIri = `${iri}_${index + 1}`;
                //console.log(" EMBEDDED URU ", embeddedIri);
                const newFileName = `${filePrefix}_${ index + 1 }${fileExt}` ;
                fs.writeFile(path.join(newPath, newFileName), buffer,  function(err) {
                    if (err) {
                        //console.log(" ERROR while writing to file ", err);
                        winston.error("ERROR while writing to file ", err) ;
                        responseMsg.step_1.status = "failure";
                        responseMsg.step_1.msg.push(
                            {
                                'originalname': origName, 
                                'err': err 
                            }
                        );
                        throw err;
                    } else {
                        //console.log(" File was written to file system ");
                        winston.log(" File was written to file system ");
                        responseMsg.step_1.msg.push(
                            {
                                'index': index + 1,
                                'showAs': attTitle,
                                'iriThis': embeddedIri,
                                'origFileName': origName, 
                                'fileName': newFileName,
                                'fileType': fileExt,
                                'type': 'embedded'
                            }
                        );
                        responseMsg.step_1.status = "write_to_fs_success";
                      
                    }
                });
            });
            */

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



const addAttInfoToAknObject = (req, res, next) => {
    console.log(" IN: addAttInfoToAknObject");  
    const writeResponse = res.locals.binaryFilesWriteResponse;
    if (writeResponse.step_1.status === 'write_to_fs_success') {
        // see msg object shape below in comment 
        const writeInfo = writeResponse.step_1.msg ; 
        var tmplObject = Object.assign({}, res.locals.aknObject) ;

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
            if (! tmplObject.components) { 
                tmplObject.components = [] ;
            }
            tmplObject.components.push(item);
       });
    }
    res.locals.aknObject = tmplObject;
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
    addAttInfoToAknObject,
    convertAknObjectToXml,
    saveToXmlDb,
    returnResponse
];


/**
 * API stack for each Request end point. 
 * THey are called one after the other in the order of the array
 * YOu need to call next() at the end to ensure the next api in the chain
 * gets called.
 */

module.exports.documentManage = documentManageAPIs ;