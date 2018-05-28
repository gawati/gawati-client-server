const amqp = require('amqplib/callback_api');
const dpService = require("./updateStatus"); 

/**
 * Important: mqConfig channels get set in the async calls.
 */
let mqConfig = {
  "exchange" : "editor_doc_publish",
  "IRI_Q": {
    "key": "iriQ",
    "channel": {}
  },
  "STATUS_Q": {
    "key": "statusQ",
    "channel": {}
  }
}
 
function bail(err) {
  console.error(err);
  process.exit(1);
}

function getExchange() {
  return mqConfig.exchange;
}

function getChannel(qName) {
  return mqConfig[qName].channel;
}

function setChannel(qName, ch) {
  mqConfig[qName].channel = ch;
}

function getQKey(qName) {
  return mqConfig[qName].key;
}
 
// Publisher
function publisherIriQ(conn) {
  const qName = 'IRI_Q';
  const ex = getExchange();
  const key = getQKey(qName);

  conn.createChannel(onOpen);
  function onOpen(err, channel) {
    if (err != null) bail(err);
    setChannel(qName, channel);
    channel.assertExchange(ex, 'direct', {durable: false});
    console.log(" %s publisher channel opened", qName);

    //Test Message
    // let msg = 'Hello World!';
    // let msg = "/akn/ke/act/legge/1970-06-03/Cap_44/eng@/!main";
    // channel.publish(ex, key, new Buffer(msg));
    // console.log(" [x] Sent %s: '%s'", key, msg);
  }
}

/**
 * Put iri back in IRI_Q
 */
function reQueueIri(iri) {
  const qName = 'IRI_Q';
  const ex = getExchange();
  const key = getQKey(qName);
  getChannel(qName).publish(ex, key, new Buffer(iri));
}

/**
 * Transit document only if status is published.
 * The other statuses on this Q will be for interim progress info only.
 * If failed, requeue the iri.
 */
function handleStatus(statusObj) {
  const {iri, status, message} = statusObj;
  console.log(message);
  if (status === 'published') {
    dpService.updateStatus(statusObj);
  } else if (status === 'failed') {
    //Requeue: Publish on IRI_Q
    console.log(" Requeue ", iri);
    setTimeout(() => reQueueIri(iri), 5000);
  }
}
 
// Consumer
function consumerStatusQ(conn) {
  const qName = 'STATUS_Q';  //Will be changed to STATUS_Q
  const ex = getExchange();
  const key = getQKey(qName);

  conn.createChannel(onOpen);
  function onOpen(err, channel) {
    if (err != null) bail(err);
    channel.assertExchange(ex, 'direct', {durable: false});
    channel.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" %s consumer channel opened", qName);
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
      channel.bindQueue(q.queue, ex, key);
      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
        console.log(" Received Status Object: ", JSON.parse(msg.content.toString()));
        const statusObj = JSON.parse(msg.content.toString());
        handleStatus(statusObj);
      }, {noAck: true});

      //For standalone testing only
      // publisherIriQ(conn);
    });
  }
}
 
const rabbit = amqp.connect('amqp://localhost', function(err, conn) {
  console.log(" AMQP CONNECTED");
  if (err != null) bail(err);
  consumerStatusQ(conn);
  publisherIriQ(conn);
});

module.exports = {
    rabbit: rabbit,
    getExchange: getExchange,
    getChannel: getChannel,
    getQKey: getQKey
};
