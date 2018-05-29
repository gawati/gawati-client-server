const axios = require("axios");
const aknobject = require("./aknobject");
const aknhelper = require("./utils/AknHelper");
const urihelper = require("./utils/UriHelper");
const servicehelper = require("./utils/ServiceHelper");
const langhelper = require("./utils/LangHelper");
const componentsHelper = require("./utils/ComponentsHelper");
const generalhelper = require("./utils/GeneralHelper");
const authHelper = require("./utils/AuthHelper");
const wf = require("./utils/Workflow");
const authJSON = require("./auth");
const gauth = require("gawati-auth-middleware");

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
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const returnResponse = (req, res) => {
    console.log(" IN: returnResponse");    
    res.json(res.locals.returnResponse);
};

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
    const {url, method} = saveXmlApi;
    axios({
        method: method,
        url: url,
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

const docDoesNotExist = (response, res) => {
    const {error, success} = response.data;
    error
    ? res.locals.returnResponse = error.code
    : res.locals.returnResponse = success.code;
    return res.locals.returnResponse === 'doc_not_found';
}

/**
 * Checks if a document with the given iri already exists in
 * the client data server.
 */
const docExistsOnClient = (req, res, next) => {
    console.log(" IN: docExists");
    const {pkg} = res.locals.formObject;
    const iri = pkg.pkgIdentity.docIri.value;
    const docExistsApi = servicehelper.getApi("xmlServer", "docExists");
    const {url, method} = docExistsApi;
    axios({
        method: method,
        url: url,
        data: {iri}
    }).then(
        (response) => {
            if (docDoesNotExist(response, res)) {
                next();
            } else {
                res.locals.returnResponse = 'doc_exists_on_client';
                res.json(res.locals.returnResponse);
            }
        }
    ).catch(
        (err) => {
            res.locals.returnResponse = err;
            res.json(res.locals.returnResponse);
        }
    );
}

/**
 * Checks if a document with the given iri already exists in
 * the portal data server.
 */
const docExistsOnPortal = (req, res, next) => {
    console.log(" IN: docExistsOnPortal");
    const {pkg, skipCheck} = res.locals.formObject;
    if (skipCheck) {
        next();
    } else {
        const iri = pkg.pkgIdentity.docIri.value;
        const doesExistApi = servicehelper.getApi("portalData", "docExists");
        const {url, method} = doesExistApi;
        axios({
            method: method,
            url: url,
            data: {iri}
        }).then(
            (response) => {
                if (docDoesNotExist(response, res)) {
                    next();
                } else {
                    res.locals.returnResponse = 'doc_exists_on_portal';
                    res.json(res.locals.returnResponse);
                }
            }
        ).catch(
            (err) => {
                res.locals.returnResponse = err;
                res.json(res.locals.returnResponse);
            }
        );
    }
}

/**
 * When extras are sent by the client ui, set formObject to 
 * contain only pkg.
 */
const setFormObject = (req, res, next) => {
    const {pkg} = res.locals.formObject;
    res.locals.formObject = pkg;
    next();
}

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
    const {url, method} = updateXmlApi;
    const {docTitle, docIri} = res.locals.formObject.pkgIdentity ;
    const postData = {
        "iri": docIri.value,
        "data": [{
            "name": "docTitle",
            "value": docTitle.value
        }]
    };
    axios({
        method: method,
        url: url,
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

/**
 * Loads the XML document from the db given a specific IRI
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
    uiData.docCreatedDate.value = aknhelper.getGawatiNamedDate(xmlDoc, "docCreatedDate");
    uiData.docModifiedDate.value = aknhelper.getGawatiNamedDate(xmlDoc, "docModifiedDate");
    uiData.docPublicationDate.value = aknhelper.getGawatiNamedDate(xmlDoc, "docPublicationDate");
    uiData.docEntryIntoForceDate.value = aknhelper.getGawatiNamedDate(xmlDoc, "docEntryIntoForceDate");
    uiData.docVersionDate.value = aknhelper.getGawatiNamedDate(xmlDoc, "docVersionDate");
    uiData.docNumber.value = xmlDoc.meta.identification.FRBRWork.FRBRnumber.showAs;
    uiData.docPart.value = xmlDoc.meta.proprietary.gawati.docPart;
    uiData.docIri.value = xmlDoc.meta.identification.FRBRExpression.FRBRthis.value;

    const embeddedContents = xmlDoc.meta.proprietary.gawati.embeddedContents;
    const compRefs = generalhelper.coerceIntoArray(xmlDoc.body.book.componentRef);
    // if there are no attachments embeddedContents is undefined
    if (embeddedContents == null) {
        uiData.attachments.value = []; // was {} should be [] i think KOHSAH 2018-05-11
    } else {
        uiData.attachments.value = componentsHelper.getComponents(embeddedContents, compRefs);
    }
    return uiData;
    /*
    {
      docLang: {value: {value:       } , error: null },
      docType: {value: '', error: null },
      docAknType: {value: '', error: null },
      docCountry: {value: '', error: null },
      docTitle: {value: '', error: null},
      docOfficialDate: {value: '', error: null },
      docCreatedDate: {value: '', error: null},
      docModifiedDate: {value: '', error: null},
      docPublicationDate: {value: '', error: null},
      docEntryIntoForceDate: {value: '', error: null},
      docVersionDate: {value: '', error: null},
      docNumber: {value: '', error: null },
      docPart: {value: '', error: null },
      docIri : {value: '', error: null },
      attachments: []
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
        workflow: workflow,
        permissions: aknObject.permissions,
        akomaNtoso: uiData
    } ;
};

/**
 * Convert a single XML document to an object 
 */
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

/**
 * Convert the XML documents to objects 
 */
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

/**
 * Load the documents allowed for the user's roles.
 */
const loadListing = (req, res, next) => {
    const roles = authHelper.getRolesForClient(res.locals.gawati_auth);
    const data = Object.assign({}, res.locals.formObject, {roles})
    const loadDocumentsApi = servicehelper.getApi("xmlServer", "getDocuments");
    const {url, method} = loadDocumentsApi;
    axios({
        method: method,
        url: url,
        data: data
    }).then(
        (response) => {
            const {error, success} = response.data;
            // if no documents, returns an error code
            if (error == null) {
                res.locals.aknObjects = response.data;
                next();
            } else {
                // respond with error in case document set is empty
                res.locals.returnResponse = error ; 
                res.json(res.locals.returnResponse);
            }
        }
    ).catch(
        (err) => {
            res.locals.aknObjects = err;
            next();
        }
    );    
};

/**
 * Load the filtered documents allowed for the user's roles.
 */
const loadFilterListing = (req, res, next) => {
    const roles = authHelper.getRolesForClient(res.locals.gawati_auth);
    const data = Object.assign({}, res.locals.formObject, {roles})
    const loadDocumentsApi = servicehelper.getApi("xmlServer", "getFilteredDocuments");
    const {url, method} = loadDocumentsApi;
    axios({
        method: method,
        url: url,
        data: data
    }).then(
        (response) => {
            const {error, success} = response.data;
            // if no documents, returns an error code
            if (error == null) {
                res.locals.aknObjects = response.data;
                next();
            } else {
                // respond with error in case document set is empty
                res.locals.returnResponse = error ; 
                res.json(res.locals.returnResponse);
            }
        }
    ).catch(
        (err) => {
            res.locals.aknObjects = err;
            next();
        }
    );    
};

const deleteDocument = (req, res, next) => {
    console.log(" IN: deleteDocument");
    const data = Object.assign({}, res.locals.formObject)
    console.log("data is " + JSON.stringify(data));
    const loadDocumentsApi = servicehelper.getApi("xmlServer", "deleteDocuments");
    const {url, method} = loadDocumentsApi;
    axios({
        method: method,
        url: url,
        data: data
    }).then(
        (response) => {
            const {error, success} = response.data;
            // if no documents, returns an error code
            if (error == null) {
                res.locals.aknObjects = response.data;
                next();
            } else {
                // respond with error in case document set is empty
                res.locals.returnResponse = error ; 
                res.json(res.locals.returnResponse);
            }
        }
    ).catch(
        (err) => {
            res.locals.aknObjects = err;
            next();
        }
    );    
};

/**
 * Authenticate the user
 */
const authenticate = (req, res, next) => {
    console.log(" IN: authenticate");
    const AUTH_OPTIONS = {"authJSON": authJSON};
    return gauth.authTokenValidate(req, res, next, AUTH_OPTIONS);
}

/**
 * API methods for each Request end point.
 * You need to call next() at the end to ensure the next api in the chain
 * gets called.
 * Calling res.json(res.locals.returnResponse) will return the response 
 * without proceeding to the next method in the API stack. 
 */
module.exports = {
    //Add new document methods
    docExistsOnClient: docExistsOnClient,
    docExistsOnPortal: docExistsOnPortal,
    setFormObject: setFormObject,
    convertFormObjectToAknObject: convertFormObjectToAknObject,
    convertAknObjectToXml: convertAknObjectToXml,
    saveToXmlDb: saveToXmlDb,

    //Edit existing document methods
    updateAknField: updateAknField,

    //Load existing document methods
    loadXmlForIri: loadXmlForIri,

    //Load documents listing methods 
    authenticate: authenticate,
    loadListing: loadListing,
    loadFilterListing: loadFilterListing,
    convertAknXmlToObjects: convertAknXmlToObjects,

    // Delete Document
    deleteDocument: deleteDocument,

    //Common methods
    receiveSubmitData: receiveSubmitData,
    returnResponse: returnResponse,
    convertAknXmlToObject: convertAknXmlToObject
};