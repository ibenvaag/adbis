const express = require("express");
const cors = require("cors");
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path'); // Til å håndtere filstier

const app = express();

// Midtware for å håndtere CORS og JSON i forespørsler
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Legg til denne linjen for å tjene filer fra 'public'

// Jeg har kommentert ut denne delen ettersom du sa du ikke har denne ruten enda.
// const customerRoute = require("./routes/customer");
// app.use("/customer", customerRoute);

// Oppdateret root route for å tjene 'arrgmt.html' (din innloggingsside, endre filnavnet hvis nødvendig)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '../../html/arrgmt.html')); // Endre 'arrgmt.html' til din HTML-fils navn hvis det er forskjellig
});

// Din eksisterende POST-rute for å håndtere innlogging
// ... (ingen endringer nødvendig her)

// Start serveren på port 3000
app.listen(3000, () => {
  console.log("Server open on port 3000");
});
