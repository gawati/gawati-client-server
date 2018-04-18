const appconstants = require("../constants");
const generalhelper = require("../utils/GeneralHelper");

const getAknRootDocType = (aknDoc)  => {
    for (var i=0 ; i < appconstants.AKN_DOC_TYPES.length; i++ ) {
        if (aknDoc.hasOwnProperty(appconstants.AKN_DOC_TYPES[i])) {
            return appconstants.AKN_DOC_TYPES[i];
        }
    }
    logr.error(
        generalhelper.serverMsg("AKOMA NTOSO DOC TYPE could not be determined, falling back to doc as the doc type ")
    );
    return "doc";
};

module.exports = {
    getAknRootDocType: getAknRootDocType
};