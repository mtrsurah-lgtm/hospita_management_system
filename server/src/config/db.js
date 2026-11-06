const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_management';
  const forceInMemory = process.env.USE_IN_MEMORY_DB === 'true';

  if (forceInMemory) {
    await connectInMemory();
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to external Mongo URI (${uri}). Falling back to In-Memory MongoDB...`);
    await connectInMemory();
  }
};

const connectInMemory = async () => {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB In-Memory] Connected to volatile in-memory DB: ${conn.connection.host}`);
  } catch (memErr) {
    console.error('[MongoDB Error] In-Memory Mongo launch failed:', memErr.message);
    throw memErr;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[MongoDB] Connection closed.');
  } catch (err) {
    console.error('[MongoDB] Error disconnecting:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };

