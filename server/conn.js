const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://127.0.0.1:27017"; // Or your MongoDB Atlas URI

// Database Name
const dbName = "myProject";

// Create a new MongoClient
const client = new MongoClient(uri);

async function main() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // You can now use the db object to interact with collections
    // const collection = db.collection('documents');
  } catch (e) {
    console.error(e);
  }
}

main().finally(() => client.close()); // Close the connection when done
