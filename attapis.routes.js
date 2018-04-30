const attapis = require("./attapis");

var attAPIs  = {};
const BASE_URI = "/attachments"

/*
Creates or Updates an attachment.
Input form data submitted to the API:
  data: 
    - index
    - file
    - fileName
    - title
    - fileType
    - iri
    - All the fields of pkgIdentity
    - pkgAttachments
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
Removes an attachment from the filesystem and the xml on exist-db.
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


module.exports.attAPIs = attAPIs;