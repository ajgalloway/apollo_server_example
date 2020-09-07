const { ApolloServer } = require('apollo-server');
const MongoClient = require('mongodb').MongoClient;
const typeDef = require('./schema');
const schema = require('./schema');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis')


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
});


const resolvers ={
    Query: {
        books: async () => {
            let values = await db.collection('books').find().toArray();
            return values;
        },
        products: async() => {
            let values = await db.collection('products').find().toArray()
            return values;
        }
    },
    Mutation: {
        addBook: async (_, {title, author}) => {
            let book = await db.collection('books').insertOne({title, author});
            return book.ops[0];
        },
        deleteBook: async(_, {title, author}) => {
            let book = await db.collection('books').deleteOne({title: title, author: author});
            return {status: "successful"};
        },
        addProduct: async(_, params) => {
            let product = await db.collection('products').updateOne(
                //Filter
                {barcode: params.barcode, barcode_type:params.barcode_type},
                //Update,
                {$set: {
                    mpn: params.mpn,
                    model: params.model,
                    asin: params.asin,
                    product_name: params.product_name,
                    title: params.title,
                    category: params.category,
                    manufacturer: params.manufacturer,
                    brand: params.brand,
                    label: params.label,
                    author: params.author,
                    publisher: params.publisher,
                    artist: params.artist,
                    actor: params.actor,
                    director: params.actor,
                    director: params.director,
                    studio: params.studio,
                    genre: params.genre,
                    audience_rating: params.audience_rating,
                    ingredients: params.ingredients,
                    nutrition_facts: params.nutrition_facts,
                    color: params.color,
                    package_quantity: params.package_quantity,
                    size: params.size,
                    length: params.length,
                    width: params.width,
                    height: params.height,
                    weight: params.weight,
                    release_date: params.release_date,
                    description: params.description,
                    features: params.features,
                    images: params.images,
                    stores: params.stores
    
                }},
                //Params
                {
                    upsert: true
                }
            );

            let prod = await db.collection('products').findOne({barcode: params.barcode, barcode_type: params.barcode_type});
            return prod;
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
        },
        productAdded: {
            subscribe: () => pubsub.asyncIterator('PRODUCT_ADDED'),
        }
    }
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers
});

server.listen(3000).then(({ url }) => console.log(`Server running at ${ url } `));