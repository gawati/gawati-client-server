/**
 * Publish on IRI_Q
 */
const publishOnIriQ = (iri) => {
   const mq = require("../docPublishServices/queues");
   const qName = 'IRI_Q';
   const ex = mq.getExchange();
   const key = mq.getQKey(qName);
   mq.getChannel(qName).publish(ex, key, new Buffer(iri), {persistent: true});
}

module.exports = {
  publishOnIriQ: publishOnIriQ
}