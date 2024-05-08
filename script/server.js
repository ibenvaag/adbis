const sqlite3 = require('sqlite3').verbose();
const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware for å håndtere CORS og JSON i forespørsler
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve all files in the 'public' directory statically
app.use(express.static(path.join(__dirname, '..', 'public')));

// Updated root route to serve 'arrgmt.html'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'arrgmt.html'));
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server open on port 3000");
});
