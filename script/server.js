const sqlite3 = require('sqlite3').verbose();
const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware for handling CORS and JSON in requests
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve all files in the 'public' directory statically
app.use(express.static(path.join(__dirname, '..', 'public')));

// Root route to serve 'arrgmt.html'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'arrgmt.html'));
});

// Server listening on port 3000
app.listen(3000, () => {
  console.log("Server open on port 3000");
});

// Define the path and open a single database connection
const dbPath = path.join(__dirname, 'mydatabase.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log("Database connected successfully");
});

// POST route for login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      console.error('Error running query:', err.message);
      res.status(400).send("Database query error");
      return;
    }
    if (row) {
      console.log('User found:', row.name); // Log user's name or another unique identifier
      res.redirect('/html/index.html');
    } else {
      console.log('Login failed for:', email);
      res.status(401).send("Innlogging mislyktes");
    }
  });
});
