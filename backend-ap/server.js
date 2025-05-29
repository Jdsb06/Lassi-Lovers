require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'factcheck.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('SQLite connection error:', err);
  else console.log('Connected to SQLite DB at', dbPath);
});

// Create users table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.error('Failed to create users table:', err);
  }
);

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    if (row) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      db.run(
        'INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, phone, hash],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Server error' });
          }
          res.json({ success: true, message: 'User created' });
        }
      );
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT id, password_hash FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    if (!row) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    bcrypt.compare(password, row.password_hash, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      if (!result) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
      res.json({ success: true, message: 'Login successful' });
    });
  });
});

// Verify claim endpoint (stub)
app.post('/verify_claim', (req, res) => {
  const { claim } = req.body;
  // TODO: replace with real fact-checking logic
  const response = {
    claim,
    trustScore: Math.floor(Math.random() * 101),
    verdict: "Pending",
    evidence: [],
    analysis: "This is a placeholder verification response."
  };
  res.json(response);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 