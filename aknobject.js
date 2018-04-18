var Handlebars = require('handlebars/runtime');
const moment = require('moment');
const datehelper = require("./utils/datehelper");
const yup  = require('yup');
/** 
 * Generated templates
 * These are required only to be imported.
 **/
const tmplAkn = require('./xml_templates/akntemplate');
const tmplComponentRef = require('./xml_templates/akntemplate.componentRef');
const tmplEmbeddedContent = require('./xml_templates/akntemplate.embeddedContent');
/**Yup custom validator */
yup.addMethod(yup.date, 'format', function(formats, parseStrict) {
    let invalidDate = new Date('');
    return this.transform(function(value, originalValue){
      //console.log(" ov, form, parset ", value, originalValue, formats, parseStrict);
      let date = moment(originalValue, formats, parseStrict)

      return date.isValid() ? date.toDate() : invalidDate
    })
  });

const urihelper = require('./utils/urihelper');

/**
 * Takes an AKN Object and converts it to XML 
 * @param {object} aknTmpl object containing values to populate into akn handlebar template
 */
const aknTemplateToAknXML = (aknTmpl) => {
    return templateToAknXML(
        aknTmpl, 
        'akntemplate.hbs'
    ) ;
};

const aknTemplateToEmbeddedContentFragment = (aknTmpl) => {
    return templateToAknXML(
        aknTmpl, 
        'akntemplate.embeddedContent.hbs'
    );
};


const aknTemplateToComponentRef= (aknTmpl) => {
    return templateToAknXML(
        aknTmpl, 
        'akntemplate.componentRef.hbs'
    );
};


const templateToAknXML = (aknTmpl, tmplName) => {
    const template = Handlebars.templates[tmplName];
    const aknXml = template(aknTmpl);
    return aknXml;
};

const aknTmplSchema = yup.object().shape({
    "aknType": yup.string().required(),
    "localTypeNormalized":  yup.string().required(),
    "subType": yup.boolean().required(),
    "docNumber": yup.string().required(),
    "docNumberNormalized": yup.string().required(),        
    "docTitle": yup.string().required(),
    "publicationDate": yup.date().format('YYYY-MM-DD', true).required(),
    "docAuthoritative": yup.boolean().required(),      
    "docPrescriptive": yup.boolean().required(),
    "workIRIthis":  yup.string().required(),
    "workIRI":  yup.string().required(),
    "workDate" :  yup.string().required(),
    "workCountryCode":  yup.string().required(),
    "workCountryCodeShowAs":  yup.string().required(),
    "exprIRIthis": yup.string().required(),
    "exprIRI": yup.string().required(),
    "exprVersionDate": yup.string().required(),
    "exprLangCode": yup.string().required(),
    "manIRIthis": yup.string().required(),
    "manIRI": yup.string().required(),
    "manVersionDate": yup.string().required(),
    "createdDate":  yup.date().required(),
    "modifiedDate":  yup.date().required(),
    "components": yup.array().of(
        yup.object().shape({
            index: yup.number().required(), 
            type: yup.string().oneOf(['embedded', 'content']).required(),
            iriThis: yup.string().required(),
            showAs: yup.string().required(),
            fileType: yup.string().required(),
            fileName: yup.string().required(), 
            origFileName: yup.string().required()
        })
    )
});



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
    const {
        docAknType, 
        docType, 
        docNumber, 
        docTitle, 
        docOfficialDate, 
        docPublicationDate,
        docEntryIntoForceDate,
        docPart, 
        docIri, 
        docCountry, 
        docLang,
        docComponents
    } = form ;
    let aknTmpl = {} ;
    // official date is sent as a full serialized dateTime with timezone information
    // for AKN official date we need only the date part as an ISO date
    const aknDate = datehelper.parseDateISODatePart(docOfficialDate.value);
    const aknPublicationDate = datehelper.parseDateISODatePart(docPublicationDate.value);
    const aknEntryIntoForceDate = datehelper.parseDateISODatePart(docEntryIntoForceDate.value);
    console.log(" aknDate == ", aknDate);
    aknTmpl.aknType = docAknType.value ;
    aknTmpl.localTypeNormalized = docType.value; 
    aknTmpl.subType = aknTmpl.aknType.value === aknTmpl.localTypeNormalized ? false: true ; 
    aknTmpl.docNumber = docNumber.value ;  
    aknTmpl.docNumberNormalized = urihelper.normalizeDocNumber(docNumber.value);
    aknTmpl.docTitle = docTitle.value;
    aknTmpl.docAuthoritative = "true";
    aknTmpl.docPrescriptive = "true";
    aknTmpl.docPublicationDate = docOfficialDate.value;
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

    aknTmpl.createdDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    aknTmpl.modifiedDate = aknTmpl.createdDate ;
    aknTmpl.docComponents = docComponents.value;

    return aknTmpl;
};

const validateAknObject = (aknObject) => {
    const valid = aknTmplSchema.validate(aknObject);
    return valid;
};

/**
 * Returns an empty aknTemplate Object
 */

 /*
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
*/

module.exports.validateAknObject = validateAknObject ; 
module.exports.aknTemplateToAknXML = aknTemplateToAknXML ;
module.exports.aknTemplateToEmbeddedContentFragment = aknTemplateToEmbeddedContentFragment ; 
module.exports.aknTemplateToComponentRef = aknTemplateToComponentRef ; 
module.exports.templateToAknXML = templateToAknXML ; 
module.exports.formObject2AknTemplateObject = formObject2AknTemplateObject;