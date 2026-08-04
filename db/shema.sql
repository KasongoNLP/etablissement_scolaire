create database etablissement_scolaire;
use etablissement_scolaire;



CREATE TABLE ecoles (
    id_ecole INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(150),
    statut ENUM(
        'Active',
        'Suspendue',
        'En attente'
    ) DEFAULT 'En attente',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);








CREATE TABLE annees_scolaires (

    id_annee INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    libelle VARCHAR(20) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut ENUM(
        'Préparation',
        'Active',
        'Clôturée',
        'Archivée'
    ) DEFAULT 'Préparation',
    observation TEXT,
    cree_par INT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_annee_ecole
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
    ON DELETE CASCADE,

    CONSTRAINT fk_annee_utilisateur
    FOREIGN KEY(cree_par)
    REFERENCES utilisateurs(id_utilisateur),

    CONSTRAINT uk_annee_ecole
    UNIQUE(id_ecole, libelle)

);



/*une section (maternelle , primaire, secondaire, technique....) */
CREATE TABLE sections (
    id_section INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    statut ENUM(
        'Active',
        'Inactive'
    ) DEFAULT 'Active',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE sections
ADD COLUMN id_ecole INT NOT NULL AFTER id_section;


ALTER TABLE sections
ADD CONSTRAINT fk_section_ecole
FOREIGN KEY(id_ecole)
REFERENCES ecoles(id_ecole);




CREATE TABLE classes (
    id_classe INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    id_section INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    capacite INT DEFAULT 40,

    statut ENUM(
        'Active',
        'Inactive'
    ) DEFAULT 'Active',

    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,


    /* relation vers l'école */
    CONSTRAINT fk_classe_ecole
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
    ON DELETE CASCADE,


    /* relation vers la section */
    CONSTRAINT fk_classe_section
    FOREIGN KEY(id_section)
    REFERENCES sections(id_section)
    ON DELETE CASCADE,


    /* éviter deux fois la même classe dans une même école */
    CONSTRAINT uk_classe_ecole_nom
    UNIQUE(id_ecole, nom)

);

ALTER TABLE classes
ADD CONSTRAINT uk_classe_section_nom
UNIQUE(id_ecole, id_section, nom);



CREATE TABLE eleves (
    id_eleve INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    matricule VARCHAR(30) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    postnom VARCHAR(100),
    prenom VARCHAR(100),
    sexe ENUM('Masculin','Feminin') NOT NULL,
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    nationalite VARCHAR(100),
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(150),
    photo VARCHAR(255), /*chemin du fichier photo eleves.*/
    statut ENUM(
        'Actif', /*evolutif , si present*/
        'Inactif', /*evolutif , si abscent*/
        'Transfere', /*evolutif , si transferer*/
        'Abandon' /*evolutif , si abandon*/
    ) DEFAULT 'Actif',

    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_eleve_ecole
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
    ON DELETE CASCADE

);


/* Documents de l'élève */
CREATE TABLE documents_eleves (
    id_document INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    id_eleve INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,
    extension VARCHAR(20),
    mime_type VARCHAR(100),
    taille BIGINT,
    observation TEXT,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_document_ecole
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
    ON DELETE CASCADE,

    CONSTRAINT fk_document_eleve
    FOREIGN KEY(id_eleve)
    REFERENCES eleves(id_eleve)
    ON DELETE CASCADE

);



/* Inscription de l'élève */
CREATE TABLE inscriptions (

    id_inscription INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    id_eleve INT NOT NULL,
    id_classe INT NOT NULL,
    id_annee_scolaire INT NOT NULL,
    date_inscription DATE NOT NULL,
    numero_inscription VARCHAR(50),
    statut ENUM(
        'En attente',
        'Inscrit',
        'Suspendu',
        'Terminé',
        'Transféré',
        'Annulé'
    ) DEFAULT 'Inscrit',

    observation TEXT,
    cree_par INT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inscription_ecole
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
    ON DELETE CASCADE,

    CONSTRAINT fk_inscription_eleve
    FOREIGN KEY(id_eleve)
    REFERENCES eleves(id_eleve)
    ON DELETE CASCADE,

    CONSTRAINT fk_inscription_classe
    FOREIGN KEY(id_classe)
    REFERENCES classes(id_classe)
    ON DELETE CASCADE,

    CONSTRAINT fk_inscription_annee
    FOREIGN KEY(id_annee_scolaire)
    REFERENCES annees_scolaires(id_annee),

    CONSTRAINT fk_inscription_utilisateur
    FOREIGN KEY(cree_par)
    REFERENCES utilisateurs(id_utilisateur)

);




/* table parent information du parent*/
CREATE TABLE parents (
    id_parent INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    postnom VARCHAR(100),
    prenom VARCHAR(100),
    sexe ENUM(
        'Masculin',
        'Feminin'
    ),
    telephone_secondaire VARCHAR(20),
    adresse TEXT,
    profession VARCHAR(100),
    type_responsable ENUM(
        'Pere',
        'Mere',
        'Tuteur',
        'Autre'
    ) DEFAULT 'Autre',

    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_parent_utilisateur
    FOREIGN KEY(id_utilisateur)
    REFERENCES utilisateurs(id_utilisateur)
);



CREATE TABLE parent_eleve (
    id_parent_eleve INT AUTO_INCREMENT PRIMARY KEY,
    id_parent INT NOT NULL,
    id_eleve INT NOT NULL,
    lien ENUM(
        'Pere',
        'Mere',
        'Tuteur',
        'Autre'
    ) NOT NULL,
    responsable_principal BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_parent_relation
    FOREIGN KEY(id_parent)
    REFERENCES parents(id_parent),
    CONSTRAINT fk_eleve_relation
    FOREIGN KEY(id_eleve)
    REFERENCES eleves(id_eleve)

);



CREATE TABLE utilisateurs (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NULL,
    nom VARCHAR(100) NOT NULL,
    postnom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM(
        'SUPER_ADMIN',
        'ADMIN_ECOLE',
        'DIRECTION',
        'CAISSIER',
        'ENSEIGNANT',
        'PARENT'
    ) NOT NULL,
    statut ENUM(
        'Actif',
        'Bloque',
        'En attente'
    ) DEFAULT 'Actif',

    derniere_connexion DATETIME NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_utilisateur_ecole
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)

);




INSERT INTO utilisateurs
(
    id_ecole,
    nom,
    postnom,
    prenom,
    email,
    telephone,
    mot_de_passe,
    role
)
VALUES
(
    NULL,
    'r',
    'r',
    'r',
    'root@erp.com',
    'r',
    'r',
    'SUPER_ADMIN'
);










/*''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
CREATE TABLE paiements(
    id_paiement INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    id_eleve INT NOT NULL,
    id_eleve_frais INT NOT NULL,
    id_utilisateur INT NOT NULL,
    numero_recu VARCHAR(50) UNIQUE,
    montant DECIMAL(10,2) NOT NULL,
    devise ENUM(
        'USD',
        'CDF'

    ) NOT NULL,
    mode_paiement ENUM(
        'Espece',
        'Banque',
        'Mobile Money'

    ) DEFAULT 'Espece',
    observation TEXT,
    date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole),
    FOREIGN KEY(id_eleve)
    REFERENCES eleves(id_eleve),
    FOREIGN KEY(id_eleve_frais)
    REFERENCES eleve_frais(id_eleve_frais),
    FOREIGN KEY(id_utilisateur)
    REFERENCES utilisateurs(id_utilisateur)

);




CREATE TABLE types_frais(
    id_type_frais INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
);



CREATE TABLE configuration_frais(
    id_configuration INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    id_type_frais INT NOT NULL,
    id_classe INT NOT NULL,
    id_annee_scolaire INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    devise ENUM('USD','CDF') NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole),

    FOREIGN KEY(id_type_frais)
    REFERENCES types_frais(id_type_frais),

    FOREIGN KEY(id_classe)
    REFERENCES classes(id_classe),

    FOREIGN KEY(id_annee_scolaire)
    REFERENCES annees_scolaires(id_annee_scolaire)

);








CREATE TABLE eleve_frais(
    id_eleve_frais INT AUTO_INCREMENT PRIMARY KEY,

    id_eleve INT NOT NULL,
    id_configuration INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    reduction DECIMAL(10,2) DEFAULT 0,
    penalite DECIMAL(10,2) DEFAULT 0,
    montant_paye DECIMAL(10,2) DEFAULT 0,
    montant_restant DECIMAL(10,2) NOT NULL,
    statut ENUM(
        'Non payé',
        'Partiel',
        'Payé'
    ) DEFAULT 'Non payé',



    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(id_eleve)
    REFERENCES eleves(id_eleve),

    FOREIGN KEY(id_configuration)
    REFERENCES configuration_frais(id_configuration)

);








CREATE TABLE reductions(
    id_reduction INT AUTO_INCREMENT PRIMARY KEY,

    id_ecole INT NOT NULL,
    nom VARCHAR(100),
    type ENUM(
        'Montant',
        'Pourcentage'
    ),

    valeur DECIMAL(10,2),
    actif BOOLEAN DEFAULT TRUE,

    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
);



CREATE TABLE penalites(

    id_penalite INT AUTO_INCREMENT PRIMARY KEY,

    id_ecole INT NOT NULL,

    nom VARCHAR(100),

    type ENUM(

        'Montant',
        'Pourcentage'

    ),

    valeur DECIMAL(10,2),
    actif BOOLEAN DEFAULT TRUE,
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)

);



CREATE TABLE recus(
    id_recu INT AUTO_INCREMENT PRIMARY KEY,
    id_paiement INT NOT NULL,
    numero_recu VARCHAR(50) UNIQUE,
    type ENUM(

        'Original',
        'Duplicata'

    ) DEFAULT 'Original',

    date_impression DATETIME DEFAULT CURRENT_TIMESTAMP,
    imprime_par INT,

    FOREIGN KEY(id_paiement)
    REFERENCES paiements(id_paiement),

    FOREIGN KEY(imprime_par)
    REFERENCES utilisateurs(id_utilisateur)

);

/*''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/





iNSERT INTO annees_scolaires
(
    id_ecole,
    libelle,
    date_debut,
    date_fin,
    statut,
    observation,
    cree_par
)
VALUES
(
    6,
    '2026-2027',
    '2026-09-01',
    '2027-07-15',
    'Active',
    'Année scolaire 2026-2027',
    4
);









CREATE TABLE configuration_matricules (
    id_configuration INT AUTO_INCREMENT PRIMARY KEY,
    id_ecole INT NOT NULL,
    nom_configuration VARCHAR(100) NOT NULL,
    format_matricule VARCHAR(255) NOT NULL,
    longueur_numero INT DEFAULT 4,
    compteur INT DEFAULT 0,
    separateur VARCHAR(5) DEFAULT '-',
    utiliser_annee BOOLEAN DEFAULT TRUE,
    utiliser_section BOOLEAN DEFAULT TRUE,
    utiliser_classe BOOLEAN DEFAULT FALSE,
    prefixe VARCHAR(50),
    statut ENUM(
        'Active',
        'Inactive'
    ) DEFAULT 'Active',



    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_config_matricule_ecole
    FOREIGN KEY(id_ecole)
    REFERENCES ecoles(id_ecole)
    ON DELETE CASCADE

);



docker exec -i ecole_mariadb mariadb -u root etablissement_scolaire < ./db/etablissement_scolaire.sql
docker exec -it ecole_mariadb mariadb -u root


docker compose down
docker compose build --no-cache
docker compose up -d


/*verification de la base de donnée*/
docker exec -it ecole_mariadb mariadb -u root


/*exporter la base de donné*/
mysqldump -u root -p etablissement_scolaire > etablissement_scolaire.sql


/*.....................................................................................................................*/
/* Creation de la base de donnée avant import */
CREATE DATABASE etablissement_scolaire;
EXIT;
docker exec -i ecole_mariadb mariadb -u root etablissement_scolaire < ~/work/etablissement_scolaire/db/etablissement_scolaire.sql