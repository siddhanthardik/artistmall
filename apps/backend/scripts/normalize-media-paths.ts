import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Use standard SRV URI for stability in script
const MONGODB_URI = "mongodb+srv://artistmall-nirala_2026:6kdi7AJQK2docMTd@artistmall.7agcfan.mongodb.net/artistmall?retryWrites=true&w=majority&appName=artistmallindia";

const DOMAIN_TO_STRIP = /https?:\/\/theartistmall\.com/g;

async function normalize() {
  try {
    console.log(`Starting media path normalization on 'artistmall' database...`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB via SRV.');

    const db = mongoose.connection.db!;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections
      .map(c => c.name)
      .filter(name => !['admin', 'local', 'config', 'system.views', 'system.users', 'system.version'].includes(name));

    let totalUpdated = 0;

    for (const name of collectionNames) {
      console.log(`\nAuditing collection: ${name}...`);
      
      const documents = await db.collection(name).find({}).toArray();
      
      for (const doc of documents) {
        let isModified = false;
        const updatedDoc = JSON.parse(JSON.stringify(doc)); // Deep clone

        const normalizeValues = (obj: any) => {
          for (const key in obj) {
            if (typeof obj[key] === 'string') {
              if (DOMAIN_TO_STRIP.test(obj[key])) {
                const oldValue = obj[key];
                obj[key] = oldValue.replace(DOMAIN_TO_STRIP, '');
                if (oldValue !== obj[key]) {
                  console.log(`  - [${name}] Normalized field '${key}': ${oldValue} -> ${obj[key]}`);
                  isModified = true;
                }
              }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              normalizeValues(obj[key]);
            }
          }
        };

        normalizeValues(updatedDoc);

        if (isModified) {
          const { _id, ...updateFields } = updatedDoc;
          await db.collection(name).updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $set: updateFields });
          totalUpdated++;
        }
      }
    }

    console.log(`\n--- Normalization Summary ---`);
    console.log(`Status: SUCCESS`);
    console.log(`Total Documents Updated: ${totalUpdated}`);
    
    await mongoose.disconnect();

  } catch (error) {
    console.error('Normalization failed:', error);
    process.exit(1);
  }
}

normalize();
