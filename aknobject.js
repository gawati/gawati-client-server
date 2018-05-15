var Handlebars = require("handlebars/runtime");
const moment = require("moment");
const datehelper = require("./utils/DateHelper");
const generalhelper = require("./utils/GeneralHelper");
const yup  = require("yup");
/** 
 * Generated templates
 * These are required only to be imported.
 **/
const tmplAkn = require("./xml_templates/akntemplate");
const tmplComponentRef = require("./xml_templates/akntemplate.componentRef");
const tmplEmbeddedContent = require("./xml_templates/akntemplate.embeddedContent");
/**Yup custom validator */
yup.addMethod(yup.date, "format", function(formats, parseStrict) {
    let invalidDate = new Date("");
    return this.transform(function(value, originalValue){
        let date = moment(originalValue, formats, parseStrict);
        return date.isValid() ? date.toDate() : invalidDate;
    });
});

const urihelper = require("./utils/UriHelper");

/**
 * Takes an AKN Object and converts it to XML 
 * @param {object} aknTmpl object containing values to populate into akn handlebar template
 */
const aknTemplateToAknXML = (aknTmpl) => {
    return templateToAknXML(
        aknTmpl, 
        "akntemplate.hbs"
    ) ;
};

const aknTemplateToEmbeddedContentFragment = (aknTmpl) => {
    return templateToAknXML(
        aknTmpl, 
        "akntemplate.embeddedContent.hbs"
    );
};


const aknTemplateToComponentRef= (aknTmpl) => {
    return templateToAknXML(
        aknTmpl, 
        "akntemplate.componentRef.hbs"
    );
};


const templateToAknXML = (aknTmpl, tmplName) => {
    const template = Handlebars.templates[tmplName];
    const aknXml = template(aknTmpl);
    return aknXml;
};


/**
 * This defines a JSON schema (using Yup)
 * The object that is applied onto the handlebars template to generate the XML
 * is based on this schema. This schema is used to validate the object. 
 */
const aknTmplSchema = yup.object().shape({
    "aknType": yup.string().required(),
    "localTypeNormalized":  yup.string().required(),
    "subType": yup.boolean().required(),
    "docCreatedDate":  yup.date().required(),
    "docModifiedDate":  yup.date().required(),
    "docNumber": yup.string().required(),
    "docNumberNormalized": yup.string().required(),        
    "docTitle": yup.string().required(),
    "docOfficialDate": yup.date().format("YYYY-MM-DD", true).required(),
    "docPublicationDate": yup.date().format("YYYY-MM-DD", true).required(),
    "docEntryIntoForceDate": yup.date().format("YYYY-MM-DD", true).required(),
    "docVersionDate": yup.date().format("YYYY-MM-DD", true).required(),
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
    "permissions": yup.array().of(
        yup.object().shape({
            name: yup.string().required(),
            roles: yup.array().of(
                yup.string().required()
            )
        })
    ),
    "components": yup.array().of(
        yup.object().shape({
            index: yup.number().required(), 
            type: yup.string().oneOf(["embedded", "content"]).required(),
            iriThis: yup.string().required(),
            showAs: yup.string().required(),
            fileType: yup.string().required(),
            fileName: yup.string().required(), 
            origFileName: yup.string().required()
        })
    )
});

const identityFormTemplate = () => {
    return {
        docCreatedDate: {value: undefined, error: null },
        docModifiedDate: {value: undefined, error: null },
        docLang: {value: {} , error: null },
        docType: {value: "", error: null },
        docAknType: {value: "", error: null },
        docCountry: {value: "", error: null },
        docTitle: {value: "", error: null},
        docOfficialDate: {value: undefined, error: null },
        docPublicationDate: {value: undefined, error: null },
        docEntryIntoForceDate: {value: undefined, error: null },
        docVersionDate: {value: undefined, error: null },
        docNumber: {value: "", error: null },
        docPart: {value: "", error: null },
        docIri : {value: "", error: null }
    };
};

const attachmentsFormTemplate = () => {
    return {
        attachments : {value: "", error: null }
    };
};

/**
 *  Accepts a form object submitted by the gawati-client
 *  Translates that into an aknTemplate object
 *  This object is subsequently validate against an object schema
 *  
 * @param {*} form 
 */
const formObject2AknTemplateObject = (form) => {
    const {
        docCreatedDate,
        docModifiedDate,
        docAknType, 
        docType, 
        docNumber, 
        docTitle, 
        docOfficialDate, 
        docPublicationDate,
        docEntryIntoForceDate,
        docVersionDate,
        docPart, 
        docIri, 
        docCountry, 
        docLang
    } = form.pkgIdentity ;
    
    // this aknTmpl object is applied on the handlebars schema to generate the XML 
    let aknTmpl = {} ;
    aknTmpl.docCreatedDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
    aknTmpl.docModifiedDate = aknTmpl.docCreatedDate;
    // official date is sent as a full serialized dateTime with timezone information
    // for AKN official date we need only the date part as an ISO date
    const aknDate = datehelper.parseDateISODatePart(docOfficialDate.value);
    const aknPublicationDate = datehelper.parseDateISODatePart(docPublicationDate.value);
    const aknEntryIntoForceDate = datehelper.parseDateISODatePart(docEntryIntoForceDate.value);
    const aknVersionDate = datehelper.parseDateISODatePart(docVersionDate.value);
    
    aknTmpl.aknType = docAknType.value ;
    aknTmpl.localTypeNormalized = docType.value; 
    aknTmpl.subType = aknTmpl.aknType.value === aknTmpl.localTypeNormalized ? false: true ; 
    aknTmpl.docNumber = docNumber.value ;  
    aknTmpl.docNumberNormalized = urihelper.normalizeDocNumber(docNumber.value);
    aknTmpl.docTitle = docTitle.value;
    aknTmpl.docAuthoritative = "true";
    aknTmpl.docPrescriptive = "true";
    aknTmpl.docOfficialDate = aknDate;
    aknTmpl.docPublicationDate = aknPublicationDate;
    aknTmpl.docEntryIntoForceDate = aknEntryIntoForceDate;
    aknTmpl.docVersionDate = aknVersionDate; 
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
        aknVersionDate,
        aknDate
        // docPart.value
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

    aknTmpl.attachments = form.pkgAttachments.value;
    aknTmpl.permissions = formObject2AknPermissions(form.permissions);
    aknTmpl.workflow = {...form.workflow.state}; // @label @status
    console.log( " formObject2AknTemplateObject obj ", JSON.stringify(aknTmpl.permissions));
    return aknTmpl;
};
/**
 * 
 * 
 * @param {any} permissions 
 */
const formObject2AknPermissions = (permissions) => {
   /*
    <gwd:permissions>
        <gwd:permission name="view">
            <gwd:roles>
                <gwd:role name="client.Admin"/>
                <gwd:role name="client.Submitter"/>
            </gwd:roles>
        </gwd:permission>
        ....
    </gwd:permissions>
   */
    const listOfPermissions = permissions.permission;
    return listOfPermissions.map( (permission) => {
        const {name, roles} = permission;
        const arrRoles = generalhelper.stringWhitespaceTrim(roles).split(" ");
        return {
            "name": name,
            "roles": arrRoles
        };
    });
};

    

const validateAknObject = (aknObject) => {
    const valid = aknTmplSchema.validate(aknObject);
    return valid;
};


module.exports.validateAknObject = validateAknObject ; 
module.exports.aknTemplateToAknXML = aknTemplateToAknXML ;
module.exports.aknTemplateToEmbeddedContentFragment = aknTemplateToEmbeddedContentFragment ; 
module.exports.aknTemplateToComponentRef = aknTemplateToComponentRef ; 
module.exports.templateToAknXML = templateToAknXML ; 
module.exports.formObject2AknTemplateObject = formObject2AknTemplateObject;
module.exports.identityFormTemplate = identityFormTemplate;
module.exports.attachmentsFormTemplate = attachmentsFormTemplate;