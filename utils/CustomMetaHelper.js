const path = require("path");
const lodash = require("lodash");
const aknhelper = require("../utils/AknHelper");

/**
 * Returns all available custom metadata for the doc type. 
 * This returns the template with default values.
 */
const getCustMetaTmpl = (aknType) => {
    const fname = path.resolve(path.join('docTypeMeta', (aknType + '.js')));
    try {
        const metaMgr = require(fname);
        return metaMgr.metaFormTemplate;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

/**
 * Returns all available custom metadata fields and selected custom metadata
 * fields for a document.
 * @param {*} docAknType 
 * @param {*} gawatiMeta Custom metadata present in the document
 */
const getCustomMetadata = (docAknType, aknDoc) => {
  const aknTypeValue = aknhelper.getAknRootDocType(aknDoc);
  const xmlDoc = aknDoc[aknTypeValue];
  const customMetaAll = getCustMetaTmpl(docAknType);
  const gawatiMeta = xmlDoc.meta.proprietary.gawatiMeta;
  if (gawatiMeta) {
    Object.keys(gawatiMeta).forEach(field => {
        if (field in customMetaAll)
            customMetaAll[field].value = gawatiMeta[field];
    });
    const selectedCustomMeta = lodash.filter(Object.keys(gawatiMeta), (key) => {
        return key in customMetaAll;
    });
    return {customMetaAll, selectedCustomMeta}
  } else {
    return {customMetaAll: customMetaAll, selectedCustomMeta: []}
  }
}

module.exports = {
  getCustomMetadata: getCustomMetadata
}