const axios = require("axios");
const aknobject = require("./aknobject");
const aknhelper = require("./utils/AknHelper");
const urihelper = require("./utils/UriHelper");
const servicehelper = require("./utils/ServiceHelper");
const langhelper = require("./utils/LangHelper");
const componentsHelper = require("./utils/ComponentsHelper");
const generalhelper = require("./utils/GeneralHelper");
const path = require("path");
const mkdirp = require("mkdirp");
const constants = require("./constants");
const logr = require("./logging");
const fs = require("fs");
const wf = require("./utils/Workflow");
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
const returnResponse = (req, res) => {
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
    console.log("debug: formobj = ", formObj);
    // convert the submitted form to an akn object
    let aknDoc = aknobject.formObject2AknTemplateObject(formObj);
    // validates the Akoma Ntoso Object using the Yup json schema
    aknobject.validateAknObject(aknDoc)
        .then( () => {
            console.log(" Validation success ", aknDoc);
            res.locals.aknObject = aknDoc ;
            next();
        })
        .catch( (err) => {
            console.log(" Validation Error ", aknDoc);
            console.log(" Validation Error ", err);
            res.locals.aknObject = err;
            next();
        });
};

/**
 * Convert the AKN Object to XML by applying the pre-compiled template
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const convertAknObjectToXml = (req, res, next) => {
    // convert the akn object to XML document applying the handlebars template
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
    const saveXmlApi = servicehelper.getApi("xmlServer", "saveXml");
    axios({
        method: "post",
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
    const updateXmlApi = servicehelper.getApi("xmlServer", "updateXml");
    const {docTitle, docIri} = res.locals.formObject ;
    const postData = {
        "iri": docIri.value,
        "data": [{
            "name": "docTitle",
            "value": docTitle.value
        }]
    };
    axios({
        method: "post",
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
    const loadXmlApi = servicehelper.getApi("xmlServer", "getXml");
    axios({
        method: "post",
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
    
    var uiData = Object.assign({}, aknobject.identityFormTemplate(), aknobject.attachmentsFormTemplate());

    const aknTypeValue = aknhelper.getAknRootDocType(aknDoc);
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
    uiData.docPublicationDate.value = aknhelper.getGawatiNamedDate(xmlDoc, "docPublicationDate");
    uiData.docEntryIntoForceDate.value = aknhelper.getGawatiNamedDate(xmlDoc, "docEntryIntoForceDate");
    uiData.docNumber.value = xmlDoc.meta.identification.FRBRWork.FRBRnumber.showAs;
    uiData.docPart.value = xmlDoc.meta.proprietary.gawati.docPart;
    uiData.docIri.value = xmlDoc.meta.identification.FRBRExpression.FRBRthis.value;

    const embeddedContents = xmlDoc.meta.proprietary.gawati.embeddedContents;
    const compRefs = generalhelper.coerceIntoArray(xmlDoc.body.book.componentRef);
    uiData.attachments.value = componentsHelper.getComponents(embeddedContents, compRefs);
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
};

/**
   * Takes an akn document and converts it to an online document
   * @param {object} aknObject 
   */
const getOnlineDocumentFromAknObject = (aknObject) => {
    var uiData = formStateFromAknDocument(aknObject.akomaNtoso);

    //Get all workflow state info
    var curWFState = aknObject.workflow.state.status;
    var workflow = Object.assign({}, aknObject.workflow, wf.getWFStateInfo(uiData.docAknType.value, uiData.docType.value, curWFState, wf.wf));
    return {
        created: aknObject.created,
        modified: aknObject.modified,
        workflow: workflow,
        permissions: aknObject.permissions,
        akomaNtoso: uiData
    } ;
};

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
    let packages = generalhelper.coerceIntoArray(res.locals.aknObjects.package);
    let aknObjects = packages.map(
        (aknObject) => getOnlineDocumentFromAknObject(aknObject)
    );
    res.locals.returnResponse = { 
        timestamp: res.locals.aknObjects.timestamp,
        start: parseInt(res.locals.aknObjects.itemsFrom),
        total: parseInt(res.locals.aknObjects.records),
        documents: aknObjects
    };
    next();
};


const loadListing = (req, res, next) => {
    const loadDocumentsApi = servicehelper.getApi("xmlServer", "getDocuments");
    axios({
        method: "post",
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
 * Get the next file index available for embeddedContents
 * Checks components stored in eXist, not in the filesystem.
 * We allow only upto MAX_ATTACHMENTS (Default = 10)
 *
 * @param {*} existing components
 */
const getFileIndexDB = (components) => {
    let ind = 1;
    let indices = components.map(comp => comp.index);
    while (ind <= constants.MAX_ATTACHMENTS) {
        if (indices.includes(ind)) {
            ind += 1;
        } else {
            break;
        }
    }
    return ind;
};

/**
 * Writes the uploaded attachment to the filesystem.
 *
 * @param {*} file parameters
 * @param {*} response message
 */
const writeFile = (fileParams, responseMsg) => {
    const {index, newPath, newFileName, buffer, attTitle, embeddedIri, origName, fileExt} = fileParams;
    return new Promise(function(resolve, reject) {
        fs.writeFile(path.join(newPath, newFileName), buffer,  function(err) {
            if (err) {
                logr.error(generalhelper.serverMsg("ERROR while writing to file "), err) ;
                responseMsg.step_1.status = "failure";
                responseMsg.step_1.msg.push(
                    {
                        "originalname": origName,
                        "err": err
                    }
                );
                reject(err);
            } else {
                logr.info(generalhelper.serverMsg(" File was written to file system "));
                responseMsg.step_1.msg.push(
                    {
                        "index": index,
                        "showAs": attTitle,
                        "iriThis": embeddedIri,
                        "origFileName": origName,
                        "fileName": newFileName,
                        "fileType": fileExt,
                        "type": "embedded"
                    }
                );
                responseMsg.step_1.status = "write_to_fs_success";
                resolve(responseMsg);
            }
        });
    });
};

/**
 * Writes a binary file to file system.
 * Single uploads only, they are processed from the file
 * provided by multer
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const writeSubmittedFiletoFS = (req, res, next) => {
    console.log(" IN: writeSubmittedFiletoFS", res.locals.formFiles.length, 
        res.locals.formObject.pkgIdentity["docIri"].value);
    let aknObj = res.locals.formObject.pkgIdentity;
    let iri = aknObj["docIri"].value;
    let formFile = res.locals.formFiles[0];

    let arrIri = iri.split("/");
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
            logr.error(generalhelper.serverMsg(" ERROR while creating folder "), err) ;
            responseMsg.step_1.status = "failure";
            responseMsg.step_1.msg.push(
                {
                    "originalname":  formFile.originalname,
                    "err": err
                }
            );
            res.locals.binaryFilesWriteResponse = responseMsg;
            next();
        } else {
            const fileParams = {
                index: aknObj["index"],
                attTitle: aknObj["title"],
                origName: formFile.originalname,
                mimeType: formFile.mimetype,
                buffer: formFile.buffer,
                fileExt: path.extname(formFile.originalname),
                filePrefix: urihelper.fileNamePrefixFromIRI(iri),
                newPath: newPath,
            };
            //Generate index for new uploads.
            if (!fileParams.index) {
                fileParams.index = getFileIndexDB(aknObj["attachments"].value);
            }
            fileParams.embeddedIri = `${iri}_${fileParams.index}`;
            fileParams.newFileName = `${fileParams.filePrefix}_${fileParams.index}${fileParams.fileExt}`;

            writeFile(fileParams, responseMsg)
                .then(result => {
                    console.log(" RESPONSE MSG = ", JSON.stringify(result));
                    res.locals.binaryFilesWriteResponse = responseMsg;
                    next();
                })
                .catch(err => {
                    res.locals.binaryFilesWriteResponse = responseMsg;
                    console.log(err);
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
        if (key.startsWith("doc")) {
            newObj[key] = JSON.parse(formObject[key]);
        }
    }
    return formObject = {
        pkgIdentity: newObj,
        pkgAttachments: JSON.parse(formObject['attachments'])
    };
};



const addAttInfoToAknObject = (req, res, next) => {
    console.log(" IN: addAttInfoToAknObject");
    const writeResponse = res.locals.binaryFilesWriteResponse;
    if (writeResponse.step_1.status === "write_to_fs_success") {
        // see msg object shape below in comment.
        const writeInfo = writeResponse.step_1.msg[0];
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
        var existingComponents = res.locals.aknObject["attachments"];
        tmplObject.components = existingComponents || [];

        var pos = componentsHelper.posOfComp(writeInfo.index, tmplObject.components);

        //Case Update: Remove the old item before pushing the new one.
        if (pos > -1) {
            tmplObject.components.splice(pos, 1);
        }
        tmplObject.components.push(writeInfo);
    }
    res.locals.aknObject = tmplObject;
    res.locals.returnResponse = {success: "finished"};
    next();
};

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