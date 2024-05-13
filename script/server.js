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

// Define the path to the database
const dbPath = path.join(__dirname, 'mydatabase.db');

// Root route to serve 'arrgmt.html'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'arrgmt.html'));
});

// POST route for login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
      res.status(500).send("Failed to open database");
      return;
    }
    console.log("Database connected successfully");

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.get(sql, [email, password], (err, row) => {
      db.close(); // Close the database connection
      if (err) {
        console.error('Error running query:', err.message);
        res.status(400).send("Database query error");
        return;
      }
      if (row) {
        console.log('User found:', row.user_id);
        res.status(200).send("Login successful");
      } else {
        console.log('Login failed for:', email);
        res.status(401).send("Login failed");
      }
    });
  });
});

// GET route to fetch all arrangements from database
app.get("/api/arrangements", (req, res) => {
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
      res.status(500).send("Failed to open database");
      return;
    }
    console.log("Database connected for fetching arrangements.");

    const sql = "SELECT * FROM arrangement";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error running query:', err.message);
        res.status(400).send("Database query error");
        return;
      }
      res.json(rows); // Send the rows as JSON to the client
      db.close(); // Close the database connection after the query completes
    });
  });
});

app.get("/api/arrangements/:arrangement_id", (req, res) => {
  console.log("Requested arrangement_id:", req.params.arrangement_id);

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
      res.status(500).send("Failed to open database");
      return;
    }

    const sql = "SELECT * FROM arrangement WHERE arrangement_id = ?";
    db.get(sql, [req.params.arrangement_id], (err, row) => {
      if (err) {
        console.error('Error running query:', err.message);
        res.status(400).send("Database query error");
        return;
      }
      if (row) {
        res.json(row);
      } else {
        res.status(404).send("Event not found");
      }
      db.close();
    });
  });
});



// Server listening on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
