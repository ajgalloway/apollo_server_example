const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis')
const MongoClient = require('mongodb').MongoClient;


const options = {
    host: "localhost",
    port: 6379,
    retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
    }
  };
  const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options)
  });

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(function(err) {
    console.log("MONGOdb connected");
    db = client.db("test"); // mongodb database name
    const booksCollection = db.collection('books');
    const booksStream = booksCollection.watch();
    booksStream.on('change', async next => {
        // process next document
        console.log('next', next);
        if (next.operationType == 'insert') {
            pubsub.publish('BOOK_ADDED', {bookAdded: next.fullDocument});
        }
    });
    const productsCollection = db.collection('products');
    const productsStream = productsCollection.watch();
    productsStream.on('change', async next => {
        // process next document
        if (next.operationType == 'insert') {
            pubsub.publish('PRODUCT_ADDED', {productAdded: next.fullDocument});
        }
        else if (next.operationType == 'update') {
            let p = productsCollection.findOne({_id: next.documentKey._id});
            pubsub.publish('PRODUCT_UPDATED', {productAdded: p});
        }
    })
});
