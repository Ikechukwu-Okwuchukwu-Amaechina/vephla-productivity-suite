const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

let mongoClient;

const connectDB = async (uri) => {
  if (!uri) throw new Error('MONGO_URI not provided');


  await mongoose.connect(uri);

  // Create a MongoClient using the Stable API
  mongoClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  // Connect the client and verify with a ping
  await mongoClient.connect();
  await mongoClient.db('admin').command({ ping: 1 });
  console.log('Pinged your deployment. MongoClient connected to MongoDB!');

  return { mongoose, client: mongoClient };
};

const getMongoClient = () => mongoClient;

module.exports = connectDB;
module.exports.getMongoClient = getMongoClient;
