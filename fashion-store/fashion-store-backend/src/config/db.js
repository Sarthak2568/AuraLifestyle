import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing in env');
  const dbName = process.env.MONGO_DB_NAME || 'auralifestyle';

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName });
  console.log('✅ MongoDB connected:', mongoose.connection.name);
}
