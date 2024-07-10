const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Eost6277Rubens*1998',
  database: 'okayo'
};

const db = mysql.createPool(dbConfig);

// Add a new facture
app.post('/factures', async (req, res) => {
  console.log('Received request to add new facture');
  const { dateFacturation, dateEcheance, client_id } = req.body;
  const query = `INSERT INTO facture (dateFacturation, dateEcheance, client_id) VALUES (?,?,?)`;
  try {
    const result = await db.execute(query, [dateFacturation, dateEcheance, client_id]);
    res.status(201).send({ message: 'Facture added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error adding facture' });
  }
});

// Get access to the information of a facture
app.get('/factures/:id/details', async (req, res) => {
    const factureId = req.params.id;
    const queryTotals = 'SELECT * FROM facture_totals WHERE facture_id = ?';
    const queryTVADetails = 'SELECT * FROM facture_tva_details WHERE facture_id = ?';
    const queryFactureDetails = 'SELECT * FROM facture_offre WHERE facture_id = ?';

    try {
      const [totals] = await db.execute(queryTotals, [factureId]);
      const [tvaDetails] = await db.execute(queryTVADetails, [factureId]);
      const [factureDetails] = await db.execute(queryFactureDetails, [factureId]);
      
      if (totals.length === 0 || tvaDetails.length === 0) {
        res.status(404).send({ message: 'Facture not found' });
        return;
      }
  
      res.status(200).send({ totals: totals[0], tvaDetails: tvaDetails, factureDetails: factureDetails });
      console.log('Facture Totals:');
      console.table(totals);
    
      console.log('\nTVA Details:');
      console.table(tvaDetails);
    
      console.log('\nFacture Details:');
      console.table(factureDetails);
      
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error retrieving facture details' });
    }
  });
  
// Update the price, designation, or TVA rate of an offre

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});