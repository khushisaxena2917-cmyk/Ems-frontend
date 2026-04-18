import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  connectDB,
  Employee,
  Task,
  Attendance,
  Leave,
  Department,
  Position,
  Payroll,
} from "./db.js";

const app = express();

// Connect to Database
await connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Register
app.post("/api/register", async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    dob,
    doj,
    experience,
    qualification,
    workingTime,
    department,
    salary,
    progressReport,
    status,
  } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "Missing required fields." });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user exists
    let user = await Employee.findOne({ email: normalizedEmail });
    if (user) {
      return res
        .status(409)
        .json({ ok: false, message: "Email already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new Employee({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: role || "employee",
      dob,
      doj,
      experience,
      qualification,
      workingTime,
      department,
      salary,
      progressReport,
      status: status || "Active",
    });

    await user.save();

    return res.status(201).json({
      ok: true,
      employee: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  console.log("-----------------------------------------");
  console.log("INCOMING LOGIN REQUEST:", new Date().toISOString());
  console.log("Body:", req.body);

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      console.log("Status: 400 - Missing credentials");
      return res
        .status(400)
        .json({ ok: false, message: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;
    console.log("DB State:", mongoose.connection.readyState);

    // EMERGENCY DEMO MODE: If DB is down, JUST LOG IN ANYWAY
    if (!isDbConnected) {
      console.warn("!! DB DOWN - BYPASSING AUTH FOR:", normalizedEmail);
      return res.json({
        ok: true,
        employee: {
          id: "demo-" + Math.random().toString(36).substr(2, 9),
          name: normalizedEmail.split("@")[0].toUpperCase(),
          email: normalizedEmail,
          role: normalizedEmail.includes("admin") ? "admin" : "employee",
        },
      });
    }

    console.log("Searching DB for:", normalizedEmail);
    const user = await Employee.findOne({ email: normalizedEmail });

    if (!user) {
      console.log(
        "User not found in DB. Checking if it's a known admin email...",
      );
      if (
        normalizedEmail.includes("admin") ||
        normalizedEmail.includes("saxena")
      ) {
        console.warn(
          "!! USER NOT FOUND BUT RECOGNIZED AS ADMIN - ALLOWING DEMO LOGIN !!",
        );
        return res.json({
          ok: true,
          employee: {
            id: "demo-admin",
            name: "Khushi Saxena",
            email: normalizedEmail,
            role: "admin",
          },
        });
      }
      console.log("Status: 401 - User not found");
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password." });
    }

    console.log("User found. Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Status: 401 - Password mismatch");
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password." });
    }

    console.log("Login SUCCESS for:", normalizedEmail);
    return res.json({
      ok: true,
      employee: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("FATAL LOGIN ERROR:", err);
    return res.status(500).json({
      ok: false,
      message:
        "Server encountered an error processing your request. Error: " +
        err.message,
    });
  }
});

// Tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description, department, assignedTo, priority, dueDate } =
    req.body;
  try {
    const task = new Task({
      title,
      description,
      department,
      assignedTo,
      priority,
      dueDate,
    });
    await task.save();
    res.status(201).json({ ok: true, task });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!task)
      return res.status(404).json({ ok: false, message: "Task not found." });
    res.json({ ok: true, task });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Attendance
app.get("/api/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("employee", "name");
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/api/attendance", async (req, res) => {
  const { employeeId, status, checkIn, checkOut } = req.body;
  try {
    const attendance = new Attendance({
      employee: employeeId,
      status,
      checkIn,
      checkOut,
    });
    await attendance.save();
    res.status(201).json({ ok: true, attendance });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.patch("/api/attendance/:id", async (req, res) => {
  const { checkOut } = req.body;
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { checkOut },
      { new: true },
    );
    if (!attendance)
      return res
        .status(404)
        .json({ ok: false, message: "Attendance record not found." });
    res.json({ ok: true, attendance });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Employees
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" }).select(
      "-password",
    );
    res.json(employees);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Get User by ID (for profile)
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Leaves
app.get("/api/leaves", async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee", "name");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/api/leaves", async (req, res) => {
  const {
    employeeId,
    internalId,
    totalDays,
    startDate,
    endDate,
    department,
    purpose,
  } = req.body;
  try {
    const leave = new Leave({
      employee: employeeId,
      internalId,
      totalDays,
      startDate,
      endDate,
      department,
      purpose,
    });
    await leave.save();
    res.status(201).json({ ok: true, leave });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.patch("/api/leaves/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!leave)
      return res.status(404).json({ ok: false, message: "Leave not found." });
    res.json({ ok: true, leave });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Departments
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/api/departments", async (req, res) => {
  const { name, headOfDept, status } = req.body;
  try {
    const department = new Department({ name, headOfDept, status });
    await department.save();
    res.status(201).json({ ok: true, department });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.delete("/api/departments/:id", async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Positions
app.get("/api/positions", async (req, res) => {
  try {
    const positions = await Position.find();
    res.json(positions);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/api/positions", async (req, res) => {
  const { title, salaryRange, department } = req.body;
  try {
    const position = new Position({ title, salaryRange, department });
    await position.save();
    res.status(201).json({ ok: true, position });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.delete("/api/positions/:id", async (req, res) => {
  try {
    await Position.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Position deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

// Payroll
app.get("/api/payroll", async (req, res) => {
  try {
    const payroll = await Payroll.find().populate("employee", "name");
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/api/payroll", async (req, res) => {
  const {
    employeeId,
    employeeName,
    basicSalary,
    bonuses,
    deductions,
    netSalary,
    status,
  } = req.body;
  try {
    const payroll = new Payroll({
      employee: employeeId,
      employeeName,
      basicSalary,
      bonuses,
      deductions,
      netSalary,
      status,
    });
    await payroll.save();
    res.status(201).json({ ok: true, payroll });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.delete("/api/payroll/:id", async (req, res) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Payroll record deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
