const qh = require("./QueueHelper");

/**
 * This module can be placed anywhere but is always referenced relative to the working directory of the caller.
 * API has the following signature - first parameter is always the full 
 * workflow object, second parameter is an object which can be set by the caller.
 * Return value type is not enforced
 */


function doPublish(wf, params) {
  console.log(" IN: Workflow Action 'doPublish'");
  const qObj = {
    'iri': params['iri'],
    'action': 'publish'
  }
  return qh.publishOnIriQ(JSON.stringify(qObj));
}

module.exports = {
  doPublish: doPublish
};