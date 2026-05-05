import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { AdminModel } from '../modules/admin/models/admin.model';

// Load env from the backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function resetAdmin() {
  try {
    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        'MONGODB_URI/MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD must be set before running resetAdmin',
      );
    }

    console.log('--- ENTERPRISE ADMIN RESET SYSTEM v2 ---');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log(`Searching for existing admin: ${ADMIN_EMAIL}`);

    // Remove broken or legacy admin accounts
    await AdminModel.deleteMany({ email: ADMIN_EMAIL });
    console.log('Cleared existing admin accounts.');

    // Create fresh Super Admin
    const superAdmin = new AdminModel({
      fullName: 'Super Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'SUPER_ADMIN',
      isActive: true,
      mustChangePassword: false,
      permissions: ['*'],
    });

    await superAdmin.save();
    console.log('------------------------------------------');
    console.log('SUCCESS: SUPER_ADMIN PROVISIONED');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log('Status: ACTIVE');
    console.log('Role: SUPER_ADMIN');
    console.log('------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('CRITICAL FAILURE DURING ADMIN RESET:');
    console.error(error);
    process.exit(1);
  }
}

resetAdmin();
