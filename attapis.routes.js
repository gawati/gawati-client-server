const attapis = require("./attapis");

var attAPIs  = {};
const BASE_URI = "/attachments"

/* 
* Creates or Updates an attachment.
* Receive the form data containing the file info and the parent document info.
* Write the file info to the file system.
* Add/Update attachment to the attachments list.
* Save the new attachment list to the Database.
* Input form data submitted to the API:
*   index, file, fileName, title, fileType, iri, pkgAttachments, and
*   all pkgIdentity fields.
*/
attAPIs[`${BASE_URI}/upload`] = {
    method: "post", 
    stack: [
        attapis.receiveFilesSubmitData,
        attapis.writeSubmittedFiletoFS,
        attapis.addAttInfoToAknObject,
        attapis.saveAttToXmlDb,
        attapis.returnResponse
    ]
};

/*
* Removes an attachment.
* Receive the JSON containing the attachment info and the document info.
* Remove attachment from the FS
* Remove attachment from attachments list.
* Save the new attachment list to the Database.
Input json object submitted to the API:
{
    "data": {
        "emDoc": Attachment to be removed
        "pkg": {
          pkgIdentity,
          pkgAttachments
        }
    }
}
*/
attAPIs[`${BASE_URI}/remove`] = {
    method: "post",
    stack: [
        attapis.receiveAttSubmitData,
        attapis.removeAttFromFS,
        attapis.removeAttInfoFromAknObject,
        attapis.saveAttToXmlDb,
        attapis.returnResponse
    ]
};

/*
* Extracts text from an attachment.
* Receive the JSON containing the attachment info.
* Retrieves attachment from the FS
* Calls service to get extracted text.
* Save the extracted text file the Database.
Input json object submitted to the API:
{
    "data": {
        "emDoc": Attachment to be extracted
        "pkg": {
          pkgIdentity,
          pkgAttachments
        }
    }
}
*/
attAPIs[`${BASE_URI}/extract`] = {
    method: "post",
    stack: [
        attapis.receiveAttSubmitData,
        attapis.extractText,
        attapis.tagText,
        attapis.saveFTtoXmlDb,
        attapis.returnResponse
    ]
};

module.exports.attAPIs = attAPIs;