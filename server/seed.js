import bcrypt from "bcryptjs";
import { connectDB, Employee, Task, Attendance, Department } from "./db.js";

async function seedDatabase() {
  await connectDB();

  try {
    // Clear existing data
    await Employee.deleteMany({});
    await Task.deleteMany({});
    await Attendance.deleteMany({});
    await Department.deleteMany({});
    console.log("Existing data cleared.");

    // Seed Departments
    const departmentsData = [
      { name: "Engineering", status: "enable" },
      { name: "Human Resources", status: "enable" },
      { name: "Marketing", status: "enable" },
      { name: "IT", status: "enable" },
      { name: "Finance", status: "enable" },
      { name: "Research", status: "enable" },
    ];
    await Department.insertMany(departmentsData);
    console.log("Departments seeded.");

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    // 1. Seed Admin
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

    // 2. Seed Employees with new fields
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
        name: "Mayuri Bhatnagar",
        email: "mayuri@hrhub.com",
        phone: "9876543212",
        dob: "1994-12-05",
        doj: "2022-03-20",
        experience: "5 Years",
        qualification: "MCA",
        workingTime: "9:00 AM - 6:00 PM",
        department: "IT",
        salary: 55000,
        progressReport: 92,
        status: "Active",
      },
      {
        name: "Anil Saxena",
        email: "anil@hrhub.com",
        phone: "9876543213",
        dob: "1990-02-28",
        doj: "2021-11-01",
        experience: "8 Years",
        qualification: "PhD",
        workingTime: "11:00 AM - 8:00 PM",
        department: "Research",
        salary: 75000,
        progressReport: 45,
        status: "On Leave",
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

    const employees = [];
    for (const empData of employeesData) {
      const emp = new Employee({
        ...empData,
        password: passwordHash,
        role: "employee",
      });
      await emp.save();
      employees.push(emp);
    }
    console.log(`${employees.length} employees created.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
}

seedDatabase();
