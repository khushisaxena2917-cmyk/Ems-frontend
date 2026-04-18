import bcrypt from "bcryptjs";
import { connectDB, Employee } from "./db.js";

async function addEmployees() {
  await connectDB();

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    const employeesData = [
      {
        name: "Saniya Khan",
        email: "saniya@hrhub.com",
        phone: "9876543210",
        dob: "1995-05-15",
        doj: "2023-01-10",
        experience: "3 Years",
        qualification: "MBA",
        workingTime: "9:00 AM - 6:00 PM",
        department: "Human Resources",
        salary: 45000,
        progressReport: 85,
        status: "Active",
      },
      {
        name: "Saloni Kadam",
        email: "saloni@hrhub.com",
        phone: "9876543211",
        dob: "1998-08-22",
        doj: "2023-06-15",
        experience: "1 Year",
        qualification: "B.Tech",
        workingTime: "10:00 AM - 7:00 PM",
        department: "Engineering",
        salary: 35000,
        progressReport: 60,
        status: "Active",
      },
      {
        name: "Rahul Sharma",
        email: "rahul@hrhub.com",
        phone: "9876543214",
        dob: "1992-04-10",
        doj: "2020-05-12",
        experience: "6 Years",
        qualification: "BBA",
        workingTime: "9:00 AM - 6:00 PM",
        department: "Marketing",
        salary: 48000,
        progressReport: 78,
        status: "Active",
      },
      {
        name: "Priya Singh",
        email: "priya@hrhub.com",
        phone: "9876543215",
        dob: "1996-09-30",
        doj: "2023-02-14",
        experience: "2 Years",
        qualification: "M.Com",
        workingTime: "9:00 AM - 6:00 PM",
        department: "Finance",
        salary: 42000,
        progressReport: 82,
        status: "Active",
      },
    ];

    for (const empData of employeesData) {
      // Check if employee exists
      const exists = await Employee.findOne({ email: empData.email });
      if (!exists) {
        const emp = new Employee({
          ...empData,
          password: passwordHash,
          role: "employee",
        });
        await emp.save();
        console.log(`Added employee: ${empData.name}`);
      } else {
        console.log(`Employee already exists: ${empData.name}`);
      }
    }

    // Also ensure admin exists
    const adminExists = await Employee.findOne({ email: "admin@hrhub.com" });
    if (!adminExists) {
        const admin = new Employee({
            name: "Admin User",
            email: "admin@hrhub.com",
            password: passwordHash,
            role: "admin",
            status: "Active",
            progressReport: 100,
        });
        await admin.save();
        console.log("Admin user created.");
    }

    console.log("Employees added successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error adding employees:", err.message);
    process.exit(1);
  }
}

addEmployees();
