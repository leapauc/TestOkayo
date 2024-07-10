/* Création de la databse okayo*/
CREATE DATABASE IF NOT EXISTS okayo;
USE okayo;

/* Création et remplissage de la table OFFRE*/
DROP TABLE IF EXISTS offre;
CREATE TABLE offre (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    designation VARCHAR(100) UNIQUE,
    prix DECIMAL(10, 2) NOT NULL,
    tauxTVA DECIMAL(4, 3)
);
INSERT into offre (designation, prix, tauxTVA)
VALUE   ('Mon produit A',1500,0.055),
        ('Mon produit B',4000,0.07),
        ('Mon produit C',70000,0.2),
        ('Mon produit D',3000,0.2);

/* Création et remplissage  de la table CLIENT*/
DROP TABLE IF EXISTS client;
CREATE TABLE client (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nomEntreprise VARCHAR(50) UNIQUE,
    rue VARCHAR(100) NOT NULL,
    codePostal INT NOT NULL,
    ville VARCHAR(50) NOT NULL
);
INSERT into client (nomEntreprise, rue, codePostal, ville)
VALUE   ('Mon client SAS', '45 rue du test',75016,'PARIS'),
        ('Mon client SAS 2', '47 rue du test',75016,'PARIS');

/* Création et remplissage  de la table FOURNISSEUR*/
DROP TABLE IF EXISTS fournisseur;
CREATE TABLE fournisseur (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    rue VARCHAR(100) NOT NULL,
    codePostal INT NOT NULL,
    ville VARCHAR(50) NOT NULL,
    tel FLOAT UNIQUE,
    siteWeb VARCHAR(150),
    domiciliation VARCHAR(10),
    nomProp VARCHAR(50),
    IBAN VARCHAR(33) UNIQUE NOT NULL,
    BIC_SWIFT VARCHAR(11)
);
INSERT into fournisseur (rue, codePostal, ville, tel, siteWeb, domiciliation, nomProp, IBAN, BIC_SWIFT)
VALUE   ('35 Rue du Général Foy',75008,'Paris',0180886300,'www.okayo.fr','BRED','OKAYO','FR76 0000 0000 0000 0000 0000 097','BREDFRPPXXX');

/* Création de la table facture*/
DROP TABLE IF EXISTS facture;
CREATE TABLE facture (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    dateFacturation DATE,
    dateEcheance DATE,
    client_id INT,
    FOREIGN KEY (client_id) REFERENCES client(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/* Création de la table facture_offre, table de liaison entre facture et offres*/
DROP TABLE IF EXISTS facture_offre;
CREATE TABLE facture_offre (
    facture_id INT NOT NULL,
    offre_id INT NOT NULL,
    quantity INT NOT NULL,
    designation_F VARCHAR(100),
    prix_F DECIMAL(10, 2) NOT NULL,
    tauxTVA_F DECIMAL(4, 3) ,
    FOREIGN KEY (facture_id) REFERENCES facture(id),
    FOREIGN KEY (offre_id) REFERENCES offre(id)
);
/*Facture 1*/
START TRANSACTION;
-- Créer une nouvelle facture
INSERT INTO facture (dateFacturation, dateEcheance, client_id) VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1);
-- Récupérer l'ID de la facture nouvellement créée
SET @facture_id = LAST_INSERT_ID();
-- Ajouter les offres à la facture avec les prix actuels
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 1, designation, prix, tauxTVA FROM offre WHERE id = 3;
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 2, designation, prix, tauxTVA  FROM offre WHERE id = 1;
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 1, designation, prix, tauxTVA  FROM offre WHERE id = 4; 
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 2, designation, prix, tauxTVA  FROM offre WHERE id = 2; 
COMMIT;
/*Facture 2*/
START TRANSACTION;
-- Créer une nouvelle facture
INSERT INTO facture (dateFacturation, dateEcheance, client_id) VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 2);
-- Récupérer l'ID de la facture nouvellement créée
SET @facture_id = LAST_INSERT_ID();
-- Ajouter les offres à la facture avec les prix actuels
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 3, designation, prix, tauxTVA FROM offre WHERE id = 3;
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 1, designation, prix, tauxTVA  FROM offre WHERE id = 1;
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 2, designation, prix, tauxTVA  FROM offre WHERE id = 4; 
COMMIT;

/* Création de vues pour générer les statistiques concernant chaque facture */
DROP VIEW IF EXISTS facture_totals;
CREATE VIEW facture_totals AS
SELECT
    f.id AS facture_id,
    ROUND(SUM(fo.quantity * fo.prix_F),2) AS total_HT,
    ROUND(SUM(fo.quantity * fo.prix_F * fo.tauxTVA_F),2) AS total_TVA,
    ROUND(SUM(fo.quantity * fo.prix_F * (1 + fo.tauxTVA_F)),2) AS total_TTC
FROM
    facture f
JOIN
    facture_offre fo ON f.id = fo.facture_id
GROUP BY
    f.id;

DROP VIEW IF EXISTS facture_tva_details;
CREATE VIEW facture_tva_details AS
SELECT
    f.id AS facture_id,
    fo.tauxTVA_F,
    ROUND(SUM(fo.quantity * fo.prix_F * fo.tauxTVA_F), 2) AS total_TVA
FROM
    facture f
JOIN
    facture_offre fo ON f.id = fo.facture_id
GROUP BY
    f.id, fo.tauxTVA_F;

/***************************************************************************************************************************************/
/* Modification de la table d'offre 
Exemple avec la modification du prix d'une des désignation*/
UPDATE offre SET prix = 60000 WHERE id=3;

/* J'ajoute une nouvelle commande */
START TRANSACTION;
INSERT INTO facture (dateFacturation, dateEcheance, client_id) VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1);
SET @facture_id = LAST_INSERT_ID();
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 1, designation, prix, tauxTVA FROM offre WHERE id = 3;
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 2, designation, prix, tauxTVA  FROM offre WHERE id = 1;
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 1, designation, prix, tauxTVA  FROM offre WHERE id = 4; 
INSERT INTO facture_offre (facture_id, offre_id, quantity, designation_F, prix_F, tauxTVA_F)
SELECT  @facture_id, id, 2, designation, prix, tauxTVA  FROM offre WHERE id = 2; 
COMMIT;

/* Je regénère les views : facture_totals et facture_tva_details */
DROP VIEW IF EXISTS facture_totals;
CREATE VIEW facture_totals AS
SELECT
    f.id AS facture_id,
    ROUND(SUM(fo.quantity * fo.prix_F),2) AS total_HT,
    ROUND(SUM(fo.quantity * fo.prix_F * fo.tauxTVA_F),2) AS total_TVA,
    ROUND(SUM(fo.quantity * fo.prix_F * (1 + fo.tauxTVA_F)),2) AS total_TTC
FROM
    facture f
JOIN
    facture_offre fo ON f.id = fo.facture_id
GROUP BY
    f.id;

DROP VIEW IF EXISTS facture_tva_details;
CREATE VIEW facture_tva_details AS
SELECT
    f.id AS facture_id,
    fo.tauxTVA_F,
    ROUND(SUM(fo.quantity * fo.prix_F * fo.tauxTVA_F), 2) AS total_TVA
FROM
    facture f
JOIN
    facture_offre fo ON f.id = fo.facture_id
GROUP BY
    f.id, fo.tauxTVA_F;