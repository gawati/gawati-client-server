var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['akntemplate.componentRef.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=helpers.helperMissing, alias4="function";

  return "<an:componentRef src=\""
    + alias1(container.lambda((depth0 != null ? depth0.embeddedIRIthis : depth0), depth0))
    + "\" alt=\""
    + alias1(((helper = (helper = helpers.embeddedFileName || (depth0 != null ? depth0.embeddedFileName : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"embeddedFileName","hash":{},"data":data}) : helper)))
    + "\" GUID=\"#embedded-doc-"
    + alias1(((helper = (helper = helpers.embeddedIndex || (depth0 != null ? depth0.embeddedIndex : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"embeddedIndex","hash":{},"data":data}) : helper)))
    + "\" showAs=\""
    + alias1(((helper = (helper = helpers.embeddedShowAs || (depth0 != null ? depth0.embeddedShowAs : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"embeddedShowAs","hash":{},"data":data}) : helper)))
    + "\"/>";
},"useData":true});
