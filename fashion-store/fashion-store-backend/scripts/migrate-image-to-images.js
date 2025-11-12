// fashion-store-backend/scripts/migrate-image-to-images.js
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName: process.env.MONGO_DB_NAME || 'auralifestyle' });
  console.log('Connected to DB');

  const cursor = Product.find({ $and: [{ images: { $size: 0 } }, { image: { $exists: true, $ne: '' } }] }).cursor();

  let count = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    try {
      const img = doc.image;
      if (img && (!Array.isArray(doc.images) || doc.images.length === 0)) {
        doc.images = [img];
        await doc.save();
        count++;
        console.log(`Migrated ${doc.sku}`);
      }
    } catch (e) {
      console.error('Failed migrate', doc?.sku, e);
    }
  }

  console.log('Done. Migrated count:', count);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
