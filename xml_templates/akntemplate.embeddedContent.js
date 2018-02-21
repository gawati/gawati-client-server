var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['akntemplate.embeddedContent.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <gw:embeddedContent eId=\"embedded-doc-1\" type=\""
    + alias4(((helper = (helper = helpers.embeddedOrigFileType || (depth0 != null ? depth0.embeddedOrigFileType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"embeddedOrigFileType","hash":{},"data":data}) : helper)))
    + "\" file=\""
    + alias4(((helper = (helper = helpers.embeddedOrigFileName || (depth0 != null ? depth0.embeddedOrigFileName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"embeddedOrigFileName","hash":{},"data":data}) : helper)))
    + "\" state=\"true\"/>";
},"useData":true});
