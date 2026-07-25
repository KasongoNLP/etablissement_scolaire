-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: etablissement_scolaire
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `annees_scolaires`
--

DROP TABLE IF EXISTS `annees_scolaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `annees_scolaires` (
  `id_annee` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) NOT NULL,
  `libelle` varchar(20) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` enum('Préparation','Active','Clôturée','Archivée') DEFAULT 'Préparation',
  `observation` text DEFAULT NULL,
  `cree_par` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_annee`),
  UNIQUE KEY `uk_annee_ecole` (`id_ecole`,`libelle`),
  KEY `fk_annee_utilisateur` (`cree_par`),
  CONSTRAINT `fk_annee_ecole` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`) ON DELETE CASCADE,
  CONSTRAINT `fk_annee_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annees_scolaires`
--

LOCK TABLES `annees_scolaires` WRITE;
/*!40000 ALTER TABLE `annees_scolaires` DISABLE KEYS */;
INSERT INTO `annees_scolaires` VALUES (3,1,'2026-2027','2026-09-01','2027-07-15','Active','Année scolaire 2026-2027',4,'2026-07-22 15:32:42','2026-07-22 15:32:42'),(4,6,'2026-2027','2026-09-01','2027-07-15','Active','Année scolaire 2026-2027',4,'2026-07-22 15:41:11','2026-07-22 15:41:11');
/*!40000 ALTER TABLE `annees_scolaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classes` (
  `id_classe` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) NOT NULL,
  `id_section` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `capacite` int(11) DEFAULT 40,
  `statut` enum('Active','Inactive') DEFAULT 'Active',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_desactivation` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_classe`),
  UNIQUE KEY `uk_classe_section_nom` (`id_ecole`,`id_section`,`nom`),
  KEY `fk_classe_section` (`id_section`),
  KEY `idx_classes_ecole` (`id_ecole`),
  CONSTRAINT `fk_classe_ecole` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`) ON DELETE CASCADE,
  CONSTRAINT `fk_classe_section` FOREIGN KEY (`id_section`) REFERENCES `sections` (`id_section`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (18,6,32,'1eme A',50,'Active','2026-07-20 16:08:53','2026-07-22 13:33:26','2026-07-22 13:33:12'),(19,6,32,'1eme B',50,'Active','2026-07-20 16:09:19','2026-07-21 11:46:19','2026-07-21 11:45:59'),(20,6,32,'1eme C',40,'Active','2026-07-20 16:09:38','2026-07-21 11:46:19','2026-07-21 11:46:00'),(21,6,33,'1eme A',40,'Active','2026-07-20 16:10:32','2026-07-22 13:33:26','2026-07-22 13:33:15');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_matricules`
--

DROP TABLE IF EXISTS `configuration_matricules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configuration_matricules` (
  `id_configuration` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) NOT NULL,
  `nom_configuration` varchar(100) NOT NULL,
  `format_matricule` varchar(255) NOT NULL,
  `longueur_numero` int(11) DEFAULT 4,
  `compteur` int(11) DEFAULT 0,
  `separateur` varchar(5) DEFAULT '-',
  `utiliser_annee` tinyint(1) DEFAULT 1,
  `utiliser_section` tinyint(1) DEFAULT 1,
  `utiliser_classe` tinyint(1) DEFAULT 0,
  `prefixe` varchar(50) DEFAULT NULL,
  `statut` enum('Active','Inactive') DEFAULT 'Active',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_configuration`),
  KEY `fk_config_matricule_ecole` (`id_ecole`),
  CONSTRAINT `fk_config_matricule_ecole` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_matricules`
--

LOCK TABLES `configuration_matricules` WRITE;
/*!40000 ALTER TABLE `configuration_matricules` DISABLE KEYS */;
INSERT INTO `configuration_matricules` VALUES (1,1,'Matricule standard élève','{PREFIXE}-{SECTION}-{ANNEE}-{NUMERO}',4,0,'-',1,1,0,'ELV','Active','2026-07-22 16:19:23','2026-07-22 16:19:23'),(2,6,'Matricule standard élève','{PREFIXE}-{SECTION}-{ANNEE}-{NUMERO}',4,0,'-',1,1,0,'ELV','Active','2026-07-22 17:10:48','2026-07-22 17:10:48');
/*!40000 ALTER TABLE `configuration_matricules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents_eleves`
--

DROP TABLE IF EXISTS `documents_eleves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents_eleves` (
  `id_document` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) NOT NULL,
  `id_eleve` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `nom_fichier` varchar(255) NOT NULL,
  `chemin_fichier` varchar(500) NOT NULL,
  `extension` varchar(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `taille` bigint(20) DEFAULT NULL,
  `observation` text DEFAULT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_document`),
  KEY `fk_document_ecole` (`id_ecole`),
  KEY `fk_document_eleve` (`id_eleve`),
  CONSTRAINT `fk_document_ecole` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`) ON DELETE CASCADE,
  CONSTRAINT `fk_document_eleve` FOREIGN KEY (`id_eleve`) REFERENCES `eleves` (`id_eleve`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents_eleves`
--

LOCK TABLES `documents_eleves` WRITE;
/*!40000 ALTER TABLE `documents_eleves` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents_eleves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ecoles`
--

DROP TABLE IF EXISTS `ecoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ecoles` (
  `id_ecole` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(150) NOT NULL,
  `adresse` text DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `statut` enum('Active','Suspendue') DEFAULT 'Active',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_ecole`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecoles`
--

LOCK TABLES `ecoles` WRITE;
/*!40000 ALTER TABLE `ecoles` DISABLE KEYS */;
INSERT INTO `ecoles` VALUES (1,'Institut Lumière','Lubumbashi, Haut-Katanga','+243970000001','contact@institutlumiere.com','Active','2026-07-15 19:42:38'),(2,'Koa','je suis steve','+243 981307079','g@jjj.com','','2026-07-16 16:59:20'),(3,'KCC','peut','+243 971653039','ngoykasongosteve@gmail.com','','2026-07-16 17:00:23'),(4,'kamos','jj','2333','i@dkjshd.cpm','','2026-07-16 17:04:56'),(5,'O','D','234','SFDD@JHKKZ','','2026-07-16 17:05:46'),(6,'Complexe Scolaire la Lumiere','je ne sais pas','2345678876','n@d','Active','2026-07-17 19:20:34');
/*!40000 ALTER TABLE `ecoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eleves`
--

DROP TABLE IF EXISTS `eleves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eleves` (
  `id_eleve` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) NOT NULL,
  `matricule` varchar(30) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `postnom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `sexe` enum('Masculin','Feminin') NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `lieu_naissance` varchar(100) DEFAULT NULL,
  `nationalite` varchar(100) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `statut` enum('Actif','Inactif','Transfere','Abandon') DEFAULT 'Actif',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_eleve`),
  UNIQUE KEY `matricule` (`matricule`),
  KEY `fk_eleve_ecole` (`id_ecole`),
  CONSTRAINT `fk_eleve_ecole` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eleves`
--

LOCK TABLES `eleves` WRITE;
/*!40000 ALTER TABLE `eleves` DISABLE KEYS */;
INSERT INTO `eleves` VALUES (1,6,'ELV-GEN-2026-0001','s','s','s','Feminin','2026-07-31','s','s',NULL,'s',NULL,'1784965277864.png','Actif','2026-07-25 07:41:17','2026-07-25 07:41:17'),(3,6,'345678','steve','steve','steve','Masculin','2026-07-25','kakaka','puku',NULL,'5432',NULL,'1784965709768.jpg','Actif','2026-07-25 07:48:29','2026-07-25 07:48:29'),(7,6,'sssssssssss','steve','steve','stebe','Feminin','0000-00-00','s','s',NULL,'ssss',NULL,NULL,'Actif','2026-07-25 10:41:49','2026-07-25 10:41:49'),(9,6,'98765','denfo','bref','beeeeeeeee','Masculin','2026-07-25','lubu,bahi','congolais',NULL,'09874477',NULL,NULL,'Actif','2026-07-25 11:41:59','2026-07-25 11:41:59'),(11,6,'987656','denfo','bref','beeeeeeeee','Masculin','2026-07-25','lubu,bahi','congolais',NULL,'09874477',NULL,'uploads/eleves/1784979759596.jpg','Actif','2026-07-25 11:42:39','2026-07-25 11:42:39'),(17,6,'0987653456rs','drs','drs','drs','Feminin','2026-08-01','drs','drs',NULL,'drs',NULL,NULL,'Actif','2026-07-25 12:33:20','2026-07-25 12:33:20');
/*!40000 ALTER TABLE `eleves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscriptions`
--

DROP TABLE IF EXISTS `inscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inscriptions` (
  `id_inscription` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) NOT NULL,
  `id_eleve` int(11) NOT NULL,
  `id_classe` int(11) NOT NULL,
  `id_annee_scolaire` int(11) NOT NULL,
  `date_inscription` date NOT NULL,
  `numero_inscription` varchar(50) DEFAULT NULL,
  `statut` enum('En attente','Inscrit','Suspendu','Terminé','Transféré','Annulé') DEFAULT 'Inscrit',
  `observation` text DEFAULT NULL,
  `cree_par` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_inscription`),
  KEY `fk_inscription_ecole` (`id_ecole`),
  KEY `fk_inscription_eleve` (`id_eleve`),
  KEY `fk_inscription_classe` (`id_classe`),
  KEY `fk_inscription_annee` (`id_annee_scolaire`),
  KEY `fk_inscription_utilisateur` (`cree_par`),
  CONSTRAINT `fk_inscription_annee` FOREIGN KEY (`id_annee_scolaire`) REFERENCES `annees_scolaires` (`id_annee`),
  CONSTRAINT `fk_inscription_classe` FOREIGN KEY (`id_classe`) REFERENCES `classes` (`id_classe`) ON DELETE CASCADE,
  CONSTRAINT `fk_inscription_ecole` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`) ON DELETE CASCADE,
  CONSTRAINT `fk_inscription_eleve` FOREIGN KEY (`id_eleve`) REFERENCES `eleves` (`id_eleve`) ON DELETE CASCADE,
  CONSTRAINT `fk_inscription_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscriptions`
--

LOCK TABLES `inscriptions` WRITE;
/*!40000 ALTER TABLE `inscriptions` DISABLE KEYS */;
INSERT INTO `inscriptions` VALUES (1,6,1,18,4,'2026-07-25','s','Inscrit','                    ',NULL,'2026-07-25 07:41:17','2026-07-25 07:41:17'),(2,6,3,21,4,'2026-07-26','56','Inscrit','                    HJKL',NULL,'2026-07-25 07:48:29','2026-07-25 07:48:29'),(3,6,7,21,4,'2026-07-25','ssss','Inscrit','                    sssss',NULL,'2026-07-25 10:41:49','2026-07-25 10:41:49'),(4,6,9,20,4,'2026-07-26','2','Inscrit','                    ',NULL,'2026-07-25 11:41:59','2026-07-25 11:41:59'),(5,6,11,20,4,'2026-07-26','2','Inscrit','                    ',NULL,'2026-07-25 11:42:39','2026-07-25 11:42:39'),(6,6,17,21,4,'2026-07-24','2rss','Inscrit','                    ',NULL,'2026-07-25 12:33:20','2026-07-25 12:33:20');
/*!40000 ALTER TABLE `inscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_eleve`
--

DROP TABLE IF EXISTS `parent_eleve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parent_eleve` (
  `id_parent_eleve` int(11) NOT NULL AUTO_INCREMENT,
  `id_parent` int(11) NOT NULL,
  `id_eleve` int(11) NOT NULL,
  `lien` enum('Pere','Mere','Tuteur','Autre') NOT NULL,
  `responsable_principal` tinyint(1) DEFAULT 0,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_parent_eleve`),
  KEY `fk_parent_relation` (`id_parent`),
  KEY `fk_eleve_relation` (`id_eleve`),
  CONSTRAINT `fk_eleve_relation` FOREIGN KEY (`id_eleve`) REFERENCES `eleves` (`id_eleve`),
  CONSTRAINT `fk_parent_relation` FOREIGN KEY (`id_parent`) REFERENCES `parents` (`id_parent`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_eleve`
--

LOCK TABLES `parent_eleve` WRITE;
/*!40000 ALTER TABLE `parent_eleve` DISABLE KEYS */;
INSERT INTO `parent_eleve` VALUES (1,2,1,'Mere',1,'2026-07-25 07:41:17'),(2,4,3,'Tuteur',1,'2026-07-25 07:48:29'),(3,8,7,'Mere',1,'2026-07-25 10:41:49'),(4,8,9,'Autre',1,'2026-07-25 11:41:59'),(5,8,11,'Autre',1,'2026-07-25 11:42:39'),(11,14,17,'Mere',1,'2026-07-25 12:33:20');
/*!40000 ALTER TABLE `parent_eleve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parents`
--

DROP TABLE IF EXISTS `parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parents` (
  `id_parent` int(11) NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `postnom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `sexe` enum('Masculin','Feminin') DEFAULT NULL,
  `telephone_secondaire` varchar(20) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `type_responsable` enum('Pere','Mere','Tuteur','Autre') DEFAULT 'Autre',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_parent`),
  UNIQUE KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `fk_parent_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parents`
--

LOCK TABLES `parents` WRITE;
/*!40000 ALTER TABLE `parents` DISABLE KEYS */;
INSERT INTO `parents` VALUES (2,10,'2','2','2','Feminin','2',NULL,'3','Autre','2026-07-25 07:41:17','2026-07-25 07:41:17'),(4,13,'O','0','0','Masculin','09',NULL,'9','Autre','2026-07-25 07:48:29','2026-07-25 07:48:29'),(8,17,'ssssss','sssss','sssss','Feminin','ssssss',NULL,'ssssss','Autre','2026-07-25 10:41:49','2026-07-25 10:41:49'),(14,43,'FRANCKoJrs','KASAors','SArs','Masculin',NULL,NULL,'ddhrs','Mere','2026-07-25 12:33:20','2026-07-25 12:33:20');
/*!40000 ALTER TABLE `parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sections` (
  `id_section` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `statut` enum('Active','Inactive') DEFAULT 'Active',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_section`),
  UNIQUE KEY `uk_sections_ecole_nom` (`id_ecole`,`nom`),
  CONSTRAINT `fk_sections_ecoles` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES (29,6,'primaire','primaire','Active','2026-07-20 13:55:17','2026-07-20 16:04:19'),(30,5,'secondaire','secondaire','Active','2026-07-20 13:56:37','2026-07-20 13:56:37'),(31,4,'maternelle','maternelle','Active','2026-07-20 13:57:39','2026-07-20 13:57:39'),(32,6,'Pre-maternelle','Pre-maternelle','Active','2026-07-20 16:02:23','2026-07-20 16:04:21'),(33,6,'maternelle','maternelle','Active','2026-07-20 16:02:43','2026-07-20 16:04:24'),(34,6,'secondaire',NULL,'Active','2026-07-20 16:02:58','2026-07-20 16:04:16'),(35,6,'PR','K','Active','2026-07-24 16:55:35','2026-07-24 16:55:35');
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateurs` (
  `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT,
  `id_ecole` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `postnom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('SUPER_ADMIN','ADMIN_ECOLE','DIRECTION','CAISSIER','ENSEIGNANT','PARENT') NOT NULL,
  `statut` enum('Actif','Bloque','En attente') DEFAULT 'Actif',
  `derniere_connexion` datetime DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telephone` (`telephone`),
  KEY `fk_utilisateur_ecole` (`id_ecole`),
  CONSTRAINT `fk_utilisateur_ecole` FOREIGN KEY (`id_ecole`) REFERENCES `ecoles` (`id_ecole`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES (3,NULL,'r','r','r','root@erp.com','r','r','SUPER_ADMIN','Actif',NULL,'2026-07-19 10:14:07','2026-07-19 10:14:07'),(4,6,'a','a','a','a@a','a','a','CAISSIER','Actif',NULL,'2026-07-19 10:15:17','2026-07-19 10:15:17'),(5,5,'b','b','b','b@b','b','b','CAISSIER','Actif',NULL,'2026-07-19 10:15:56','2026-07-19 10:15:56'),(6,4,'c','c','c','c@c','c','c','CAISSIER','Actif',NULL,'2026-07-19 10:16:24','2026-07-19 10:16:24'),(7,3,'d','d','d','d@d','d','d','CAISSIER','Actif',NULL,'2026-07-19 10:16:53','2026-07-19 10:16:53'),(8,6,'n','n','n','n@n','n','n','CAISSIER','Actif',NULL,'2026-07-20 05:59:07','2026-07-20 05:59:07'),(10,6,'2','2','2','parent@gmail.com','2','123456','PARENT','Actif',NULL,'2026-07-25 07:41:17','2026-07-25 07:41:17'),(13,6,'O','0','0','parent1784965709786@gmail.com','09','123456','PARENT','Actif',NULL,'2026-07-25 07:48:29','2026-07-25 07:48:29'),(17,6,'ssssss','sssss','sssss','parent1784976109677@gmail.com','ssssss','123456','PARENT','Actif',NULL,'2026-07-25 10:41:49','2026-07-25 10:41:49'),(32,6,'FRANCK','KASA','SA',NULL,'ddd','1234','PARENT','Actif',NULL,'2026-07-25 12:01:03','2026-07-25 12:01:03'),(43,6,'FRANCKoJrs','KASAors','SArs',NULL,'dddkHrs','1234','PARENT','Actif',NULL,'2026-07-25 12:33:20','2026-07-25 12:33:20');
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-25 14:49:37
