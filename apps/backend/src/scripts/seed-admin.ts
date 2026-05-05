import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { AdminModel } from '../modules/admin/models/admin.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedSuperAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!mongoUri || !email || !password) {
      throw new Error(
        'MONGODB_URI/MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in the environment',
      );
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if exists
    const existing = await AdminModel.findOne({ email }).select('+password');
    if (existing) {
      console.log('Super Admin already exists. Re-provisioning with new password...');
      existing.password = password;
      existing.role = 'SUPER_ADMIN';
      existing.isActive = true;
      existing.mustChangePassword = false;
      existing.isSuperAdmin = true;
      await existing.save();
    } else {
      console.log('Creating new Super Admin...');
      await AdminModel.create({
        fullName: 'Super Admin',
        email,
        password,
        role: 'SUPER_ADMIN',
        isActive: true,
        mustChangePassword: false,
        isSuperAdmin: true,
      });
    }

    console.log('-----------------------------------');
    console.log('Super Admin Seeded Successfully');
    console.log(`Email: ${email}`);
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
