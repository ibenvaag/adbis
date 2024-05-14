const sqlite3 = require('sqlite3').verbose();
const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '..', 'public')));


const dbPath = path.join(__dirname, 'mydatabase.db');


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'arrgmt.html'));
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
      res.status(500).send("Failed to open database");
      return;
    }

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.get(sql, [email, password], (err, row) => {
      db.close(); 
      if (err) {
        console.error('Error running query:', err.message);
        res.status(400).send("Database query error");
        return;
      }
      if (row) {
        console.log('User found:', row.user_id);
        res.json({ message: "Login successful", user_id: row.user_id }); // Return user_id
      } else {
        console.log('Login failed for:', email);
        res.status(401).send("Login failed");
      }
    });
  });
});


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
      res.json(rows); 
      db.close(); 
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


app.post("/api/tickets", (req, res) => {
  const { user_id, arrangement_id, date_of_purchase } = req.body;

  const qrCode = Math.floor(100000 + Math.random() * 900000);

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
      res.status(500).send("Failed to open database");
      return;
    }

    const sql = `INSERT INTO ticket (user_id, arrangement_id, date_of_purchase, QR) VALUES (?, ?, ?, ?)`;
    db.run(sql, [user_id, arrangement_id, date_of_purchase, qrCode], function(err) {
      if (err) {
        console.error('Error running insert query:', err.message);
        res.status(400).send("Database insert error");
        return;
      }
      const ticketDetails = {
        ticket_id: this.lastID,
        user_id: user_id,
        arrangement_id: arrangement_id,
        date_of_purchase: date_of_purchase,
        QR: qrCode
      };
      console.log('New ticket created:', ticketDetails);  
      res.json(ticketDetails);  
      db.close();
    });
  });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
