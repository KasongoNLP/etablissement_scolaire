const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const multer = require("multer");
const fs = require("fs");


const app = express();


// ======================
// CONFIGURATION GENERALE
// ======================

app.use(cors());
app.use(express.json());



// ======================
// GESTION DES CHEMINS
// ======================

// Racine du projet
const ROOT_DIR = path.join(__dirname, "../");
// Dossier interface
const INTERFACE_DIR = path.join(ROOT_DIR, "interface");



// ======================
// DOSSIER PHOTOS ELEVES
// ======================

const DOSSIER_PHOTOS = path.join(ROOT_DIR, "uploads", "eleves");
if (!fs.existsSync(DOSSIER_PHOTOS)) {

    fs.mkdirSync(DOSSIER_PHOTOS, {
        recursive: true
    });

}



const stockage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DOSSIER_PHOTOS);
    },

    filename: (req, file, cb) => {

        const extension = path.extname(file.originalname);

        const nomFichier =
            Date.now() +
            extension;

        cb(null, nomFichier);

    }
});

const upload = multer({
    storage: stockage
});


console.log("Racine projet :", ROOT_DIR);
console.log("Interface :", INTERFACE_DIR);


// Servir le frontend
app.use(express.static(INTERFACE_DIR));



// ======================
// CONNEXION MARIA DB
// ======================

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "etablissement_scolaire"

});



db.connect((err)=>{

    if(err){

        console.error(
            "Erreur connexion MariaDB :",
            err
        );

        return;

    }


    console.log("Connecté à MariaDB.");

});






// ======================
// AUTHENTIFICATION
// ======================

app.post("/auth/login", (req, res) => {

    const {
        telephone,
        mot_de_passe
    } = req.body;

    const sql = `
        SELECT
            u.id_utilisateur,
            u.id_ecole,
            u.nom,
            u.postnom,
            u.prenom,
            u.role,
            e.nom AS nom_ecole
        FROM utilisateurs u
        LEFT JOIN ecoles e
            ON u.id_ecole = e.id_ecole
        WHERE u.telephone = ?
        AND u.mot_de_passe = ?
        AND u.statut = 'Actif'
        LIMIT 1
    `;

    db.query(
        sql,
        [
            telephone,
            mot_de_passe
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Erreur serveur."
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Téléphone ou mot de passe incorrect."
                });
            }

            res.json({
                success: true,
                utilisateur: result[0]
            });

        }
    );

});




// ======================
// CREATION D'UNE ECOLE
// ======================
app.post("/ecoles", (req, res) => {
    const {
        nom,
        adresse,
        telephone,
        email
    } = req.body;


    // Vérification
    if (!nom) {

        return res.status(400).json({

            success: false,
            message: "Le nom de l'école est obligatoire."

        });

    }


    const sql = `
        INSERT INTO ecoles (
            nom,
            adresse,
            telephone,
            email
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nom,
            adresse,
            telephone,
            email
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Erreur lors de la création de l'école."
                });
            }
            res.json({
                success: true,
                message: "École créée avec succès.",
                id_ecole: result.insertId
            });
        }
    );
});

//route pour lister toutes les écoles
// ======================
// LISTE DES ECOLES
// ======================

app.get("/ecoles/liste", (req,res)=>{

    const sql = `
        SELECT
            id_ecole,
            nom,
            adresse,
            telephone,
            email,
            statut,
            date_creation
        FROM ecoles
        ORDER BY date_creation DESC LIMIT 20
    `;


    db.query(sql,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({
                success:false,
                message:"Erreur récupération écoles"
            });
        }

        res.json({
            success:true,
            ecoles:result
        });
    });
});











// ======================
// COMPTER LES ECOLES
// ======================

app.get("/ecoles/count", (req,res)=>{
    const sql = `
        SELECT COUNT(*) AS total
        FROM ecoles
    `;
    db.query(sql,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({
                success:false,
                message:"Erreur lors du comptage des écoles."
            });
        }

        res.json({
            success:true,
            total: result[0].total
        });

    });

});



// ======================
// COMPTER LES ECOLES Active
// ======================

app.get("/ecoles/Active", (req,res)=>{
    const sql = `
        SELECT COUNT(*) AS total
        FROM ecoles WHERE statut='Active'
    `;
    db.query(sql,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({
                success:false,
                message:"Erreur lors du comptage des écoles."
            });
        }

        res.json({
            success:true,
            total: result[0].total
        });

    });

});


// ======================
// COMPTER LES ECOLES Suspendues
// ======================

app.get("/ecoles/suspendue", (req,res)=>{
    const sql = `
        SELECT COUNT(*) AS total
        FROM ecoles WHERE statut='Suspendue'
    `;
    db.query(sql,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({
                success:false,
                message:"Erreur lors du comptage des écoles."
            });
        }

        res.json({
            success:true,
            total: result[0].total
        });

    });

});





app.post("/utilisateurs/creer", (req, res) => {

    const {
        id_ecole,
        nom,
        postnom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        role

    } = req.body;


    const sql = `
        INSERT INTO utilisateurs(
            id_ecole,
            nom,
            postnom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            role
        )
        VALUES(?,?,?,?,?,?,?,?)
    `;


    db.query(

        sql,

        [

            id_ecole,
            nom,
            postnom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            role

        ],

        (err, result)=>{
            if(err){
                console.error(err);
                return res.status(500).json({
                    success:false,
                    message:"Impossible de créer l'utilisateur."
                });
            }
            res.json({
                success:true,
                message:"Utilisateur créé avec succès.",
                id_utilisateur:result.insertId
            });
        }
    );
});





// =====================================
// LISTE DES UTILISATEURS
// =====================================

app.get("/utilisateurs/liste", (req,res)=>{


    const sql = `
        SELECT

            u.id_utilisateur,
            u.id_ecole,

            u.nom,
            u.postnom,
            u.prenom,

            u.email,
            u.telephone,

            u.role,
            u.statut,

            u.derniere_connexion,
            u.date_creation,

            e.nom AS nom_ecole


        FROM utilisateurs u
        LEFT JOIN ecoles e
        ON u.id_ecole = e.id_ecole
        ORDER BY u.date_creation DESC
    `;



    db.query(sql,(err,result)=>{
        if(err){

            console.error(
                "Erreur récupération utilisateurs :",
                err
            );

            return res.status(500).json({
                success:false,
                message:"Erreur récupération utilisateurs."
            });
        }



        res.json({

            success:true,
            utilisateurs:result
        });
    });

});




// =====================================
// AJOUTER UNE SECTION
// =====================================

// Ajouter une section
app.post("/sections", (req, res) => {

    const {
        id_ecole,
        nom,
        description
    } = req.body;


    // Vérifications
    if (!id_ecole) {

        return res.status(400).json({
            success: false,
            message: "École invalide."
        });

    }


    if (!nom || nom.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Le nom de la section est obligatoire."
        });

    }


    const sql = `

        INSERT INTO sections
        (
            id_ecole,
            nom,
            description
        )

        VALUES
        (?, ?, ?)

    `;


    db.query(

        sql,

        [
            parseInt(id_ecole),
            nom.trim(),
            description ? description.trim() : null
        ],

        (err, result) => {

            if (err) {

                console.error("Erreur ajout section :", err);

                if (err.code === "ER_DUP_ENTRY") {

                    return res.status(400).json({

                        success: false,

                        message: "Cette section existe déjà dans cette école."

                    });

                }

                if (err.code === "ER_NO_REFERENCED_ROW_2") {

                    return res.status(400).json({

                        success: false,

                        message: "L'école indiquée n'existe pas."

                    });

                }

                return res.status(500).json({

                    success: false,

                    message: "Erreur interne du serveur."

                });

            }


            res.status(201).json({

                success: true,

                message: "Section créée avec succès.",

                id_section: result.insertId

            });

        }

    );

});









app.get("/sections/liste/:id_ecole", (req, res) => {

    const id_ecole = req.params.id_ecole;

    const sql = `
        SELECT
            id_section,
            nom,
            description,
            statut,
            date_creation
        FROM sections
        WHERE id_ecole = ?
        ORDER BY nom ASC
    `;

    db.query(sql, [id_ecole], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Erreur lors du chargement des sections."
            });

        }

        res.json({
            success: true,
            sections: result
        });

    });

});














app.put("/sections/changer-statut/:id", (req, res) => {

    const idSection = req.params.id;

    const sql = `
        UPDATE sections
        SET statut = 
            CASE 
                WHEN statut = 'Active' THEN 'Inactive'
                ELSE 'Active'
            END
        WHERE id_section = ?
    `;

    db.query(sql, [idSection], (err, result) => {

        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Erreur serveur"
            });
        }

        res.json({
            message:"Statut modifié"
        });

    });

});



app.delete("/sections/supprimer/:id", (req, res) => {

    const idSection = req.params.id;

    const sql = `
        DELETE FROM sections 
        WHERE id_section = ?
    `;

    db.query(sql, [idSection], (err, result) => {

        if(err){
            console.log(err);

            return res.status(500).json({
                message:"Erreur lors de la suppression"
            });
        }


        res.json({
            message:"Section supprimée avec succès"
        });

    });

});



//enregistrer la classe.........................................................................
app.post("/classes", (req, res) => {

    const {
        id_ecole,
        id_section,
        nom,
        capacite
    } = req.body;


    if(!id_ecole || !id_section || !nom){

        return res.status(400).json({

            success:false,

            message:"Tous les champs sont obligatoires."

        });

    }



    const sql = `

        INSERT INTO classes
        (
            id_ecole,
            id_section,
            nom,
            capacite
        )

        VALUES
        (?,?,?,?)

    `;



    db.query(
        sql,
        [
            id_ecole,
            id_section,
            nom,
            capacite || 40
        ],

        (err, result)=>{


            if(err){

                console.error(
                    "Erreur ajout classe :",
                    err
                );


                // doublon dans la même école
                if(err.code === "ER_DUP_ENTRY"){
                    return res.status(400).json({
                        success:false,
                        message:"Cette classe existe déjà dans cette école."
                    });
                }



                return res.status(500).json({
                    success:false,
                    message:"Erreur serveur."
                });
            }



            res.json({
                success:true,
                message:"Classe créée avec succès.",
                id_classe: result.insertId
            });
        }
    );
});








app.get("/classes/liste/:id_ecole", (req,res)=>{
    const id_ecole = req.params.id_ecole;
const sql = `

    SELECT
        c.id_classe,
        c.nom,
        c.capacite,
        c.statut,
        s.nom AS section

    FROM classes c

    INNER JOIN sections s
    ON c.id_section = s.id_section

    WHERE c.id_ecole = ?
    AND c.statut = 'Active'
    AND s.statut = 'Active'

    ORDER BY c.nom ASC

`;



    db.query(
        sql,
        [id_ecole],

        (err,result)=>{


            if(err){

                console.error(
                    "Erreur chargement classes :",
                    err
                );


                return res.status(500).json({
                    success:false,
                    message:"Erreur serveur."
                });
            }



            res.json({
                success:true,
                classes:result
            });
        }
    );
});








// désactiver une classe
app.delete("/classes/:id_classe", (req, res) => {

    const id_classe = req.params.id_classe;


    const sql = `

        UPDATE classes

        SET 
            statut = 'Inactive',
            date_desactivation = NOW()

        WHERE id_classe = ?

    `;



    db.query(
        sql,
        [id_classe],

        (err, result) => {


            if(err){

                console.error(
                    "Erreur désactivation classe :",
                    err
                );


                return res.status(500).json({

                    success:false,

                    message:"Erreur serveur."

                });

            }



            if(result.affectedRows === 0){

                return res.status(404).json({

                    success:false,

                    message:"Classe introuvable."

                });

            }



            res.json({

                success:true,

                message:"Classe désactivée. Suppression automatique dans 10 jours."

            });


        }

    );


});










cron.schedule("0 0 * * *", () => {


    const sql = `

        DELETE FROM classes

        WHERE statut = 'Inactive'

        AND date_desactivation <= DATE_SUB(NOW(), INTERVAL 10 DAY)

    `;



    db.query(
        sql,
        (err,result)=>{


            if(err){

                console.error(
                    "Erreur suppression automatique classes :",
                    err
                );

                return;

            }


            console.log(
                result.affectedRows,
                "classes supprimées après 10 jours."
            );


        }

    );


});





// récupérer les classes désactivées d'une école

app.get("/classes/desactivees/:id_ecole", (req,res)=>{


    const id_ecole = req.params.id_ecole;



    const sql = `

        SELECT

            c.id_classe,
            c.nom,
            c.capacite,
            c.date_modification,
            s.nom AS section


        FROM classes c


        INNER JOIN sections s

        ON c.id_section = s.id_section



        WHERE c.id_ecole = ?

        AND c.statut = 'Inactive'


        ORDER BY c.nom ASC

    `;



    db.query(
        sql,
        [id_ecole],

        (err,result)=>{


            if(err){

                console.error(
                    "Erreur récupération classes désactivées :",
                    err
                );


                return res.status(500).json({

                    success:false,

                    message:"Erreur serveur."

                });

            }

            res.json({
                success:true,
                classes:result
            });
        }
    );
});








app.put("/classes/recuperer", (req,res)=>{


    const {
        classes
    } = req.body;



    if(!classes || classes.length === 0){

        return res.status(400).json({

            success:false,

            message:"Aucune classe sélectionnée."

        });

    }



    const sql = `

        UPDATE classes

        SET statut='Active'

        WHERE id_classe IN (?)

    `;



    db.query(
        sql,
        [classes],

        (err,result)=>{


            if(err){

                console.error(
                    "Erreur récupération classes :",
                    err
                );


                return res.status(500).json({

                    success:false,

                    message:"Erreur serveur."

                });

            }



            res.json({

                success:true,

                message:"Classes récupérées avec succès."

            });


        }
    );
});














app.get("/classes/desactivees/count/:id_ecole",(req,res)=>{


    const id_ecole=req.params.id_ecole;



    const sql=`

        SELECT COUNT(*) AS total

        FROM classes

        WHERE id_ecole=?

        AND statut='Inactive'

    `;



    db.query(
        sql,
        [id_ecole],

        (err,result)=>{


            if(err){

                return res.status(500).json({

                    success:false

                });

            }



            res.json({

                success:true,

                total:result[0].total

            });


        }
    );


});








app.get("/annees-scolaires", (req,res)=>{

    const { id_ecole } = req.query;


    if(!id_ecole){
        return res.status(400).json({
            success:false,
            message:"École non définie"
        });
    }

    const sql = `
        SELECT
            id_annee,
            libelle,
            date_debut,
            date_fin,
            statut

        FROM annees_scolaires

        WHERE id_ecole = ?

        AND statut IN ('Préparation','Active')

        ORDER BY date_debut DESC

    `;



    db.query(
        sql,
        [id_ecole],
        (err,result)=>{


            if(err){

                console.error(err);

                return res.status(500).json({
                    success:false,
                    message:"Erreur serveur"
                });

            }



            res.json({

                success:true,
                data:result

            });



        }
    );
});












app.get("/chargement_classe_pour_inscription", (req,res)=>{


    const id_ecole = req.query.id_ecole;



    if(!id_ecole){

        return res.status(400).json({

            success:false,
            message:"id_ecole obligatoire"

        });

    }



    const sql = `

        SELECT

            c.id_classe,
            c.nom AS nom_classe,
            s.nom AS nom_section


        FROM classes c


        INNER JOIN sections s

        ON c.id_section = s.id_section



        WHERE c.id_ecole = ?

        AND c.statut = 'Active'

        AND s.statut = 'Active'


        ORDER BY s.nom, c.nom ASC

    `;



    db.query(

        sql,

        [id_ecole],

        (err,result)=>{


            if(err){

                console.error(
                    "Erreur chargement classes inscription :",
                    err
                );


                return res.status(500).json({

                    success:false,
                    message:"Erreur serveur"

                });

            }



            res.json({
                success:true,
                data:result

            });


        }

    );
});











































































































































// ========================
// TEST SERVEUR
// ========================
app.get("/test",(req,res)=>{
    res.json({
        message:"Serveur OK"
    });
});
app.post("/configuration_matricule/ajouter", (req,res)=>{


    const {
        id_ecole,
        nom_configuration,
        prefixe,
        format_matricule,
        longueur_numero,
        separateur,
        utiliser_section
    } = req.body;



    if(
        !id_ecole ||
        !nom_configuration ||
        !format_matricule
    ){

        return res.status(400).json({

            success:false,
            message:"Informations obligatoires manquantes"

        });

    }



    const sql = `

        INSERT INTO configuration_matricules
        (
            id_ecole,
            nom_configuration,
            format_matricule,
            longueur_numero,
            separateur,
            utiliser_section,
            prefixe
        )

        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )

    `;



    db.query(

        sql,

        [
            id_ecole,
            nom_configuration,
            format_matricule,
            longueur_numero || 4,
            separateur || '-',
            utiliser_section ?? 1,
            prefixe || 'ELV'
        ],


        (err,result)=>{


            if(err){

                console.error(
                    "Erreur ajout configuration matricule :",
                    err
                );


                return res.status(500).json({

                    success:false,
                    message:"Erreur serveur"

                });

            }




            res.json({

                success:true,

                message:"Configuration matricule enregistrée",

                id_configuration:result.insertId

            });



        }

    );


});
















app.get("/generer_matricule_eleve", (req,res)=>{


    const {
        id_ecole
    } = req.query;



    console.log(
        "ID ECOLE RECU :",
        id_ecole
    );



    if(!id_ecole){

        return res.status(400).json({

            success:false,
            message:"Ecole obligatoire"

        });

    }



    const sql = `
        SELECT *
        FROM configuration_matricules
        WHERE id_ecole = ?
        AND statut = 'Active'
        LIMIT 1

    `;



    db.query(
        sql,
        [id_ecole],

        (err,result)=>{


            if(err){

                console.error(err);

                return res.status(500).json({

                    success:false,
                    message:"Erreur serveur"

                });

            }



            console.log(
                "CONFIGURATION TROUVEE :",
                result
            );



            if(result.length === 0){

                return res.json({

                    success:false,
                    message:"Aucune configuration matricule"

                });

            }



            const config = result[0];



            const numero = 
            String(config.compteur + 1)
            .padStart(
                config.longueur_numero,
                "0"
            );



            const annee =
            new Date().getFullYear();



            let matricule =
            config.format_matricule;



            matricule =
            matricule.replace(
                "{PREFIXE}",
                config.prefixe || ""
            );



            matricule =
            matricule.replace(
                "{SECTION}",
                "GEN"
            );



            matricule =
            matricule.replace(
                "{ANNEE}",
                config.utiliser_annee == 1
                ? annee
                : ""
            );



            matricule =
            matricule.replace(
                "{NUMERO}",
                numero
            );



            // nettoyage des doubles séparateurs
            matricule =
            matricule.replace(
                /--+/g,
                "-"
            );



            console.log(
                "MATRICULE GENERE :",
                matricule
            );

            res.json({
                success:true,
                matricule:matricule
            });
        }
    );
});
















































// =====================================
// INSCRIPTION ELEVE
// =====================================

app.post(
"/eleves/inscriptionA",
upload.single("photo"),
(req,res)=>{


    const {

        id_ecole,

        matricule,

        nom,
        postnom,
        prenom,
        sexe,
        date_naissance,
        lieu_naissance,
        nationalite,
        telephone,


        parent_nom,
        parent_postnom,
        parent_prenom,
        parent_sexe,
        parent_telephone,
        profession,
        type_responsable,


        id_classe,
        id_annee_scolaire,


        date_inscription,
        numero_inscription,
        observation


    } = req.body;



    const photo = req.file
    ? req.file.filename
    : null;



    console.log("DONNEES INSCRIPTION :",req.body);



    db.beginTransaction((err)=>{


        if(err){

            return res.status(500).json({

                success:false,
                message:"Erreur démarrage transaction"

            });

        }



        function annuler(message){

            db.rollback(()=>{

                res.status(500).json({

                    success:false,
                    message

                });

            });

        }




        function convertirSexe(valeur){

            if(valeur==="Féminin")
                return "Feminin";


            if(valeur==="Masculin")
                return "Masculin";


            return valeur;

        }




        function convertirLien(valeur){

            if(valeur==="Père")
                return "Pere";


            if(valeur==="Mère")
                return "Mere";


            if(valeur==="Tuteur")
                return "Tuteur";


            return "Autre";

        }





        // =========================
        // CREATION EMAIL PARENT
        // =========================


        let email_parent =
        "parent@gmail.com";



        db.query(

            `
            SELECT id_utilisateur
            FROM utilisateurs
            WHERE email = ?
            `,

            [email_parent],


            (err,result)=>{


                if(err)
                    return annuler(
                        "Erreur recherche email parent : "+err.message
                    );



                if(result.length > 0){

                    email_parent =
                    "parent"+Date.now()+"@gmail.com";

                }







                // =========================
                // CREATION UTILISATEUR
                // =========================



                db.query(

                    `
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

                    VALUES(?,?,?,?,?,?,?,?)
                    `,


                    [

                        id_ecole,
                        parent_nom,
                        parent_postnom,
                        parent_prenom,
                        email_parent,
                        parent_telephone,
                        "123456",
                        "PARENT"

                    ],


                    (err,result)=>{


                        if(err)
                            return annuler(
                                "Erreur utilisateur parent : "
                                +err.message
                            );



                        const id_utilisateur =
                        result.insertId;







                        // =========================
                        // CREATION PARENT
                        // =========================


                        db.query(

                            `
                            INSERT INTO parents
                            (
                                id_utilisateur,
                                nom,
                                postnom,
                                prenom,
                                sexe,
                                telephone_secondaire,
                                profession
                            )

                            VALUES(?,?,?,?,?,?,?)
                            `,


                            [

                                id_utilisateur,
                                parent_nom,
                                parent_postnom,
                                parent_prenom,
                                convertirSexe(parent_sexe),
                                parent_telephone,
                                profession

                            ],


                            (err,result)=>{


                                if(err)
                                    return annuler(
                                        "Erreur parent : "
                                        +err.message
                                    );



                                const id_parent =
                                result.insertId;









                                // =========================
                                // CREATION ELEVE
                                // =========================



                                db.query(

                                    `
                                    INSERT INTO eleves
                                    (
                                        id_ecole,
                                        matricule,
                                        nom,
                                        postnom,
                                        prenom,
                                        sexe,
                                        date_naissance,
                                        lieu_naissance,
                                        nationalite,
                                        telephone,
                                        photo
                                    )

                                    VALUES(?,?,?,?,?,?,?,?,?,?,?)
                                    `,


                                    [

                                        id_ecole,
                                        matricule,
                                        nom,
                                        postnom,
                                        prenom,
                                        convertirSexe(sexe),
                                        date_naissance,
                                        lieu_naissance,
                                        nationalite,
                                        telephone,
                                        photo

                                    ],


                                    (err,result)=>{


                                        if(err)
                                            return annuler(
                                                "Erreur élève : "
                                                +err.message
                                            );



                                        const id_eleve =
                                        result.insertId;









                                        // =========================
                                        // LIEN PARENT ELEVE
                                        // =========================


                                        db.query(

                                            `
                                            INSERT INTO parent_eleve
                                            (
                                                id_parent,
                                                id_eleve,
                                                lien,
                                                responsable_principal
                                            )

                                            VALUES(?,?,?,?)
                                            `,


                                            [

                                                id_parent,
                                                id_eleve,
                                                convertirLien(type_responsable),
                                                1

                                            ],


                                            (err)=>{


                                                if(err)
                                                    return annuler(
                                                        "Erreur liaison parent élève : "
                                                        +err.message
                                                    );









                                                    // =========================
                                                    // INSCRIPTION
                                                    // =========================



                                                    db.query(

                                                        `
                                                        INSERT INTO inscriptions
                                                        (
                                                            id_ecole,
                                                            id_eleve,
                                                            id_classe,
                                                            id_annee_scolaire,
                                                            date_inscription,
                                                            numero_inscription,
                                                            observation
                                                        )

                                                        VALUES(?,?,?,?,?,?,?)
                                                        `,


                                                        [

                                                            id_ecole,
                                                            id_eleve,
                                                            id_classe,
                                                            id_annee_scolaire,
                                                            date_inscription,
                                                            numero_inscription,
                                                            observation

                                                        ],


                                                        (err)=>{


                                                            if(err)
                                                                return annuler(
                                                                    "Erreur inscription : "
                                                                    +err.message
                                                                );





                                                            db.commit((err)=>{


                                                                if(err)
                                                                    return annuler(
                                                                        "Erreur validation transaction : "
                                                                        +err.message
                                                                    );



                                                                res.json({

                                                                    success:true,

                                                                    message:
                                                                    "Élève inscrit avec succès",

                                                                    id_eleve

                                                                });



                                                            });



                                                        }

                                                    );





                                            }

                                        );





                                    }

                                );





                            }

                        );



                    }

                );



            }

        );



    });



});
//////////////////////////////////////////////////////////////////////////////////////////





























app.post(
"/eleves/inscription",
upload.single("photo"),
(req,res)=>{


    const{

        id_ecole,
        matricule,
        nom,
        postnom,
        prenom,
        sexe,
        date_naissance,
        lieu_naissance,
        nationalite,
        telephone,

        mode_parent,
        id_parent_selectionne,

        parent_nom,
        parent_postnom,
        parent_prenom,
        parent_sexe,
        parent_telephone,
        profession,
        type_responsable,

        id_classe,
        id_annee_scolaire,
        date_inscription,
        numero_inscription,
        observation

    } = req.body;



    let photo=null;


    if(req.file){

        photo="uploads/eleves/"+req.file.filename;

    }



    db.beginTransaction((err)=>{


        if(err){

            return res.status(500).json({

                success:false,
                message:"Erreur transaction"

            });

        }



        function annuler(message){

            db.rollback(()=>{

                res.status(500).json({

                    success:false,
                    message

                });

            });

        }




        function convertirSexe(valeur){

            if(valeur==="Féminin")
                return "Feminin";


            if(valeur==="Masculin")
                return "Masculin";


            return valeur;

        }




        function convertirLien(valeur){

            if(valeur==="Père")
                return "Pere";


            if(valeur==="Mère")
                return "Mere";


            if(valeur==="Tuteur")
                return "Tuteur";


            return "Autre";

        }



        let id_parent=null;



        //=================================
        // CREATION ELEVE
        //=================================

        function creerEleve(){



            db.query(

                `
                INSERT INTO eleves
                (
                    id_ecole,
                    matricule,
                    nom,
                    postnom,
                    prenom,
                    sexe,
                    date_naissance,
                    lieu_naissance,
                    nationalite,
                    telephone,
                    photo
                )

                VALUES(?,?,?,?,?,?,?,?,?,?,?)
                `,


                [

                    id_ecole,
                    matricule,
                    nom,
                    postnom,
                    prenom,
                    convertirSexe(sexe),
                    date_naissance,
                    lieu_naissance,
                    nationalite,
                    telephone,
                    photo

                ],



                (err,result)=>{


                    if(err){

                        return annuler(
                            "Erreur création élève : "+
                            err.message
                        );

                    }



                    const id_eleve=result.insertId;




                    //=================================
                    // LIAISON PARENT ELEVE
                    //=================================



console.log(
    "VERIFICATION AVANT LIAISON",
    {
        id_parent,
        id_eleve
    }
);


db.query(
    "SELECT id_parent FROM parents WHERE id_parent=?",
    [id_parent],
    (err, rows)=>{

        console.log(
            "Parent visible dans transaction :",
            rows
        );

    }
);


                    db.query(

                        `
                        INSERT INTO parent_eleve
                        (
                            id_parent,
                            id_eleve,
                            lien,
                            responsable_principal
                        )

                        VALUES(?,?,?,?)
                        `,


                        [

                            id_parent,
                            id_eleve,
                            convertirLien(type_responsable),
                            1

                        ],



                        (err)=>{


                            if(err){

                                return annuler(
                                    "Erreur liaison parent/élève : "+
                                    err.message
                                );

                            }





                            //=================================
                            // INSCRIPTION
                            //=================================


                            db.query(

                                `
                                INSERT INTO inscriptions
                                (
                                    id_ecole,
                                    id_eleve,
                                    id_classe,
                                    id_annee_scolaire,
                                    date_inscription,
                                    numero_inscription,
                                    observation
                                )

                                VALUES(?,?,?,?,?,?,?)
                                `,


                                [

                                    id_ecole,
                                    id_eleve,
                                    id_classe,
                                    id_annee_scolaire,
                                    date_inscription,
                                    numero_inscription,
                                    observation

                                ],




                                (err)=>{


                                    if(err){

                                        return annuler(
                                            "Erreur inscription : "+
                                            err.message
                                        );

                                    }




                                    db.commit((err)=>{


                                        if(err){

                                            return annuler(
                                                "Erreur validation transaction : "+
                                                err.message
                                            );

                                        }




                                        res.json({

                                            success:true,
                                            message:"Élève inscrit avec succès.",
                                            id_eleve

                                        });



                                    });



                                }


                            );



                        }


                    );



                }



            );


        }


        //=====================================
        // GESTION DU PARENT
        //=====================================


        if(mode_parent === "existant"){


            id_parent = id_parent_selectionne;



            if(!id_parent){

                return annuler(
                    "Aucun parent sélectionné"
                );

            }



            // création de l'élève

            creerEleve();



        }else{


            //=====================================
            // CREATION NOUVEAU PARENT
            //=====================================


          db.query(`
                    INSERT INTO utilisateurs
                    (
                        id_ecole,
                        nom,
                        postnom,
                        prenom,
                        telephone,
                        mot_de_passe,
                        role
                    )

                    VALUES(?,?,?,?,?,?,?)
                    `,

                    [

                        id_ecole,
                        parent_nom,
                        parent_postnom,
                        parent_prenom,
                        parent_telephone,
                        "1234",
                        "PARENT"

                    ],


                (err,result)=>{


                    if(err){

                        return annuler(
                            "Erreur création utilisateur parent : "+
                            err.message
                        );

                    }



                    const id_utilisateur = result.insertId;





                    //=====================================
                    // CREATION TABLE PARENTS
                    //=====================================

                    db.query(

                        `
                        INSERT INTO parents
                        (
                            id_utilisateur,
                            nom,
                            postnom,
                            prenom,
                            sexe,
                            profession,
                            type_responsable
                        )

                        VALUES(?,?,?,?,?,?,?)
                        `,

                        [

                            id_utilisateur,
                            parent_nom,
                            parent_postnom,
                            parent_prenom,
                            convertirSexe(parent_sexe),
                            profession,
                            convertirLien(type_responsable)

                        ],


                        (err,result)=>{


        if(err){

            return annuler(
                "Erreur création parent : "+
                err.message
            );

        }


        id_parent = result.insertId;


        console.log(
            "ID parent créé :",
            id_parent
        );


        creerEleve();


    }

);



                }



            );



        }

    });



});






















//chercher le parent existent 
// =====================================
// RECHERCHE PARENT EXISTANT
// =====================================

app.get("/parents/recherche", (req,res)=>{


    const texte = req.query.texte;



    if(!texte || texte.trim() === ""){

        return res.status(400).json({

            success:false,

            message:"Texte de recherche obligatoire"

        });

    }



    const recherche = "%" + texte + "%";



    const sql = `

        SELECT

            p.id_parent,

            p.nom,

            p.postnom,

            p.prenom,

            p.sexe,

            p.profession,

            u.telephone


        FROM parents p


        INNER JOIN utilisateurs u

        ON p.id_utilisateur = u.id_utilisateur


        WHERE 

            p.nom LIKE ?

            OR p.postnom LIKE ?

            OR p.prenom LIKE ?

            OR u.telephone LIKE ?


        ORDER BY p.nom ASC


        LIMIT 20

    `;



    db.query(

        sql,

        [

            recherche,
            recherche,
            recherche,
            recherche

        ],


        (err,result)=>{


            if(err){

                console.error(
                    "Erreur recherche parent :",
                    err
                );


                return res.status(500).json({

                    success:false,

                    message:"Erreur serveur recherche parent"

                });

            }



            res.json({
                success:true,
                parents:result

            });



        }

    );


});










// =============================
// COMPTER NOMBRE D'ELEVES
// =============================

app.get(
"/eleves/count",
(req,res)=>{


    const id_ecole = req.query.id_ecole;


    let sql = `
        SELECT COUNT(*) AS total
        FROM eleves
    `;


    let params = [];


    if(id_ecole){

        sql += `
            WHERE id_ecole = ?
        `;

        params.push(id_ecole);

    }



    db.query(
        sql,
        params,
        (err,result)=>{
            if(err){
                return res.status(500).json({
                    success:false,
                    message:err.message
                });
            }

            res.json({
                success:true,
                total:result[0].total
            });
        }
    );
});






















































































































// Page d'accueil
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../login.html")
    );

});

app.use(
    express.static(
        path.join(__dirname, "../interface")
    )
);


// ======================
// DEMARRAGE
// ======================

const PORT = 3000;


app.listen(PORT,()=>{


    console.log(
        `Serveur démarré sur le port ${PORT}`
    );


});