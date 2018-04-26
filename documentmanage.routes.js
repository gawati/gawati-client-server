const dm = require("./documentmanage");

var documentManageAPIs  = {};



documentManageAPIs["/document/add"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.convertFormObjectToAknObject,
        dm.convertAknObjectToXml,
        dm.saveToXmlDb,
        dm.returnResponse
    ]
};

documentManageAPIs["/document/edit"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.updateAknField,
        //convertXmltoJsonObject,
        dm.returnResponse
    ]
};

documentManageAPIs["/document/load"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.loadXmlForIri,
        dm.convertAknXmlToObject,
        dm.returnResponse
    ]
};

documentManageAPIs["/documents"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.loadListing,
        dm.convertAknXmlToObjects,
        dm.returnResponse
    ]
};

/* 
* Receive the JSON containing the file info and the document info. 
* Write the file info to the file system
* Add the file info to the XML document in the XML Database
*/
documentManageAPIs["/document/upload"] = {
    method: "post", 
    stack: [
        dm.receiveFilesSubmitData,
        dm.convertFormObjectToAknObject,
        dm.writeSubmittedFiletoFS,
        dm.addAttInfoToAknObject,
        dm.convertAknObjectToXml,
        dm.saveToXmlDb,
        dm.returnResponse
    ]
};

documentManageAPIs["/document/remove"] = {
    method: "post", 
    stack: [
        dm.receiveAttSubmitData,
        dm.convertFormObjectToAknObject,
        dm.removeAttFromFS,
        dm.removeAttInfoFromAknObject,
        dm.convertAknObjectToXml,
        dm.saveToXmlDb,
        dm.returnResponse
    ]
};


module.exports.documentManageAPIs = documentManageAPIs;