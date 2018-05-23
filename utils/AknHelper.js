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

/**
 * Get both date and dateTime elements
 */
const getGawatiNamedDate = (aknDoc, dateName) => {
    const gawatiDates = generalhelper.coerceIntoArray(aknDoc.meta.proprietary.gawati.date);
    const gawatiDateTimes = generalhelper.coerceIntoArray(aknDoc.meta.proprietary.gawati.dateTime);

    const allDates = gawatiDates.concat(gawatiDateTimes);
    const foundDate = allDates.find(
        (theDate) => theDate.refersTo === `#${dateName}`
    );
    if (foundDate) {
        return foundDate.date || foundDate.datetime;
    } else {
        return undefined;
    }
};


module.exports = {
    getAknRootDocType: getAknRootDocType,
    getGawatiNamedDate: getGawatiNamedDate
};