var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['akntemplate.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <an:FRBRsubtype value=\""
    + container.escapeExpression(((helper = (helper = helpers.localTypeNormalized || (depth0 != null ? depth0.localTypeNormalized : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"localTypeNormalized","hash":{},"data":data}) : helper)))
    + "\"/>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<gwd:package xmlns:gwd=\"http://gawati.org/ns/1.0/data\" \r\n    created=\""
    + alias4(((helper = (helper = helpers.createdDate || (depth0 != null ? depth0.createdDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"createdDate","hash":{},"data":data}) : helper)))
    + "\"  \r\n    modified=\""
    + alias4(((helper = (helper = helpers.modifiedDate || (depth0 != null ? depth0.modifiedDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"modifiedDate","hash":{},"data":data}) : helper)))
    + "\"\r\n    >\r\n    <gwd:workflow>\r\n        <gwd:state status=\"draft\" label=\"Draft\" />\r\n    </gwd:workflow>\r\n    <gwd:permissions>\r\n        <!-- role based permissions -->\r\n        <gwd:read>\r\n            <gwd:role name=\"reader\" />\r\n        </gwd:read>\r\n        <gwd:edit>\r\n            <gwd:role name=\"editor\" />\r\n        </gwd:edit>\r\n        <gwd:delete>\r\n            <gwd:role name=\"deletor\" />\r\n        </gwd:delete>\r\n        <gwd:view>\r\n            <gwd:role name=\"viewer\" />\r\n        </gwd:view>\r\n        <!-- user specific permissions -->\r\n        <gwd:users>\r\n            <gwd:user name=\"xuser\">\r\n                <gwd:edit />\r\n            </gwd:user>\r\n        </gwd:users>\r\n    </gwd:permissions>\r\n<an:akomaNtoso \r\n    xmlns:gw=\"http://gawati.org/ns/1.0\" \r\n    xmlns:an=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\">\r\n    <an:"
    + alias4(((helper = (helper = helpers.aknType || (depth0 != null ? depth0.aknType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aknType","hash":{},"data":data}) : helper)))
    + " name=\""
    + alias4(((helper = (helper = helpers.localTypeNormalized || (depth0 != null ? depth0.localTypeNormalized : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"localTypeNormalized","hash":{},"data":data}) : helper)))
    + "\">\r\n        <an:meta>\r\n            <an:identification source=\"#gawati\">\r\n                <an:FRBRWork>\r\n                    <an:FRBRthis value=\""
    + alias4(alias5((depth0 != null ? depth0.workIRIthis : depth0), depth0))
    + "\"/>\r\n                    <an:FRBRuri value=\""
    + alias4(((helper = (helper = helpers.workIRI || (depth0 != null ? depth0.workIRI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workIRI","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRdate name=\"Work Date\" date=\""
    + alias4(((helper = (helper = helpers.workDate || (depth0 != null ? depth0.workDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workDate","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRauthor href=\"#author\"/>\r\n                    <an:FRBRcountry value=\""
    + alias4(((helper = (helper = helpers.workCountryCode || (depth0 != null ? depth0.workCountryCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workCountryCode","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.workCountryShowAs || (depth0 != null ? depth0.workCountryShowAs : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workCountryShowAs","hash":{},"data":data}) : helper)))
    + "\"/>\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subType : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    <an:FRBRnumber value=\""
    + alias4(((helper = (helper = helpers.docNumberNormalized || (depth0 != null ? depth0.docNumberNormalized : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumberNormalized","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.docNumber || (depth0 != null ? depth0.docNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumber","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRprescriptive value=\""
    + alias4(((helper = (helper = helpers.docPrescriptive || (depth0 != null ? depth0.docPrescriptive : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docPrescriptive","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRauthoritative value=\""
    + alias4(((helper = (helper = helpers.docAuthoritative || (depth0 != null ? depth0.docAuthoritative : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docAuthoritative","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                </an:FRBRWork>\r\n                <an:FRBRExpression>\r\n                    <an:FRBRthis value=\""
    + alias4(alias5((depth0 != null ? depth0.exprIRIthis : depth0), depth0))
    + "\"/>\r\n                    <an:FRBRuri value=\""
    + alias4(((helper = (helper = helpers.exprIRI || (depth0 != null ? depth0.exprIRI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprIRI","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRdate name=\"Expression Date\" date=\""
    + alias4(((helper = (helper = helpers.exprVersionDate || (depth0 != null ? depth0.exprVersionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprVersionDate","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRauthor href=\"#author\"/>\r\n                    <an:FRBRlanguage language=\""
    + alias4(((helper = (helper = helpers.exprLangCode || (depth0 != null ? depth0.exprLangCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprLangCode","hash":{},"data":data}) : helper)))
    + "\" />\r\n                </an:FRBRExpression>\r\n                <an:FRBRManifestation>\r\n                    <an:FRBRthis value=\""
    + alias4(alias5((depth0 != null ? depth0.manIRIthis : depth0), depth0))
    + "\"/>\r\n                    <an:FRBRuri value=\""
    + alias4(((helper = (helper = helpers.manIRI || (depth0 != null ? depth0.manIRI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"manIRI","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRdate name=\"Manifestation Date\" date=\""
    + alias4(((helper = (helper = helpers.manVersionDate || (depth0 != null ? depth0.manVersionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"manVersionDate","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <an:FRBRauthor href=\"#author\"/>\r\n                    <an:FRBRformat value=\"xml\"/>\r\n                </an:FRBRManifestation>\r\n            </an:identification>\r\n            <an:publication date=\""
    + alias4(((helper = (helper = helpers.publicationDate || (depth0 != null ? depth0.publicationDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"publicationDate","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.docTitle || (depth0 != null ? depth0.docTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docTitle","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.localTypeNormalized || (depth0 != null ? depth0.localTypeNormalized : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"localTypeNormalized","hash":{},"data":data}) : helper)))
    + "\" number=\""
    + alias4(((helper = (helper = helpers.docNumber || (depth0 != null ? depth0.docNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumber","hash":{},"data":data}) : helper)))
    + "\"/>\r\n            <an:classification source=\"#gawati\">\r\n            </an:classification>\r\n            <an:lifecycle source=\"#all\">\r\n                <an:eventRef date=\""
    + alias4(((helper = (helper = helpers.exprVersionDate || (depth0 != null ? depth0.exprVersionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprVersionDate","hash":{},"data":data}) : helper)))
    + "\" source=\"#original\" type=\"generation\"/>\r\n            </an:lifecycle>\r\n            <an:references source=\"#source\">\r\n                <an:original eId=\"original\" href=\""
    + alias4(alias5((depth0 != null ? depth0.exprIRIthis : depth0), depth0))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.docNumber || (depth0 != null ? depth0.docNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumber","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                <an:TLCOrganization eId=\"all\" href=\"/ontology/Organization/AfricanLawLibrary\" showAs=\"African Law Library\"/>\r\n            </an:references>\r\n            <an:proprietary source=\"#all\">\r\n                <gw:gawati>\r\n                    <gw:docPart>"
    + alias4(((helper = (helper = helpers.docPart || (depth0 != null ? depth0.docPart : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docPart","hash":{},"data":data}) : helper)))
    + "</gw:docPart>\r\n                    <gw:languages>\r\n                        <gw:language code=\""
    + alias4(((helper = (helper = helpers.exprLangCode || (depth0 != null ? depth0.exprLangCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprLangCode","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.exprLangShowAs || (depth0 != null ? depth0.exprLangShowAs : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprLangShowAs","hash":{},"data":data}) : helper)))
    + "\" />\r\n                    </gw:languages>\r\n                    <gw:embeddedContents>\r\n                        <gw:embeddedContent eId=\"embedded-doc-1\" type=\""
    + alias4(((helper = (helper = helpers.embeddedOrigFileType || (depth0 != null ? depth0.embeddedOrigFileType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"embeddedOrigFileType","hash":{},"data":data}) : helper)))
    + "\" file=\""
    + alias4(((helper = (helper = helpers.embeddedOrigFileName || (depth0 != null ? depth0.embeddedOrigFileName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"embeddedOrigFileName","hash":{},"data":data}) : helper)))
    + "\" state=\"true\"/>\r\n                    </gw:embeddedContents>\r\n                    <gw:dateTime refersTo=\"#dtCreated\" datetime=\""
    + alias4(((helper = (helper = helpers.createdDate || (depth0 != null ? depth0.createdDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"createdDate","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <gw:dateTime refersTo=\"#dtModified\" datetime=\""
    + alias4(((helper = (helper = helpers.modifiedDate || (depth0 != null ? depth0.modifiedDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"modifiedDate","hash":{},"data":data}) : helper)))
    + "\"/>\r\n                    <gw:themes source=\"#legacy\">\r\n                    </gw:themes>\r\n                </gw:gawati>\r\n            </an:proprietary>\r\n        </an:meta>\r\n        <an:body>\r\n            <an:book refersTo=\"#mainDocument\">\r\n                <an:componentRef src=\""
    + alias4(alias5((depth0 != null ? depth0.manIRIthis : depth0), depth0))
    + "\" alt=\""
    + alias4(((helper = (helper = helpers.embeddedOrigFileNameNormalized || (depth0 != null ? depth0.embeddedOrigFileNameNormalized : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"embeddedOrigFileNameNormalized","hash":{},"data":data}) : helper)))
    + "\" GUID=\"#embedded-doc-1\" showAs=\""
    + alias4(((helper = (helper = helpers.docTitle || (depth0 != null ? depth0.docTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docTitle","hash":{},"data":data}) : helper)))
    + "\"/>\r\n            </an:book>\r\n        </an:body>\r\n    </an:"
    + alias4(((helper = (helper = helpers.aknType || (depth0 != null ? depth0.aknType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aknType","hash":{},"data":data}) : helper)))
    + ">\r\n</an:akomaNtoso>\r\n</gwd:package>";
},"useData":true});
