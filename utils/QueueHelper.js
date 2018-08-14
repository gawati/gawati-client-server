/**
 * Publish on IRI_Q
 */
const publishOnIriQ = (msg) => {
  const mq = require("../docPublishServices/queues");
  const qName = 'IRI_Q';
  const ex = mq.getExchange();
  const key = mq.getQKey(qName);
  const res = mq.getChannel(qName).publish(ex, key, new Buffer(msg), {persistent: true});
  return res;
}

module.exports = {
  publishOnIriQ: publishOnIriQ
}