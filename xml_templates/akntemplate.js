var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['akntemplate.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "    <gwd:workflow>\n        <gwd:state status=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.workflow : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" label=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.workflow : depth0)) != null ? stack1.label : stack1), depth0))
    + "\" />\n    </gwd:workflow>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "        <gwd:permission name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n            <gwd:roles>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.roles : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </gwd:roles>\n        </gwd:permission>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                <gwd:role name=\""
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "\" />\n";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <an:FRBRsubtype value=\""
    + container.escapeExpression(((helper = (helper = helpers.localTypeNormalized || (depth0 != null ? depth0.localTypeNormalized : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"localTypeNormalized","hash":{},"data":data}) : helper)))
    + "\"/>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <gw:embeddedContent eId=\"embedded-doc-"
    + alias4(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" \n                            type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" fileType=\""
    + alias4(((helper = (helper = helpers.fileType || (depth0 != null ? depth0.fileType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fileType","hash":{},"data":data}) : helper)))
    + "\" file=\""
    + alias4(((helper = (helper = helpers.fileName || (depth0 != null ? depth0.fileName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fileName","hash":{},"data":data}) : helper)))
    + "\" \n                            origFileName=\""
    + alias4(((helper = (helper = helpers.origFileName || (depth0 != null ? depth0.origFileName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"origFileName","hash":{},"data":data}) : helper)))
    + "\" state=\"true\"/>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <an:componentRef src=\""
    + alias4(((helper = (helper = helpers.iriThis || (depth0 != null ? depth0.iriThis : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iriThis","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = helpers.origFileName || (depth0 != null ? depth0.origFileName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"origFileName","hash":{},"data":data}) : helper)))
    + "\" GUID=\"#embedded-doc-"
    + alias4(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.showAs || (depth0 != null ? depth0.showAs : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"showAs","hash":{},"data":data}) : helper)))
    + "\"/>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<gwd:package xmlns:gwd=\"http://gawati.org/ns/1.0/data\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.workflow : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <gwd:permissions>\n        <!-- role based permissions -->\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.permissions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </gwd:permissions>\n<an:akomaNtoso \n    xmlns:gw=\"http://gawati.org/ns/1.0\" \n    xmlns:an=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\">\n    <an:"
    + alias4(((helper = (helper = helpers.aknType || (depth0 != null ? depth0.aknType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aknType","hash":{},"data":data}) : helper)))
    + " name=\""
    + alias4(((helper = (helper = helpers.localTypeNormalized || (depth0 != null ? depth0.localTypeNormalized : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"localTypeNormalized","hash":{},"data":data}) : helper)))
    + "\">\n        <an:meta>\n            <an:identification source=\"#gawati\">\n                <an:FRBRWork>\n                    <an:FRBRthis value=\""
    + alias4(alias5((depth0 != null ? depth0.workIRIthis : depth0), depth0))
    + "\"/>\n                    <an:FRBRuri value=\""
    + alias4(((helper = (helper = helpers.workIRI || (depth0 != null ? depth0.workIRI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workIRI","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRdate name=\"Work Date\" date=\""
    + alias4(((helper = (helper = helpers.workDate || (depth0 != null ? depth0.workDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workDate","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRauthor href=\"#author\"/>\n                    <an:FRBRcountry value=\""
    + alias4(((helper = (helper = helpers.workCountryCode || (depth0 != null ? depth0.workCountryCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workCountryCode","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.workCountryShowAs || (depth0 != null ? depth0.workCountryShowAs : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"workCountryShowAs","hash":{},"data":data}) : helper)))
    + "\"/>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subType : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    <an:FRBRnumber value=\""
    + alias4(((helper = (helper = helpers.docNumberNormalized || (depth0 != null ? depth0.docNumberNormalized : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumberNormalized","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.docNumber || (depth0 != null ? depth0.docNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumber","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRprescriptive value=\""
    + alias4(((helper = (helper = helpers.docPrescriptive || (depth0 != null ? depth0.docPrescriptive : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docPrescriptive","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRauthoritative value=\""
    + alias4(((helper = (helper = helpers.docAuthoritative || (depth0 != null ? depth0.docAuthoritative : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docAuthoritative","hash":{},"data":data}) : helper)))
    + "\"/>\n                </an:FRBRWork>\n                <an:FRBRExpression>\n                    <an:FRBRthis value=\""
    + alias4(alias5((depth0 != null ? depth0.exprIRIthis : depth0), depth0))
    + "\"/>\n                    <an:FRBRuri value=\""
    + alias4(((helper = (helper = helpers.exprIRI || (depth0 != null ? depth0.exprIRI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprIRI","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRdate name=\"Expression Date\" date=\""
    + alias4(((helper = (helper = helpers.exprVersionDate || (depth0 != null ? depth0.exprVersionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprVersionDate","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRauthor href=\"#author\"/>\n                    <an:FRBRlanguage language=\""
    + alias4(((helper = (helper = helpers.exprLangCode || (depth0 != null ? depth0.exprLangCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprLangCode","hash":{},"data":data}) : helper)))
    + "\" />\n                </an:FRBRExpression>\n                <an:FRBRManifestation>\n                    <an:FRBRthis value=\""
    + alias4(alias5((depth0 != null ? depth0.manIRIthis : depth0), depth0))
    + "\"/>\n                    <an:FRBRuri value=\""
    + alias4(((helper = (helper = helpers.manIRI || (depth0 != null ? depth0.manIRI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"manIRI","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRdate name=\"Manifestation Date\" date=\""
    + alias4(((helper = (helper = helpers.manVersionDate || (depth0 != null ? depth0.manVersionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"manVersionDate","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <an:FRBRauthor href=\"#author\"/>\n                    <an:FRBRformat value=\"xml\"/>\n                </an:FRBRManifestation>\n            </an:identification>\n            <an:publication date=\""
    + alias4(((helper = (helper = helpers.docPublicationDate || (depth0 != null ? depth0.docPublicationDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docPublicationDate","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.docTitle || (depth0 != null ? depth0.docTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docTitle","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.localTypeNormalized || (depth0 != null ? depth0.localTypeNormalized : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"localTypeNormalized","hash":{},"data":data}) : helper)))
    + "\" number=\""
    + alias4(((helper = (helper = helpers.docNumber || (depth0 != null ? depth0.docNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumber","hash":{},"data":data}) : helper)))
    + "\"/>\n            <an:classification source=\"#gawati\">\n            </an:classification>\n            <an:lifecycle source=\"#all\">\n                <an:eventRef date=\""
    + alias4(((helper = (helper = helpers.exprVersionDate || (depth0 != null ? depth0.exprVersionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprVersionDate","hash":{},"data":data}) : helper)))
    + "\" source=\"#original\" type=\"generation\"/>\n            </an:lifecycle>\n            <an:references source=\"#source\">\n                <an:original eId=\"original\" href=\""
    + alias4(alias5((depth0 != null ? depth0.exprIRIthis : depth0), depth0))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.docNumber || (depth0 != null ? depth0.docNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docNumber","hash":{},"data":data}) : helper)))
    + "\"/>\n                <an:TLCOrganization eId=\"all\" href=\"/ontology/Organization/AfricanLawLibrary\" showAs=\"African Law Library\"/>\n            </an:references>\n            <an:proprietary source=\"#all\">\n                <gw:gawati>\n                    <gw:docPart>"
    + alias4(((helper = (helper = helpers.docPart || (depth0 != null ? depth0.docPart : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docPart","hash":{},"data":data}) : helper)))
    + "</gw:docPart>\n                    <gw:languages>\n                        <gw:language code=\""
    + alias4(((helper = (helper = helpers.exprLangCode || (depth0 != null ? depth0.exprLangCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprLangCode","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias4(((helper = (helper = helpers.exprLangShowAs || (depth0 != null ? depth0.exprLangShowAs : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exprLangShowAs","hash":{},"data":data}) : helper)))
    + "\" />\n                    </gw:languages>\n                    <gw:embeddedContents>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.components : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </gw:embeddedContents>\n                    <gw:dateTime refersTo=\"#docCreatedDate\" datetime=\""
    + alias4(((helper = (helper = helpers.docCreatedDate || (depth0 != null ? depth0.docCreatedDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docCreatedDate","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <gw:dateTime refersTo=\"#docModifiedDate\" datetime=\""
    + alias4(((helper = (helper = helpers.docModifiedDate || (depth0 != null ? depth0.docModifiedDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docModifiedDate","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <gw:date refersTo=\"#docPublicationDate\" date=\""
    + alias4(((helper = (helper = helpers.docPublicationDate || (depth0 != null ? depth0.docPublicationDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docPublicationDate","hash":{},"data":data}) : helper)))
    + "\" />\n                    <gw:date refersTo=\"#docEntryIntoForceDate\" date=\""
    + alias4(((helper = (helper = helpers.docEntryIntoForceDate || (depth0 != null ? depth0.docEntryIntoForceDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docEntryIntoForceDate","hash":{},"data":data}) : helper)))
    + "\" />\n                    <gw:date refersTo=\"#docVersionDate\" date=\""
    + alias4(((helper = (helper = helpers.docVersionDate || (depth0 != null ? depth0.docVersionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docVersionDate","hash":{},"data":data}) : helper)))
    + "\" />\n                    <gw:themes source=\"#legacy\">\n                    </gw:themes>\n                </gw:gawati>\n                <gw:gawatiMeta xmlns:gw=\"http://gawati.org/ns/1.0\">\n                </gw:gawatiMeta>\n            </an:proprietary>\n            <an:tags></an:tags>\n        </an:meta>\n        <an:body>\n            <an:book refersTo=\"#mainDocument\">  \n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.components : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </an:book>\n        </an:body>\n    </an:"
    + alias4(((helper = (helper = helpers.aknType || (depth0 != null ? depth0.aknType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aknType","hash":{},"data":data}) : helper)))
    + ">\n</an:akomaNtoso>\n</gwd:package>";
},"useData":true});
