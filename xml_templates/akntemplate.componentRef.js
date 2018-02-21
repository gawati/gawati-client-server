var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['akntemplate.componentRef.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=helpers.helperMissing, alias4="function";

  return "<an:componentRef src=\""
    + alias1(container.lambda((depth0 != null ? depth0.manIRIthis : depth0), depth0))
    + "\" alt=\""
    + alias1(((helper = (helper = helpers.embeddedOrigFileNameNormalized || (depth0 != null ? depth0.embeddedOrigFileNameNormalized : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"embeddedOrigFileNameNormalized","hash":{},"data":data}) : helper)))
    + "\" GUID=\"#embedded-doc-1\" showAs=\""
    + alias1(((helper = (helper = helpers.docTitle || (depth0 != null ? depth0.docTitle : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"docTitle","hash":{},"data":data}) : helper)))
    + "\"/>";
},"useData":true});
