/**
 * {VERSION: 1.0}
 */
/**
 * This module is shared with React & node js - so we don't use export const syntax
 * which is an es6 construct not supported on node yet. Instead we use the more 
 * verbose module.exports mechanism
 */


/**
 * Generates a normalized file name from a FRBRExpression/FRBRthis/@value iri
 */
const fileNameFromIRI = (iri, fileType) => {
    let iriArr = iri.split("/");
    iriArr.shift();
    let filePrefix = iriArr.map(
        (item) => {
            if (item.indexOf("@") !== -1) {
                if (item.endsWith("@")) {
                    return item.replace("@", "");
                } else {
                    return item.replace("@", "_");
                } 
            } else {
                return item.replace("!", "");
            }
        }
    ).join("_");
    return `${filePrefix}.${fileType}`;
};

const unknownIriComponent = () => {
    return "[unknown]";
};

const workIriNoSubType = (docCountry, docType, docOfficialDate, docNumberNormalized) => {
    return `/akn/${docCountry}/${docType}/${docOfficialDate}/${docNumberNormalized}` ;
};


const workIriWithSubType = (docCountry, docType, docSubType, docOfficialDate, docNumberNormalized) => {
    return  `/akn/${docCountry}/${docType}/${docSubType}/${docOfficialDate}/${docNumberNormalized}` ;
};


const aknWorkIri = (docCountry, docType, docSubType, docOfficialDate, docNumberNormalized) => {
    if (docType === docSubType) {
        return workIriNoSubType(docCountry, docType, docOfficialDate, docNumberNormalized) ; 
    } else {
        return workIriWithSubType(docCountry, docType, docSubType, docOfficialDate, docNumberNormalized);
    }
};

const aknWorkIriThis = (workIri, docPart) => {
    return `${workIri}/!${docPart}`;
}
;

const aknExprIri = (workIri, docLang) => {
    return `${workIri}/${docLang}@`;
}
;

const aknExprIriThis = (exprIri, docPart) => {
    return `${exprIri}/!${docPart}`;
}
;

const aknManIriThis = (exprIri, docPart) => {
    return `${exprIri}/!${docPart}.xml` ;
};

const aknManIri = (exprIri) => {
    return `${exprIri}.akn` ;
};

const normalizeDocNumber = (docNumber) => {
    return docNumber
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[.;,?]/g, '')
        .replace(/[\\/]/g, '-')
        .replace(/[+!@#$%^&*()]/g, '') ;
};


module.exports = {
    unknownIriComponent: unknownIriComponent,
    aknManIri: aknManIri,
    aknManIriThis: aknManIriThis,
    aknExprIri: aknExprIri,
    aknExprIriThis: aknExprIriThis,
    aknWorkIri: aknWorkIri,
    aknWorkIriThis: aknWorkIriThis,
    fileNameFromIRI: fileNameFromIRI,
    normalizeDocNumber: normalizeDocNumber
};