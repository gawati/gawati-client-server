const pkgapis = require("./pkgapis");
const dm = require("./documentmanage.js");

var pkgAPIs  = {};
const BASE_URI = "/pkg"

/**
Sends a package of metadata xml and its attachments for the given iri
Input json object submitted to the API:
{
    "data": {
        "iri": "/akn/ke/act/legge/2018-07-06/Test_tags_2/eng@/!main"
    }
}
*/
pkgAPIs[`${BASE_URI}/load`] = {
    method: "post",
    stack: [
        pkgapis.receiveSubmitData,
        dm.loadXmlForIri,
        pkgapis.prepareAndSendPkg,
        pkgapis.returnResponse
    ]
};

module.exports.pkgAPIs = pkgAPIs;