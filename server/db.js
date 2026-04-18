import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://khushisaxena:01march03@cluster0.lczah0b.mongodb.net/hrhub?appName=Cluster0";

export const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.warn("SERVER RUNNING WITHOUT ACTIVE DATABASE CONNECTION!");
  }
};

// 1. Employees & Users Model
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String },
  doj: { type: String },
  experience: { type: String },
  qualification: { type: String },
  workingTime: { type: String },
  department: { type: String },
  position: { type: String }, // New Field
  salary: { type: Number },
  progressReport: { type: Number, default: 0 },
  status: { type: String, default: "Active" },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "hr", "employee"], default: "employee" }, // Expanded Roles
  createdAt: { type: Date, default: Date.now },
});

export const Employee = mongoose.model("Employee", employeeSchema);

// 2. Departments Model
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  headOfDept: { type: String }, // New Field
  totalEmployees: { type: Number, default: 0 }, // New Field
  status: { type: String, enum: ["enable", "disable"], default: "enable" },
  createdAt: { type: Date, default: Date.now },
});

export const Department = mongoose.model("Department", departmentSchema);

// 3. Positions Model
const positionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  salaryRange: { type: String },
  department: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Position = mongoose.model("Position", positionSchema);

// 4. Attendance Model
const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  employeeName: { type: String }, // For easier reporting
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    default: "Present",
  },
  checkIn: { type: String },
  checkOut: { type: String },
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);

// 5. Payroll Model
const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  employeeName: { type: String },
  basicSalary: { type: Number, required: true },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
});

export const Payroll = mongoose.model("Payroll", payrollSchema);

// 6. Leave Requests Model
const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  employeeName: { type: String },
  internalId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  totalDays: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  department: { type: String, required: true },
  purpose: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Leave = mongoose.model("Leave", leaveSchema);

// 7. Tasks Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  department: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Task = mongoose.model("Task", taskSchema);
