const yup  = require("yup");

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

const metaFormTemplate = {
    docTestDate: {value: undefined, error: null, type: 'date', label: 'Document Test Date' },
    docTestDesc: {value: "", error: null, type: 'string', label: 'Document Test Description'},
    docTestLang: {value: "" , error: null, type: 'string', label: 'Document Test Language' }
};

const validateMetaObject = (metaObject) => {
    const valid = metaTmplSchema.validate(metaObject);
    return valid;
};

module.exports = {
  metaFormTemplate: metaFormTemplate
}