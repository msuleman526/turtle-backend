const User = require('../models/User');

const initializeAdmin = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@turtle.com' });

    if (!adminExists) {
      // Create admin user with strong password
      const adminUser = new User({
        email: 'admin@turtle.com',
        password: 'TurtlePath@2024!Admin$ecure'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('   Email: admin@turtle.com');
      console.log('   Password: TurtlePath@2024!Admin$ecure');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
  }
};

module.exports = initializeAdmin;
