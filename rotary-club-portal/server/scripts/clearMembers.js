import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import Member from '../src/models/Member.js';
import User from '../src/models/User.js';
import Payment from '../src/models/Payment.js';
import Notification from '../src/models/Notification.js';

const clearAllMembers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get counts before deletion
    const memberCount = await Member.countDocuments();
    const userCount = await User.countDocuments({ role: 'member' });
    const paymentCount = await Payment.countDocuments();
    const notificationCount = await Notification.countDocuments();

    console.log('📊 Current Database State:');
    console.log(`   - Members: ${memberCount}`);
    console.log(`   - Member Users: ${userCount}`);
    console.log(`   - Payments: ${paymentCount}`);
    console.log(`   - Notifications: ${notificationCount}\n`);

    if (memberCount === 0 && userCount === 0) {
      console.log('ℹ️  No members found in database. Nothing to delete.');
      process.exit(0);
    }

    console.log('⚠️  WARNING: This will delete ALL members and related data!');
    console.log('⏳ Starting deletion process...\n');

    // Delete all payments
    console.log('🗑️  Deleting all payments...');
    const deletedPayments = await Payment.deleteMany({});
    console.log(`   ✅ Deleted ${deletedPayments.deletedCount} payments`);

    // Delete all notifications
    console.log('🗑️  Deleting all notifications...');
    const deletedNotifications = await Notification.deleteMany({});
    console.log(`   ✅ Deleted ${deletedNotifications.deletedCount} notifications`);

    // Delete all members
    console.log('🗑️  Deleting all members...');
    const deletedMembers = await Member.deleteMany({});
    console.log(`   ✅ Deleted ${deletedMembers.deletedCount} members`);

    // Delete all member users (keep admin users)
    console.log('🗑️  Deleting all member user accounts...');
    const deletedUsers = await User.deleteMany({ role: 'member' });
    console.log(`   ✅ Deleted ${deletedUsers.deletedCount} user accounts`);

    console.log('\n✨ Database cleanup completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Members deleted: ${deletedMembers.deletedCount}`);
    console.log(`   - Users deleted: ${deletedUsers.deletedCount}`);
    console.log(`   - Payments deleted: ${deletedPayments.deletedCount}`);
    console.log(`   - Notifications deleted: ${deletedNotifications.deletedCount}`);

    // Verify deletion
    const remainingMembers = await Member.countDocuments();
    const remainingUsers = await User.countDocuments({ role: 'member' });
    
    console.log('\n✅ Verification:');
    console.log(`   - Remaining members: ${remainingMembers}`);
    console.log(`   - Remaining member users: ${remainingUsers}`);

    if (remainingMembers === 0 && remainingUsers === 0) {
      console.log('\n🎉 All member data successfully cleared!');
    } else {
      console.log('\n⚠️  Warning: Some data may not have been deleted');
    }

  } catch (error) {
    console.error('\n❌ Error clearing members:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
console.log('🚀 Member Data Cleanup Script');
console.log('================================\n');
clearAllMembers();
