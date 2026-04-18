import bcrypt from "bcryptjs";
import { connectDB, Employee } from "./db.js";

async function createAdmin() {
  console.log("Connecting to MongoDB...");
  await connectDB();

  try {
    const adminEmail = "admin@saxenagroup.com";
    const password = "password123";

    // Check if admin already exists
    const existingAdmin = await Employee.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user already exists with email: ${adminEmail}`);
      // Update password just in case it was forgotten
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("Admin password updated to: password123");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Employee({
      name: "Khushi Saxena",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      department: "Founder's Office",
      status: "Active",
      progressReport: 100,
    });

    await admin.save();
    console.log("************************************************");
    console.log("SUCCESS: Admin User Created for Saxena's Group");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${password}`);
    console.log("************************************************");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
