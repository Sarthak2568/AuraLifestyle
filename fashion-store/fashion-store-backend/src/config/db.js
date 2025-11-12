// src/config/db.js
import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing in .env');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true, // dev: true; change to false in prod and build indexes manually
    dbName: process.env.MONGO_DB_NAME || 'auralifestyle',
  });

  const dbName = mongoose.connection?.name || '(unknown)';
  console.log(`✅ MongoDB connected: ${dbName}`);
}
