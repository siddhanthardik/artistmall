import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGODB_URI must be set before starting the backend');
    }

    const configuredWriteConcern = process.env.MONGODB_WRITE_CONCERN?.trim();
    const writeConcern = configuredWriteConcern || '1';
    const writeConcernValue = /^\d+$/.test(writeConcern) ? Number(writeConcern) : writeConcern;

    const conn = await mongoose.connect(mongoUri, {
      writeConcern: { w: writeConcernValue as any },
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Write Concern: w=${writeConcern}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
