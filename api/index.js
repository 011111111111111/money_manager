import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const apiRouter = express.Router();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173', // Development
    'http://localhost:3000', // Alternative dev port
    'https://*.vercel.app', // Vercel deployments
    'https://*.railway.app', // Railway deployments
    'https://*.render.com', // Render deployments
    process.env.FRONTEND_URL // Custom frontend URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database setup
let db;

async function initializeDatabase() {
  // Use /tmp directory for Vercel serverless functions
  const dbPath = '/tmp/expenses.db';
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      paymentMode TEXT NOT NULL,
      splitInfo TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS shared_events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      shareCode TEXT UNIQUE,
      isActive BOOLEAN DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS shared_expenses (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      paidBy TEXT NOT NULL,
      splitBetween TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      paymentMode TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES shared_events (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.exec('CREATE INDEX IF NOT EXISTS idx_shared_expenses_eventId ON shared_expenses(eventId)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_shared_events_shareCode ON shared_events(shareCode)');

  console.log('Database initialized successfully');
}

// Initialize database immediately
initializeDatabase().catch(console.error);

// API Routes

// Get all expenses
apiRouter.get('/expenses', async (req, res) => {
  try {
    const expenses = await db.all('SELECT * FROM expenses ORDER BY date DESC');
    res.json(expenses.map(expense => ({
      ...expense,
      splitInfo: expense.splitInfo ? JSON.parse(expense.splitInfo) : undefined
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expense
apiRouter.post('/expenses', async (req, res) => {
  try {
    const { type, amount, category, description, date, paymentMode, splitInfo } = req.body;
    const id = uuidv4();
    
    await db.run(
      'INSERT INTO expenses (id, type, amount, category, description, date, paymentMode, splitInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, type, amount, category, description, date, paymentMode, splitInfo ? JSON.stringify(splitInfo) : null]
    );

    const newExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);
    res.status(201).json({
      ...newExpense,
      splitInfo: newExpense.splitInfo ? JSON.parse(newExpense.splitInfo) : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense
apiRouter.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date, paymentMode, splitInfo } = req.body;
    
    await db.run(
      'UPDATE expenses SET type = ?, amount = ?, category = ?, description = ?, date = ?, paymentMode = ?, splitInfo = ? WHERE id = ?',
      [type, amount, category, description, date, paymentMode, splitInfo ? JSON.stringify(splitInfo) : null, id]
    );

    const updatedExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);
    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({
      ...updatedExpense,
      splitInfo: updatedExpense.splitInfo ? JSON.parse(updatedExpense.splitInfo) : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
apiRouter.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM expenses WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Shared Events - Simple link-based system
apiRouter.get('/shared-events', async (req, res) => {
  try {
    const events = await db.all(`
      SELECT 
        se.*,
        COUNT(sx.id) as expenseCount,
        COALESCE(SUM(sx.amount), 0) as totalAmount
      FROM shared_events se
      LEFT JOIN shared_expenses sx ON se.id = sx.eventId
      WHERE se.isActive = 1
      GROUP BY se.id
      ORDER BY se.createdAt DESC
    `);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/shared-events', async (req, res) => {
  try {
    const { name, description } = req.body;
    const eventId = uuidv4();
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await db.run(
      'INSERT INTO shared_events (id, name, description, shareCode) VALUES (?, ?, ?, ?)',
      [eventId, name, description, shareCode]
    );

    const newEvent = await db.get('SELECT * FROM shared_events WHERE id = ?', [eventId]);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event by share code
apiRouter.get('/shared-events/:shareCode', async (req, res) => {
  try {
    const { shareCode } = req.params;
    
    const event = await db.get('SELECT * FROM shared_events WHERE shareCode = ? AND isActive = 1', [shareCode]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found or inactive' });
    }

    // Get event expenses
    const expenses = await db.all(`
      SELECT * FROM shared_expenses 
      WHERE eventId = ? 
      ORDER BY date DESC
    `, [event.id]);

    res.json({
      ...event,
      expenses: expenses.map(expense => ({
        ...expense,
        splitBetween: JSON.parse(expense.splitBetween)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add expense to shared event
apiRouter.post('/shared-events/:shareCode/expenses', async (req, res) => {
  try {
    const { shareCode } = req.params;
    const { description, amount, paidBy, splitBetween, date, category, paymentMode, createdBy } = req.body;
    
    // Get event
    const event = await db.get('SELECT * FROM shared_events WHERE shareCode = ? AND isActive = 1', [shareCode]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found or inactive' });
    }

    const expenseId = uuidv4();
    
    await db.run(
      'INSERT INTO shared_expenses (id, eventId, description, amount, paidBy, splitBetween, date, category, paymentMode, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [expenseId, event.id, description, amount, paidBy, JSON.stringify(splitBetween), date, category, paymentMode, createdBy]
    );

    const newExpense = await db.get('SELECT * FROM shared_expenses WHERE id = ?', [expenseId]);
    res.status(201).json({
      ...newExpense,
      splitBetween: JSON.parse(newExpense.splitBetween)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses for shared event
apiRouter.get('/shared-events/:shareCode/expenses', async (req, res) => {
  try {
    const { shareCode } = req.params;
    
    const event = await db.get('SELECT * FROM shared_events WHERE shareCode = ? AND isActive = 1', [shareCode]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found or inactive' });
    }

    const expenses = await db.all(`
      SELECT * FROM shared_expenses 
      WHERE eventId = ? 
      ORDER BY date DESC
    `, [event.id]);

    res.json(expenses.map(expense => ({
      ...expense,
      splitBetween: JSON.parse(expense.splitBetween)
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Mount the router to handle all API requests
app.use('/api', apiRouter);

// Handle root path for basic info
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Expenso API' });
});

// Export for Vercel
export default app; 