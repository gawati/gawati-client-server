var Handlebars = require('handlebars/runtime');
const akntmpl = require('./xml_templates/akntemplate');
const urihelper = require('./utils/urihelper');
const moment = require('moment');

const aknTemplateToAknXML = (aknTmpl) => {
    const template = Handlebars.templates['akntemplate.hbs'];
    const aknXml = template(aknTmpl);
    return aknXml;
}

/*
    Populates an aknTemplate object
        {
          docLang: {value: {} , error: null },
          docType: {value: '', error: null },
          docAknType: {value: '', error: null },
          docCountry: {value: '', error: null },
          docTitle: {value: '', error: null},
          docOfficialDate: {value: '', error: null },
          docNumber: {value: '', error: null },
          docPart: {value: 'main', error: null },
          docIri : {value: '', error: null }
        }
*/
const formObject2AknTemplateObject = (form) => {
    const {docAknType, docType, docNumber, docTitle, docOfficialDate, docPart, docIri, docCountry, docLang} = form ;
    let aknTmpl = aknTemplateObject();
    const aknDate = moment(docOfficialDate.value, "YYYY-MM-DD").format("YYYY-MM-DD");
    aknTmpl.aknType = docAknType.value ;
    aknTmpl.localTypeNormalized = docType.value; 
    aknTmpl.subType = aknTmpl.aknType.value === aknTmpl.localTypeNormalized ? false: true ; 
    aknTmpl.docNumber = docNumber.value ;  
    aknTmpl.docNumberNormalized = urihelper.normalizeDocNumber(docNumber.value);
    aknTmpl.docTitle = docTitle.value;
    aknTmpl.docAuthoritative = "true";
    aknTmpl.docPrescriptive = "true";
    aknTmpl.publicationDate = docOfficialDate.value;
    aknTmpl.docPart = docPart.value;

    aknTmpl.workIRI = urihelper.aknWorkIri(
        docCountry.value, 
        aknTmpl.aknType, 
        aknTmpl.localTypeNormalized, 
        aknDate, 
        aknTmpl.docNumberNormalized
    );
    aknTmpl.workIRIthis = urihelper.aknWorkIriThis(
        aknTmpl.workIRI, 
        docPart.value
    );
    aknTmpl.workCountryCode = docCountry.value ; 
    aknTmpl.workCountryCodeShowAs = docCountry.value ;
    aknTmpl.workDate = aknDate;

    aknTmpl.exprIRI = urihelper.aknExprIri(
        aknTmpl.workIRI, 
        docLang.value.value, 
        docPart.value
    );
    aknTmpl.exprIRIthis = urihelper.aknExprIriThis(
        aknTmpl.exprIRI, 
        docPart.value
    );
    aknTmpl.exprLangCode = docLang.value.value ; 
    aknTmpl.exprLangShowAs = docLang.value.label ;
    aknTmpl.exprVersionDate = aknDate ; 
    
    aknTmpl.manIRI = urihelper.aknManIri(aknTmpl.exprIRI);
    aknTmpl.manIRIthis = urihelper.aknManIriThis(aknTmpl.exprIRIthis);
    aknTmpl.manVersionDate = aknDate;

    aknTmpl.createdDate = moment().format('YYYY-MM-DDTHH:MM:SSZ');
    aknTmpl.modifiedDate = aknTmpl.createdDate ;
    return aknTmpl;
};

/**
 * Returns an empty aknTemplate Object
 */
const aknTemplateObject = () => {
    return {
        "aknType": "",
        "localTypeNormalized": "",
        "subType": false,
        "docNumber": "",
        "docNumberNormalized": "",        
        "docTitle": "",
        "publicationDate": "",
        "docAuthoritative": "",      
        "docPrescriptive": "",
        "publicationDate": "",
        
        "workIRIthis": "",
        "workIRI": "",
        "workDate" : "",
        "workCountryCode": "",
        "workCountryCodeShowAs": "",

        "exprIRIthis": "",
        "exprIRI": "",
        "exprVersionDate": "",
        "exprLangCode": "",

        "manIRIthis": "",
        "manIRI": "",
        "manVersionDate": "",



        "createdDate": "",
        "modifiedDate": "",

        "components": [
            {
                "type":"embedded",
                "origFileType": "",
                "origFileName": "",
                "origFileNameNormalized": ""
            }
        ]
    };    
};

module.exports.aknTemplateObject = aknTemplateObject;
module.exports.aknTemplateToAknXML = aknTemplateToAknXML;
module.exports.formObject2AknTemplateObject = formObject2AknTemplateObject;