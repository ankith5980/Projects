// Quick script to make a user an admin
// Usage: node scripts/makeAdmin.js <email>

import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Member from '../src/models/Member.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email }).populate('member', 'firstName lastName');

    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log('✅ Successfully made admin:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.member?.firstName} ${user.member?.lastName}`);
    console.log(`   Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

makeAdmin(email);
