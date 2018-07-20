const pkgapis = require("./pkgapis");

var pkgAPIs  = {};
const BASE_URI = "/pkg"

/**
Sends a package of metadata xml, public key (if present) and its attachments for the given iri
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
        pkgapis.loadPkgForIri,
        pkgapis.prepareAndSendPkg
    ]
};

/**
Saves a package of signed metadata xml and public key for iri
Input json object submitted to the API:
{
    "data": {
        "iri": "/akn/ke/act/legge/2018-07-06/Test_tags_2/eng@/!main",
        "file": metadata xml,
        "public_key: public key
    }
}
*/
pkgAPIs[`${BASE_URI}/upload`] = {
    method: "post",
    stack: [
        pkgapis.receiveFilesSubmitData,
        pkgapis.prepToSavePkg,
        pkgapis.savePkgForIri,
        pkgapis.returnResponse
    ]
};

module.exports.pkgAPIs = pkgAPIs;