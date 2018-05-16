const amqp = require('amqplib/callback_api');

const exchange = 'doc_publish';
const iriQKey = 'iri_q';
const statusQKey = 'status_q';
 
function bail(err) {
  console.error(err);
  process.exit(1);
}
 
// Publisher
function publisherIriQ(conn) {
  conn.createChannel(onOpen);
  function onOpen(err, channel) {
    if (err != null) bail(err);

    let msg = 'Hello World!';
    channel.assertExchange(exchange, 'direct', {durable: false});
    channel.publish(exchange, iriQKey, new Buffer(msg));
    console.log(" [x] Sent %s: '%s'", iriQKey, msg);
  }
}
 
// Consumer
function consumerStatusQ(conn) {
  var ok = conn.createChannel(onOpen);
  function onOpen(err, channel) {
    if (err != null) bail(err);
    channel.assertExchange(exchange, 'direct', {durable: false});    
    channel.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
      channel.bindQueue(q.queue, exchange, iriQKey);
      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});

      //For testing only
      publisherIriQ(conn);
      
    });
  }
}
 
const rabbit = amqp.connect('amqp://localhost', function(err, conn) {
  console.log(" AMQP CONNECTED");
  if (err != null) bail(err);
  consumerStatusQ(conn);
  // publisherIriQ(conn);
});

module.exports = rabbit; 