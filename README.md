# TestOkayo
Pour rendre plus agréable à la lecture, passer en mode Code le texte ! 

 REPRISE INTITULE DE L'EXERCICE - 1ère Partie

Les “désignations” correspondent à un panel de prestations fournies par la société Okayo, qui font partie d’un
catalogue donné (l’”offre” Okayo), qui les facture à ses clients. (on peut ignorer les quantité = “-1”).
    • P.U HT : prix unitaire hors taxe
    • Qté : quantité
    • TTC = HT x (1+TVA)
Dans un premier temps, nous vous invitons à décrire le modèle de données relationnel qui serait lié à la gestion
de cette fonctionnalité. Il s’agit d’une part de stocker cette facture, mais aussi, dans le traitement de création
de celle-ci de faire appel à des paramètres qui seraient préalablement stockés (taux de TVA sur une période
donnée, base client, base catalogue des éléments désignés en ligne sur les factures, …) Vous pouvez fixer des
hypothèses sur le fonctionnement du système. Une fois celles-ci explicitées, votre solution les traitera en
intégralité. Nous attirons l’attention sur le fait que :
    • Une fois la facture établie à une date donnée, et à chaque consultation, le TTC devra être
    systématiquement le même, indépendamment des évolutions de tarif des produits du catalogue.
    • Les noms et les prix des prestations pourront éventuellement évoluer dans le catalogue, mais doivent
    être évidemment rester inchangés sur les factures déjà existantes
    • La TVA peut changer au fur et à mesure du temps et peut être différente pour chaque produit du catalogue. Il est possible que celle-ci doive évoluer à une date précise ou pour une période donnée.

********************************************************************************************************************
 REPONSE
J'ai donc créé une database contenant plusieurs tables :
    • la table offre contenant les différentes préstations proposées par Okayo ;
    • la table client contenant la liste des clients ainsi que leurs informations de contact ;
    • la table fournisseur contenant les informations relative à Okayo : informations de contact et de compte en banque ;
    • la table facture permettant de créer des factures ;
    • la table facture_offre qui permet de préciser quelles offres ont été choisi par le client pour une facture ;donnée, ainsi que les prix, designations et TVA de ces offres à l'instant de création de la facture.

Il y ait également disponible deux views : 
 • facture_totals ;
 • facture_tva_details 
qui permettent respectivement d'obtenir les statistiques global et les statistiques par taux de TVA de la facture.

********************************************************************************************************************
********************************************************************************************************************
 REPRISE INTITULE DE L'EXERCICE - 2nde Partie

Dans un second temps, nous vous proposons de développer une petite application (que vous pourrez nous livrer
sur bitbucket ou github par exemple), qui pourra prendre la forme d’une API (ou toute autre forme selon vos
souhaits et envies) permettant à une application tierce ou à un utilisateur d’appeler les fonctionnalités de l’API
que vous avez décrites ci-avant. N’hésitez pas à montrer d’éventuelles possibilités d’évolutions, d’autres
fonctionnalités possibles, par une documentation, des commentaires dans le code, ou une éventuelle
présentation orale.
Cette application devra effectuer a minima les fonctionnalités décrites dans la partie précédente. 

********************************************************************************************************************
 REPONSE

Prérequis NodeJS
    npm init -y
    npm install express mysql2

Utilisation des fonctionnalités
    Lancer un terminal dans le dossier où se trouve l'API.
    Taper la commande suivante :
    node API_okayo.js

    Fonctionnalité d'ajout de facture avec offres
        Utilisation de :
            curl -X POST \
            http://localhost:3000/factures \
            -H 'Content-Type: application/json' \
            -d  @AddFacture_Offre.json
        avec le AddFacture_Offre.json de la forme suivante 
        pour une facture contenant deux offres :
        /!\ La TVA doit être informé en proportion de 0 à 1 et non en pourcentage de 0 à 100%
        {
            "dateFacturation": "AAAA-MM-JJ",
            "dateEcheance": "AAAA-MM-JJ",
            "client_id": id du client, 
            "offers": [
            {
                "offre_id": id de l'offre,
                "quantity": quantité souhaitée,
                "designation_F": "Mon produit ?",
                "prix_F": ?,
                "tauxTVA_F": ?
                },
            {
                "offre_id": 4,
                "quantity": 1,
                "designation_F": "Mon produit ?",
                "prix_F": ?,
                "tauxTVA_F": ?
                }
            ] 
        }
        Amélioration à prévoir :
        - faire en sorte que l'offre_id soit utilisé pour aller cherché directement les informations de l'offre ayant l'id choisi => limitation d'erreur, lié à la saisie
        - faire en sorte que l'offre_designation soit utilisé plutôt que l'id => plus facile quand utilisation
        sur une interface graphique ou application web (valable pour toutes les fonctionnalités suivantes)

    Fonctionnalité d'ajout d'un client
        Utilisation de :
            curl -X POST \
            http://localhost:3000/clients \
            -H 'Content-Type: application/json' \
            -d  @AddClient.json
        avec un fichier AddClient.json de la forme suivante :
        Exemple
            {
                "nomEntreprise": "Martin",
                "rue": "123 rue Victor Hugo",
                "codePostal": "75001",
                "ville": "Paris"
            }
    Fonctionnalité d'ajout d'une offre
        Utilisation de :
            curl -X POST \
            http://localhost:3000/offers \
            -H 'Content-Type: application/json' \
            -d  @AddOffre.json
        avec un fichier AddOffre.json de la forme suivante :
            {
                "designation": "Mon produit E",
                "prix": 5000,
                "tauxTVA": 0.2
            }
    
    Fonctionnalité de synthèse d'une facture
    Cette synthèse pour une facture donnée contient :
    - la facture total ;
    - le détails des TVA ;
    - le détails des offres de la facture.
    On obtient ce détail avec la ligne de commande suivante : 
        curl -X GET http://localhost:3000/factures/?/details
    Ou ? = facture_id
    Le résultat s'affiche sous forme de tableau dans la DEBUG CONSOLE.

    Fonctionnalité de modification d'une offre
        Utilisation de :
            curl -X PUT \
            http://localhost:3000/offres/? \   ?=id
            -H 'Content-Type: application/json' \
            -d  @ModifyOffre.json
        avec un fichier ModifyOffre.json de la forme suivante :
            {
                "designation": "Mon produit E",
                "prix": 5000,
                "tauxTVA": 0.2
            }

    Fonctionnalité de modification d'un client
        Utilisation de :
            curl -X PUT \
            http://localhost:3000/clients/? \   ?=id
            -H 'Content-Type: application/json' \
            -d  @ModifyClient.json
        avec un fichier ModifyClient.json de la forme suivante :
        Exemple
            {
                "nomEntreprise": "Martin",
                "rue": "123 rue Victor Hugo",
                "codePostal": "75015",
                "ville": "Paris"
            }
    
    Fonctionnalité de modification d'un fournisseur
        Utilisation de :
            curl -X PUT \
            http://localhost:3000/fournisseurs/1 \
            -H 'Content-Type: application/json' \
            -d  @ModifyFournisseur.json
        avec un fichier ModifyFournisseur.json de la forme suivante :
        Exemple
            {
                "rue": "35 Rue du Général Foy",
                "codePostal": "75008",
                "ville": "Paris",
                "tel": "0180886300",
                "siteWeb": "www.okayo.fr",
                "domiciliation": "BRED",
                "nomProp": "OKAYO SAS",
                "IBAN": "FR76 0000 0000 0000 0000 0000 097",
                "BIC_SWIFT": "BREDFRPPXXX"
            }
