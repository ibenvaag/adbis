const express = require('express');
const router = express.Router();

// GET request til å hente alle kunder
router.get('/', (req, res) => {
    // Logikk for å hente kundeinformasjon fra databasen
    res.json([{ id: 1, navn: 'Kunde 1' }, { id: 2, navn: 'Kunde 2' }]);
});

// GET request for å hente en enkelt kunde med ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // Logikk for å hente en enkelt kunde fra databasen ved hjelp av id
    res.json({ id: id, navn: 'Kunde ' + id });
});

// POST request for å opprette en ny kunde
router.post('/', (req, res) => {
    // Logikk for å legge til en ny kunde i databasen
    res.status(201).send('Ny kunde opprettet');
});

// PUT request for å oppdatere en eksisterende kunde
router.put('/:id', (req, res) => {
    const { id } = req.params;
    // Logikk for å oppdatere kundeinformasjonen i databasen
    res.send('Kunde med ID ' + id + ' oppdatert');
});

// DELETE request for å slette en kunde
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    // Logikk for å slette en kunde fra databasen
    res.send('Kunde med ID ' + id + ' slettet');
});

module.exports = router;
