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

// Update the price, designation, or TVA rate of an offre
/*app.patch('/offre/:id', async (req, res) => {
  const id = req.params.id;
  const { prix, designation, tauxTVA } = req.body;
  const query = `UPDATE offre SET `;
  let updates = [];
  if (prix) {
    updates.push(`prix =?`);
  }
  if (designation) {
    updates.push(`designation =?`);
  }
  if (tauxTVA) {
    updates.push(`tauxTVA =?`);
  }
  query += updates.join(', ');
  query += ` WHERE id =?`;
  try {
    const result = await db.execute(query, [...updates.map(u => req.body[u]), id]);
    res.status(200).send({ message: 'Offre updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating offre' });
  }
});*/

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});