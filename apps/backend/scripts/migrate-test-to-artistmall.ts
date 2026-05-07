import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Use the standard SRV URI
const MONGODB_URI = "MONGODB_URI=mongodb+srv://artistmall-nirala_2026:6kdi7AJQK2docMTd@artistmall.7agcfan.mongodb.net/artistmall?retryWrites=true&w=majority;

const SOURCE_DB_NAME = 'test';
const TARGET_DB_NAME = 'artistmall';

async function migrate() {
  try {
    console.log(`Starting migration from ${SOURCE_DB_NAME} to ${TARGET_DB_NAME}...`);

    // Connect to the cluster
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Cluster via SRV.');

    const sourceDb = mongoose.connection.useDb(SOURCE_DB_NAME).db!;
    const targetDb = mongoose.connection.useDb(TARGET_DB_NAME).db!;

    const collections = await sourceDb.listCollections().toArray();
    const collectionNames = collections
      .map(c => c.name)
      .filter(name => !['admin', 'local', 'config', 'system.views', 'system.users', 'system.version'].includes(name));

    console.log(`Found ${collectionNames.length} collections: ${collectionNames.join(', ')}`);

    for (const name of collectionNames) {
      console.log(`\nMigrating collection: ${name}...`);

      const documents = await sourceDb.collection(name).find({}).toArray();

      if (documents.length === 0) {
        console.log(`  - No documents. Skipping.`);
        continue;
      }

      console.log(`  - Migrating ${documents.length} docs.`);

      let insertedCount = 0;
      let skippedCount = 0;

      for (const doc of documents) {
        const exists = await targetDb.collection(name).findOne({ _id: doc._id });
        if (!exists) {
          await targetDb.collection(name).insertOne(doc);
          insertedCount++;
        } else {
          skippedCount++;
        }
      }

      const finalCount = await targetDb.collection(name).countDocuments();
      console.log(`  - ${name}: Inserted ${insertedCount}, Skipped ${skippedCount}. Total: ${finalCount}`);
    }

    console.log('\nMigration SUCCESSFUL.');
    await mongoose.disconnect();

  } catch (error) {
    console.error('Migration FAILED:', error);
    process.exit(1);
  }
}

migrate();
