const dm = require("./documentmanage");

/**
 * API stack for each Request end point. 
 * They are called one after the other in the order of the array
 */
var dmAPIs  = {};

/*
Adds a new document to the database.
Check for existence of doc with the same IRI on Client and Portal.
Input object submitted to the API:
"data": {
    "pkg": {
        "pkgIdentity":
        "pkgAttachments":
        ...
    }
    "skipCheck":
}
param {skipCheck} Boolean - whether docExistsOnPortal check may be skipped. 
 */
dmAPIs["/document/add"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.docExistsOnClient,
        dm.docExistsOnPortal,
        dm.setFormObject,
        dm.convertFormObjectToAknObject,
        dm.convertAknObjectToXml,
        dm.saveToXmlDb,
        dm.returnResponse
    ]
};

/*
Updates a field of an existing document on the database.
Input object submitted to the API:
"data": {
    "pkg": {
        "pkgIdentity":
        "pkgAttachments":
        ...
    }
}
 */
dmAPIs["/document/edit"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.updateAknField,
        //convertXmltoJsonObject,
        dm.returnResponse
    ]
};

/*
Loads an existing document on the database.
Input object submitted to the API:
"data": {
    "iri": "/akn/ke/act/legge/1970-06-03/Cap_44/eng@/!main"
}
 */
dmAPIs["/document/load"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.loadXmlForIri,
        dm.convertAknXmlToObject,
        dm.returnResponse
    ]
};

/*
Lists all documents that the user has permissions to.
Input object submitted to the API:
"data": {
    "docTypes": "all", 
    "itemsFrom": 1,
    "pageSize": 5
}
 */
dmAPIs["/documents"] = {
    method: "post", 
    stack: [
        dm.authenticate,
        dm.receiveSubmitData,
        dm.loadListing,
        dm.convertAknXmlToObjects,
        dm.returnResponse
    ]
};

dmAPIs["/documents/filter"] = {
    method: "post", 
    stack: [
        dm.authenticate,
        dm.receiveSubmitData,
        dm.loadFilterListing,
        dm.convertAknXmlToObjects,
        dm.returnResponse
    ]
};

/*
Dispatches a document to be published by placing it's
iri on a message queue (IRI_Q).
Input object submitted to the API:
"data": {
    "iri": "/akn/ke/act/legge/1970-06-03/Cap_44/eng@/!main"
}
 */
dmAPIs["/document/publish"] = {
    method: "post",
    stack: [
        dm.receiveSubmitData,
        dm.publishOnIriQ,
        dm.returnResponse
    ]
};

module.exports.dmAPIs = dmAPIs;