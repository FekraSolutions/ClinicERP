const express = require("express");
const cors = require("cors");
const { prisma } = require("./prisma.config");

const app = express();
const PORT = 5000;

const corsOptions = {
  origin: 'https://clinic-erp-frontend.vercel.app',
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Explicitly handle the "OPTIONS" preflight request for all routes
app.options('*', cors(corsOptions));



// Add this right below the cors block to manually handle OPTIONS
app.options('*', cors());

app.use(express.json());      // parse JSON body

// Test route
app.get("/", (req, res) => {
  res.send("ClinicERP Backend Running");
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});



app.get("/invoices/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Fetch all invoices for this user
    const invoices = await prisma.invoice.findMany({
      where: { userId }
    });

    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Get database rows for logged user
app.get("/database/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const rows = await prisma.databaseRow.findMany({
      where: { userId }
    });

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


// Save database rows
app.post("/database/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const rows = req.body;

    // Delete old rows
    await prisma.databaseRow.deleteMany({
      where: { userId }
    });

    // Insert new rows
    const dataToInsert = rows.map(row => ({
      employeeName: row.employeeName || null,
      doctorName: row.doctorName || null,
      serviceName: row.serviceName || null,
      servicePrice: row.servicePrice ? parseFloat(row.servicePrice) : null,
      inventoryItemName: row.inventoryItemName || null,
      purchasePrice: row.purchasePrice ? parseFloat(row.purchasePrice) : null,
      salePrice: row.salePrice ? parseFloat(row.salePrice) : null,
      userId
    }));

    await prisma.databaseRow.createMany({
      data: dataToInsert
    });

    res.json({ message: "Saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save data" });
  }
});


// Get invoices for logged user
app.get("/invoices/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    });

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// Insert new invoice from Reception page
app.post("/reception/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId); // ensure number
    const data = req.body;

    // Convert values to correct types
    const price = parseFloat(data.price || 0);
    const paid = parseFloat(data.paid || 0);
    const discountAmount = parseFloat(data.discountAmount || 0);
    const sessions = parseInt(data.sessions || 0, 10);
    const age = data.age ? parseInt(data.age, 10) : null;
    const date = new Date(data.date); // ensure Date object

    // Auto-calculate price after discount and remaining
    const priceAfterDiscount = price - discountAmount;
    const remaining = priceAfterDiscount - paid;

    const invoice = await prisma.invoice.create({
      data: {
        date,
        time: data.time,
        patientName: data.patientName,
        age,
        patientId: data.patientId,
        phone: data.phone,
        address: data.address,
        email: data.email,
        service: data.service,
        doctor: data.doctor,
        price,
        payMethod: data.payMethod,
        paid,
        discountAmount,
        sessions,
        priceAfterDiscount,
        remaining,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        registrationNumber: data.registrationNumber,
        taxNumber: data.taxNumber,
        userId // link to the logged-in user
      }
    });

    res.json({ message: "Invoice saved successfully", invoice });
  } catch (error) {
    console.error("Failed to save invoice:", error);
    res.status(500).json({ error: "Failed to save invoice" });
  }
});
// Get expenses for logged user
app.get("/expenses/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { id: "asc" }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Save a single expense row
app.post("/expenses/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { date, description, amount } = req.body;

    // 1. Get the current highest transactionId ONLY for this user
    const lastExpense = await prisma.expense.findFirst({
      where: { userId },
      orderBy: { transactionId: 'desc' },
    });

    // 2. If no expenses exist for this user, start at 1. Otherwise, increment.
    // We also handle the case where transactionId might be null for old rows
    const nextId = (lastExpense && lastExpense.transactionId) ? lastExpense.transactionId + 1 : 1;

    const newExpense = await prisma.expense.create({
      data: {
        transactionId: nextId,
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        userId
      }
    });

    res.json(newExpense);
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save expense" });
  }
});

// Get all payroll records for a user
app.get("/payroll/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const records = await prisma.payroll.findMany({
      where: { userId },
      orderBy: { period: "desc" }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payroll" });
  }
});

// Save a new payroll record
app.post("/payroll/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { employeeName, basicSalary, additions, deductions, period } = req.body;

    const netSalary = parseFloat(basicSalary) + parseFloat(additions) - parseFloat(deductions);

    const record = await prisma.payroll.create({
      data: {
        employeeName,
        basicSalary: parseFloat(basicSalary),
        additions: parseFloat(additions),
        deductions: parseFloat(deductions),
        netSalary,
        period: new Date(period),
        userId
      }
    });
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save payroll" });
  }
});


app.get("/income-statement/:userId", async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure we don't crash on invalid dates
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const dateFilter = { gte: start, lte: end };
    const uId = parseInt(userId);

    const [invoices, expenses, payroll] = await Promise.all([
      prisma.invoice.aggregate({
        where: { userId: uId, date: dateFilter },
        _sum: { priceAfterDiscount: true }, // Updated from totalAmount
      }),
      prisma.expense.aggregate({
        where: { userId: uId, date: dateFilter },
        _sum: { amount: true },
      }),
      prisma.payroll.aggregate({
        where: { userId: uId, period: dateFilter },
        _sum: { netSalary: true },
      })
    ]);

    res.json({
      revenue: invoices._sum?.priceAfterDiscount || 0,
      expenses: expenses._sum?.amount || 0,
      payroll: payroll._sum?.netSalary || 0,
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Database aggregation failed" });
  }
});

// GET All Accounts Receivables (Debts)
app.get("/accounts-receivables/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const debts = await prisma.invoice.findMany({
      where: {
        userId: parseInt(userId),
        remaining: { gt: 0 }, // gt = "Greater Than"
      },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        patientName: true,
        date: true,
        priceAfterDiscount: true,
        paid: true,
        remaining: true,
        phone: true
      }
    });
    res.json(debts);
  } catch (error) {
    res.status(500).json({ error: "Failed to load receivables" });
  }
});



// ==========================================
// PATIENT FILES & NOTES SYSTEM
// ==========================================

// 1. GET list of unique patients from Invoices
app.get("/patients-list/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const patients = await prisma.invoice.findMany({
      where: { userId: parseInt(userId) },
      distinct: ['patientName'], 
      select: { patientName: true, phone: true, patientId: true }
    });
    res.json(patients);
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    res.status(500).json({ error: "Failed to load patients" });
  }
});

// 2. SAVE or UPDATE a Patient Note
app.post("/patient-notes", async (req, res) => {
  const { userId, patientName, patientId, content, id } = req.body;
  try {
    const note = await prisma.patientNote.upsert({
      where: { id: id || -1 },
      update: { content },
      create: { 
        userId: parseInt(userId), 
        patientName, 
        patientId, 
        content 
      },
    });
    res.json(note);
  } catch (error) {
    console.error("Save Note Error:", error);
    res.status(500).json({ error: "Save failed" });
  }
});

// 3. LOAD a specific note by Patient Name
app.get("/patient-notes/:userId/:name", async (req, res) => {
  try {
    const note = await prisma.patientNote.findFirst({
      where: { 
        userId: parseInt(req.params.userId), 
        patientName: req.params.name 
      }
    });
    res.json(note || { content: "" });
  } catch (error) {
    console.error("Load Note Error:", error);
    res.status(500).json({ error: "Load failed" });
  }
});

// 1. Fetch sessions for a specific user and date
app.get("/sessions/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  try {
    const sessions = await prisma.session.findMany({
      where: { 
        userId: parseInt(userId), 
        date: date 
      },
      orderBy: { time: 'asc' }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// 2. Save a new session with OVERLAP CHECK
app.post("/sessions/:userId", async (req, res) => {
  const { userId } = req.params;
  const { date, time, patientName, patientPhone, patientEmail, doctorName } = req.body;

  try {
    // MECHANISM: Check if this specific doctor is already booked at this exact date/time
    const existingAppointment = await prisma.session.findFirst({
      where: {
        date: date,
        time: time,
        doctorName: doctorName,
        userId: parseInt(userId)
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        error: `Conflict: Dr. ${doctorName} already has a session at ${time} on ${date}.` 
      });
    }

    // If no conflict, create the session
    const newSession = await prisma.session.create({
      data: {
        date,
        time,
        patientName,
        patientPhone,
        patientEmail,
        doctorName,
        userId: parseInt(userId)
      }
    });
    res.json(newSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error while saving session" });
  }
});