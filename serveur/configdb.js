const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");


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