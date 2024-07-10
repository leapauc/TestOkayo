const express = require('express');
const app = express();
const mysql = require('mysql');

const constTest = "Rutile";

// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Eost6277Rubens*1998',
  database: 'okayo'
});

// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// perform a query
characteristics = {};
// Get the mineral classification information
const queryClassif = 'SELECT * FROM mineralsClassification WHERE nameMineral="'+constTest+'"';
connection.query(queryClassif, (error, rows, fields) => {
  if (error) throw error;
  console.log('Data received from mineralsClassification table:\n');
  console.table(rows);
  const classification = rows.map((row) => {
    return {
      nameMineral: row[fields[1].name],
      groupMineral: row[fields[2].name],
      familly: row[fields[3].name],
      stuntz: row[fields[4].name],
      cristallinSystem: row[fields[5].name],
      classCristallin: row[fields[6].name]
    };
  });
});
// Get the mineral properties information
const queryProperties = 'SELECT * FROM mineralsProperties WHERE nameMineral="'+constTest+'"';
connection.query(queryProperties, (error, rows, fields) => {
  if (error) throw error;
  console.log('Data received from mineralsProperties table:\n');
  console.table(rows);
  const properties = rows.map((row) => {
    return {
      formula: row[fields[1].name],
      weightFormula: row[fields[2].name],
      incertitud: row[fields[3].name],
      mohsScaleMin: row[fields[4].name],
      mohsScaleMax: row[fields[5].name],
      macle: row[fields[6].name],
      cleavage: row[fields[7].name],
      pleochroism: row[fields[8].name],
      magnetism: row[fields[9].name],
      radioactivity: row[fields[10].name],
      density: row[fields[11].name],
      fusionTemperature: row[fields[12].name],
      fluorescence: row[fields[13].name],
      fluorescenceProperty: row[fields[14].name],
      mineralsAssociation: row[fields[15].name],
      chemicalBehaviour: row[fields[16].name]
    };
  });
  console.log('Data as an object:');
  console.log(properties);
  console.log(properties[0]);
});
// Get the mineral properties information
const queryHistory = 'SELECT * FROM mineralsHistory WHERE nameMineral="'+constTest+'"';
connection.query(queryHistory, (error, rows, fields) => {
  if (error) throw error;
  console.log('Data received from mineralsHistory table:\n');
  console.table(rows);
  const history = rows.map((row) => {
    return {
      discovery: row[fields[1].name],
      gite: row[fields[2].name],
      utility: row[fields[3].name],
      synonyme: row[fields[4].name],
      topotype: row[fields[5].name],
    };
  });
  console.log('Data as an object:');
  console.log(history);
  console.log(history[0].discovery);
});
// close the MySQL connection
connection.end();