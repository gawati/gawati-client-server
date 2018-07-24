var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['judgment.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <gw:docTestDate>"
    + container.escapeExpression(((helper = (helper = helpers.docTestDate || (depth0 != null ? depth0.docTestDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"docTestDate","hash":{},"data":data}) : helper)))
    + "</gw:docTestDate>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <gw:docTestDesc>"
    + container.escapeExpression(((helper = (helper = helpers.docTestDesc || (depth0 != null ? depth0.docTestDesc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"docTestDesc","hash":{},"data":data}) : helper)))
    + "</gw:docTestDesc>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <gw:docTestLang>"
    + container.escapeExpression(((helper = (helper = helpers.docTestLang || (depth0 != null ? depth0.docTestLang : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"docTestLang","hash":{},"data":data}) : helper)))
    + "</gw:docTestLang>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<gw:gawatiMeta xmlns:gw=\"http://gawati.org/ns/1.0\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.docTestDate : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.docTestDesc : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.docTestLang : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</gw:gawatiMeta>";
},"useData":true});
