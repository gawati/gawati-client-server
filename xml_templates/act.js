var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['act.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<gw:gawatiMeta>\n  <gw:date refersTo=\"#docTestDate\" date=\""
    + alias4(((helper = (helper = helpers.docTestDate || (depth0 != null ? depth0.docTestDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docTestDate","hash":{},"data":data}) : helper)))
    + "\" />\n  <gw:docTestDesc>"
    + alias4(((helper = (helper = helpers.docTestDesc || (depth0 != null ? depth0.docTestDesc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docTestDesc","hash":{},"data":data}) : helper)))
    + "</gw:docTestDesc>\n  <gw:docTestLang>"
    + alias4(((helper = (helper = helpers.docTestLang || (depth0 != null ? depth0.docTestLang : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"docTestLang","hash":{},"data":data}) : helper)))
    + "</gw:docTestLang>\n</gw:gawatiMeta>";
},"useData":true});
