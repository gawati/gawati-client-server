const yup  = require("yup");
const moment = require("moment");
var Handlebars = require("handlebars/runtime");
const datehelper = require("../utils/DateHelper");
var hbtemplate = require('../xml_templates/judgment.js');

/**Yup custom validator */
yup.addMethod(yup.date, "format", function(formats, parseStrict) {
    let invalidDate = new Date("");
    return this.transform(function(value, originalValue){
        let date = moment(originalValue, formats, parseStrict);
        return date.isValid() ? date.toDate() : invalidDate;
    });
});

/**
 * This defines a JSON schema (using Yup)
 * The object that is applied onto the handlebars template to generate the XML
 * is based on this schema. This schema is used to validate the object. 
 */
const metaTmplSchema = yup.object().shape({        
    "docTestDate": yup.date().format("YYYY-MM-DD", true).required(),
    "docTestDesc": yup.string().required(),
    "docTestLang": yup.string().required()
});

/**
 * Template for metadata object
 */
const metaFormTemplate = {
    docTestDate: {value: undefined, error: null, type: 'date', label: 'Document Test Date' },
    docTestDesc: {value: "", error: null, type: 'string', label: 'Document Test Description'},
    docTestLang: {value: "" , error: null, type: 'string', label: 'Document Test Language' }
};

/**
 *  Accepts a form object submitted by the gawati-client
 *  Translates that into a metaTemplate object
 *  This object is subsequently validate against an object schema
 */
const toMetaTemplateObject = (custMeta) => {
    const {docTestDate, docTestDesc, docTestLang} = custMeta;
    // this metaTmpl object is applied on the handlebars schema to generate the XML 
    let metaTmpl = {};
    if (docTestDate)
        metaTmpl.docTestDate = datehelper.parseDateISODatePart(docTestDate.value);
    if (docTestDesc)
        metaTmpl.docTestDesc = docTestDesc.value;
    if (docTestLang)
        metaTmpl.docTestLang = docTestLang.value;
    return metaTmpl;
}

/**
 * Validates the metadata values submitted by the client.
 */
const validateMetaObject = (metaObject) => {
    const valid = metaTmplSchema.validate(metaObject);
    return valid;
};

/**
 * Takes a Meta Object and converts it to XML 
 * @param {object} metaTmpl object containing values to populate into 
 * meta handlebar template.
 */
const toMetaXML = (metaTmpl) => {
    const template = Handlebars.templates["judgment.hbs"];
    const metaXml = template(metaTmpl);
    return metaXml;
};

module.exports = {
  metaFormTemplate: metaFormTemplate,
  toMetaTemplateObject: toMetaTemplateObject,
  validateMetaObject: validateMetaObject,
  toMetaXML: toMetaXML
}