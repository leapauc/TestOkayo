const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Configuration database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Eost6277Rubens*1998',
  database: 'okayo'
};

const db = mysql.createPool(dbConfig);

/******************************************************************************************************************/
// Add a new facture with offers
app.post('/factures', async (req, res) => {
  console.log('Received request to add new facture with offers');
  const { dateFacturation, dateEcheance, client_id, offers } = req.body;

  try {
    // Execute INSERT query for facture creation
    const [result] = await db.execute(`INSERT INTO facture (dateFacturation, dateEcheance, client_id) VALUES (?,?,?)`, [dateFacturation, dateEcheance, client_id]);

    // Get the insertId from the result to get the last id
    const factureId = result.insertId;

    if (factureId) {
      // Add offers to the facture
      const offerQueries = offers.map((offer) => {
        const query = `INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F) VALUES (?,?,?,?,?,?)`;
        console.log(offer.offre_id);
        
        const queryDesignationPrixTVA = `SELECT designation, prix, tauxTVA FROM offre WHERE id=offer.offre_id`;

        return db.execute(query, [factureId, offer.offre_id, offer.quantity, offer.designation_F, offer.prix_F, offer.tauxTVA_F]);
      });

      await Promise.all(offerQueries);
      res.status(201).send({ message: 'Facture added successfully with offers' });
    } else {
      console.error('Facture ID is undefined');
      res.status(500).send({ message: 'Error adding facture' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error adding facture' });
  }
});
/******************************************************************************************************************/
// Add a client
app.post('/clients', async (req, res) => {
  console.log('Received request to add new client');
  const { nomEntreprise, rue, codePostal, ville } = req.body;

  try {
    // Execute the INSERT query
    const [result] = await db.execute(`INSERT INTO client (nomEntreprise, rue, codePostal, ville) VALUES (?,?,?,?)`, [nomEntreprise, rue, codePostal, ville]);

    // Get the insertId from the result
    const clientId = result.insertId;
    console.log(clientId);
    if (clientId) {
      res.status(201).send({ message: 'Client added successfully' });
    } else {
      console.error('Client ID is undefined');
      res.status(500).send({ message: 'Error adding client' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error adding client' });
  }
});
/******************************************************************************************************************/
// Add an offer
app.post('/offres', async (req, res) => {
  console.log('Received request to add new offer');
  const { designation, prix, tauxTVA } = req.body;

  try {
    // Execute the INSERT query
    const [result] = await db.execute(`INSERT INTO offre (designation, prix, tauxTVA) VALUES (?,?,?)`, [designation, prix, tauxTVA]);

    // Get the insertId from the result
    const offreId = result.insertId;
    console.log(offreId);
    if (offreId) {
      res.status(201).send({ message: 'Offer added successfully' });
    } else {
      console.error('Offer ID is undefined');
      res.status(500).send({ message: 'Error adding offer' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error adding offer' });
  }
});

/******************************************************************************************************************/ 
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
  
/******************************************************************************************************************/ 
// Update an offer : modify the price, designation, or TVA rate of an offre
// NON FONCTIONNEL
app.put('/offers/:id', async (req, res) => {
  const id = req.params.id;
  const { designation, prix, tauxTVA } = req.body;

  console.log(`Received update request for offer ID: ${id}`);
  console.log(`Request body:`, req.body);

  if (!designation || !prix || !tauxTVA) {
    res.status(400).send({ message: 'Missing required fields' });
    return;
  }

  try {
    // Update the offer in the database
    const [result] = await pool.execute(
      `UPDATE offre SET designation = ?, prix = ?, tauxTVA = ? WHERE id = ?`,
      [designation, prix, tauxTVA, id]
    );

    if (result.affectedRows === 0) {
      console.log('Offer not found');
      res.status(404).send({ message: 'Offer not found' });
    } else {
      console.log('Offer updated successfully');
      res.send({ message: 'Offer updated successfully' });
    }
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).send({ message: 'Error updating offer' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
