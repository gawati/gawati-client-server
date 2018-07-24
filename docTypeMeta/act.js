const yup  = require("yup");
const moment = require("moment");
var Handlebars = require("handlebars/runtime");
const datehelper = require("../utils/DateHelper");
var hbtemplate = require('../xml_templates/act.js');

/**Yup custom validator */
yup.addMethod(yup.date, "format", function(formats, parseStrict) {
    let invalidDate = new Date("");
    return this.transform(function(value, originalValue){
        let date = moment(originalValue, formats, parseStrict);
        return date.isValid() ? date.toDate() : invalidDate;
    });
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
 * Validation definition for all fields (using Yup) 
 */
const valDefn = {
    "docTestDate": yup.date().format("YYYY-MM-DD", true).required(),
    "docTestDesc": yup.string().required(),
    "docTestLang": yup.string().required()
}

/**
 * Validates the metadata values submitted by the client.
 */
const validateMetaObject = (metaObject, selected) => {
    //Create new schema for only fields that are selected
    let curFields = {};
    selected.forEach(key => {
        curFields[key] = valDefn[key];
    })
    const curSchema = yup.object().shape(curFields);
    const valid = curSchema.validate(metaObject);
    return valid;
};

/**
 * Takes a Meta Object and converts it to XML 
 * @param {object} metaTmpl object containing values to populate into 
 * meta handlebar template.
 */
const toMetaXML = (metaTmpl) => {
    const template = Handlebars.templates["act.hbs"];
    const metaXml = template(metaTmpl);
    return metaXml;
};

module.exports = {
  metaFormTemplate: metaFormTemplate,
  toMetaTemplateObject: toMetaTemplateObject,
  validateMetaObject: validateMetaObject,
  toMetaXML: toMetaXML
}