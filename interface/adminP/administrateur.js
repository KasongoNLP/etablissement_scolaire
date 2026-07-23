const adresse_ip_serveur = "http://localhost:3000/";


const boutonNouvelleEcole = document.getElementById("boutonNouvelleEcole");
const fenetreAjoutEcole = document.getElementById("fenetreAjoutEcole");
const fermerModaleEcole = document.getElementById("fermerModaleEcole");
const boutonAnnulerEcole = document.getElementById("boutonAnnulerEcole");

boutonNouvelleEcole.onclick = function(){fenetreAjoutEcole.style.display = "flex";};
fermerModaleEcole.onclick = function(){fenetreAjoutEcole.style.display = "none";};
boutonAnnulerEcole.onclick = function(){fenetreAjoutEcole.style.display = "none";};



// ==============================
// ENREGISTRER UNE NOUVELLE ECOLE
// ==============================


document
.getElementById("boutonEnregistrerEcole")
.addEventListener("click", enregistrerEcole);



async function enregistrerEcole(){

    const nom = document
    .getElementById("nomEcole")
    .value
    .trim();

    const adresse = document
    .getElementById("adresseEcole")
    .value
    .trim();

    const telephone = document
    .getElementById("telephoneEcole")
    .value
    .trim();

    const email = document
    .getElementById("emailEcole")
    .value
    .trim();


    if(!nom){

        alert("Le nom de l'école est obligatoire.");

        return;

    }


    try{

        const response = await fetch(
            "http://localhost:3000/ecoles",
            {

                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    nom,
                    adresse,
                    telephone,
                    email
                })
            }
        );



        const resultat = await response.json();
        if(resultat.success){
            afficherNotification("École créée avec succès.");
            afficherEcoles();


            // fermer la fenêtre
            document
            .getElementById("fenetreAjoutEcole")
            .style.display="none";



            // nettoyer le formulaire
            document
            .getElementById("nomEcole")
            .value="";



            document
            .getElementById("adresseEcole")
            .value="";


            document
            .getElementById("telephoneEcole")
            .value="";


            document
            .getElementById("emailEcole")
            .value="";



        }else{
            afficherNotification(resultat.message);
        }



    }catch(erreur){
        console.error(erreur);
        alert(
            "Erreur de connexion au serveur."
        );
    }
}



function afficherNotification(message, type="success"){

    const notification =
    document.getElementById("notification");
    notification.innerHTML = message;
    notification.classList.remove("erreur");
    if(type==="erreur"){
        notification.classList.add("erreur");

    }
    notification.classList.add("afficher");
    setTimeout(()=>{
        notification.classList.remove("afficher");

    },3000);


}



// on affiche ici les ecoles;
// =================================
// AFFICHER LA LISTE DES ECOLES
// =================================

async function afficherEcoles(){
    try{

        const reponse = await fetch(
            "http://localhost:3000/ecoles/liste"
        );

        const donnees = await reponse.json();
        const tableau =
        document.getElementById("tableauEcoles");
        tableau.innerHTML = "";
        donnees.ecoles.forEach(ecole => {

            const dateCreation =
            new Date(ecole.date_creation)
            .toLocaleDateString("fr-FR");

            let statutClasse = "";
            if(ecole.statut === "Active"){
                statutClasse = "statut-active";
            }else{
                statutClasse = "suspendue";
            }
            tableau.innerHTML += `
            <tr>
                <td>
                    ${ecole.nom}
                </td>
                <td>
                    ${ecole.adresse ?? "-"}
                </td>
                <td>
                    <span class="badge ${statutClasse}">
                        ${ecole.statut}
                    </span>
                </td>
                <td>
                    ${dateCreation}
                </td>



                <td class="action">


                    <i 
                    class="fa-solid fa-eye"
                    title="Voir">
                    </i>



                    ${
                        ecole.statut === "Active"

                        ?

                        `
                        <i 
                        class="fa-solid fa-ban"
                        title="Suspendre">
                        </i>
                        `

                        :

                        `
                        <i 
                        class="fa-solid fa-check"
                        title="Activer">
                        </i>
                          `
                    }
                </td>
            </tr>
            `;
        });
    }
    catch(erreur){
        console.error(
            "Erreur affichage écoles :",
            erreur
        );
    }
}










// =================================
// CHARGER LE NOMBRE TOTAL DES ECOLES
// =================================

async function chargerNombreEcoles(){
    try{
        const response = await fetch(
            "http://localhost:3000/ecoles/count"
        );
        const data = await response.json();
        if(data.success){
            document
            .getElementById("nombreEcoles")
            .innerHTML = data.total;
        }



    }catch(error){
        console.error(
            "Erreur compteur écoles : ",
            error
        );
    }
}


async function chargerNombreEcolesActive(){
    try{
        const response = await fetch(
            "http://localhost:3000/ecoles/Active"
        );
        const data = await response.json();
        if(data.success){
            document
            .getElementById("nombreEcolesActive")
            .innerHTML = data.total;
        }

    }catch(error){
        console.error(
            "Erreur compteur écoles : ",
            error
        );
    }
}



//charger les societes Suspendues 
async function chargerNombreEcolesSuspendue(){
    try{
        const response = await fetch(
            "http://localhost:3000/ecoles/suspendue"
        );
        const data = await response.json();
        if(data.success){
            document
            .getElementById("nombreEcolesSuspendue")
            .innerHTML = data.total;
        }

    }catch(error){
        console.error(
            "Erreur compteur écoles : ",
            error
        );
    }
}



// =============================
// OUVERTURE MODAL ECOLES
// =============================

const carteEcoles = document.getElementById("carteEcoles");
const modalEcoles = document.getElementById("modalEcoles");
const fermerModalEcoles = document.getElementById("fermerModalEcoles");



carteEcoles.addEventListener("click", ()=>{

    modalEcoles.style.display = "flex";

});




// =============================
// FERMETURE MODAL ECOLES
// =============================

fermerModalEcoles.addEventListener("click", ()=>{

    modalEcoles.style.display = "none";

});


// appel au chargement de la page
chargerNombreEcoles();
chargerNombreEcolesActive();
chargerNombreEcolesSuspendue();
// chargement automatique
afficherEcoles();









// la fenetre utilisateur ///////////////////////////////////////////////////////////////////////////////
document
.getElementById("menuUtilisateurs")
.addEventListener("click", afficherUtilisateurs);


function afficherUtilisateurs(){
    const contenu = document.getElementById("contenuPrincipal");
    contenu.innerHTML = "";

    const page = document.createElement("div");

    page.id = "pageUtilisateurs";

    page.innerHTML = `
        <div class="title">
            <h1>Gestion des utilisateurs</h1>

            <button id="btnNouvelUtilisateur">
                <i class="fa-solid fa-plus"></i>
                Nouvel utilisateur
            </button>









<!-- ===========================
     MODAL AJOUT UTILISATEUR
=========================== -->

<div id="modalAjoutUtilisateur" class="modal">

    <div class="modal-contenu">

        <div class="modal-entete">
            <h2>Ajouter un utilisateur</h2>

            <button
                type="button"
                id="btnFermerModalUtilisateur"
                class="btn-fermer">
                &times;
            </button>
        </div>

        <form id="formulaireUtilisateur">

            <div class="ligne-formulaire">

                <div class="groupe">
                    <label>École</label>
                    <select id="ecoleUtilisateur">
                        <option value="">Sélectionner une école</option>
                    </select>
                </div>

                <div class="groupe">
                    <label>Rôle</label>
                    <select id="roleUtilisateur" required>
                        <option value="">Sélectionner un rôle</option>
                        <option value="SUPER_ADMIN">Super Administrateur</option>
                        <option value="ADMIN_ECOLE">Administrateur École</option>
                        <option value="DIRECTION">Direction</option>
                        <option value="CAISSIER">Caissier</option>
                        <option value="ENSEIGNANT">Enseignant</option>
                        <option value="PARENT">Parent</option>
                    </select>
                </div>

            </div>

            <div class="ligne-formulaire">

                <div class="groupe">
                    <label>Nom</label>
                    <input
                        type="text"
                        id="nomUtilisateurf"
                        placeholder="Nom"
                        required>
                </div>

                <div class="groupe">
                    <label>Postnom</label>
                    <input
                        type="text"
                        id="postnomUtilisateur"
                        placeholder="Postnom">
                </div>

            </div>

            <div class="ligne-formulaire">

                <div class="groupe">
                    <label>Prénom</label>
                    <input
                        type="text"
                        id="prenomUtilisateur"
                        placeholder="Prénom">
                </div>

                <div class="groupe">
                    <label>Téléphone</label>
                    <input
                        type="text"
                        id="telephoneUtilisateur"
                        placeholder="Téléphone">
                </div>

            </div>

            <div class="ligne-formulaire">

                <div class="groupe">
                    <label>Email</label>
                    <input
                        type="email"
                        id="emailUtilisateur"
                        placeholder="Adresse e-mail"
                        required>
                </div>

                <div class="groupe">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        id="motPasseUtilisateur"
                        placeholder="Mot de passe"
                        required>
                </div>
            </div>
            <div class="zone-boutons">
                <button
                    type="button"
                    id="btnAnnulerUtilisateur"
                    class="btn-secondaire">
                    Annuler
                </button>

                <button
                    type="submit"
                    id="btnEnregistrerUtilisateur"
                    class="btn-principal">
                    Enregistrer
                </button>
            </div>
        </form>
    </div>
</div>







        </div>
<div class="conteneur-utilisateurs">


    <!-- LISTE GAUCHE -->

    <div class="liste-utilisateurs">

        <h2>
            Utilisateurs
        </h2>


        <input
        type="text"
        id="rechercheUtilisateur"
        placeholder="Rechercher...">


        <div id="listeUtilisateurs">

        </div>


    </div>





    <!-- DETAILS DROITE -->
    <div class="details-utilisateur">


        <div class="onglets">
            <button id="ongletInfo">
                Informations
            </button>


            <button id="ongletDetail">
                Détails
            </button>
        </div>




        <div id="contenuInfoUtilisateur">


            Sélectionnez un utilisateur


        </div>




        <div 
        id="contenuDetailUtilisateur"
        style="display:none;">


        </div>
    </div>
</div>
    `;
    contenu.appendChild(page);





const btnNouvelUtilisateur = document.getElementById("btnNouvelUtilisateur");
const modalAjoutUtilisateur = document.getElementById("modalAjoutUtilisateur");
const btnFermerModalUtilisateur = document.getElementById("btnFermerModalUtilisateur");
const btnAnnulerUtilisateur = document.getElementById("btnAnnulerUtilisateur");

// Ouvrir le modal
btnNouvelUtilisateur.addEventListener("click", async () => {

    await chargerEcoles();

    modalAjoutUtilisateur.style.display = "flex";

});

// Fermer avec le X
btnFermerModalUtilisateur.addEventListener("click", fermerModalUtilisateur);
// Fermer avec le bouton Annuler
btnAnnulerUtilisateur.addEventListener("click", fermerModalUtilisateur);
// Fermer en cliquant en dehors
window.addEventListener("click", (e) => {
    if (e.target === modalAjoutUtilisateur){fermerModalUtilisateur();}

});

function fermerModalUtilisateur() {
    modalAjoutUtilisateur.style.display = "none";
    document.getElementById("formulaireUtilisateur").reset();
}





document
.getElementById("formulaireUtilisateur")
.addEventListener("submit", enregistrerUtilisateur);

async function enregistrerUtilisateur(e){

    e.preventDefault();

    const utilisateur = {

        id_ecole: document.getElementById("ecoleUtilisateur").value,
        nom: document.getElementById("nomUtilisateurf").value,
        postnom: document.getElementById("postnomUtilisateur").value,
        prenom: document.getElementById("prenomUtilisateur").value,
        email: document.getElementById("emailUtilisateur").value,
        telephone: document.getElementById("telephoneUtilisateur").value,
        mot_de_passe: document.getElementById("motPasseUtilisateur").value,
        role: document.getElementById("roleUtilisateur").value

    };









    try{

        const reponse = await fetch(
            `${adresse_ip_serveur}utilisateurs/creer`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(utilisateur)
            }
        );

        const resultat = await reponse.json();


        if(resultat.success){

            afficherNotification(resultat.message);

            document
                .getElementById("formulaireUtilisateur")
                .reset();

            fermerModalUtilisateur();

            // Si tu as une fonction qui recharge la liste :
            // chargerUtilisateurs();

        }else{
            afficherNotification(resultat.message);
        }

    }catch(error){
        console.error(error);
        afficherNotification("Erreur de connexion au serveur.");

    }
}



//chargement des ecoles dans la bar selection.....................
async function chargerEcoles() {

    try {

        const reponse = await fetch(
            `${adresse_ip_serveur}ecoles/liste`
        );

        const resultat = await reponse.json();

        const select = document.getElementById("ecoleUtilisateur");

        select.innerHTML = `
            <option value="">Sélectionner une école</option>
        `;

        if (resultat.success) {

            resultat.ecoles.forEach(ecole => {

                select.innerHTML += `
                    <option value="${ecole.id_ecole}">
                        ${ecole.nom}
                    </option>
                `;

            });

        }

    } catch (error) {

        console.error("Erreur chargement écoles :", error);

        alert("Impossible de charger les écoles.");

    }

}










// =====================================
// VARIABLES GLOBALES
// =====================================

let listeUtilisateursGlobal = [];
let utilisateurSelectionne = null;



// =====================================
// CHARGER LA LISTE DES UTILISATEURS
// =====================================

async function chargerListeUtilisateurs(){

    try{


        const reponse = await fetch(
            `${adresse_ip_serveur}utilisateurs/liste`
        );



        const resultat = await reponse.json();



        const conteneur = document.getElementById(
            "listeUtilisateurs"
        );



        conteneur.innerHTML = "";




        if(resultat.success){



            // Stocker les utilisateurs reçus

            listeUtilisateursGlobal =
            resultat.utilisateurs;




            resultat.utilisateurs.forEach(utilisateur=>{


                conteneur.innerHTML += `


                <div 
                class="carte-utilisateur"
                data-id="${utilisateur.id_utilisateur}">



                    <div class="avatar-utilisateur">


                        ${
                            utilisateur.photo

                            ?

                            `
                            <img 
                            src="${utilisateur.photo}"
                            class="photo-mini">
                            `

                            :

                            `
                            <i class="fa-solid fa-user"></i>
                            `

                        }


                    </div>





                    <div class="info-carte">



                        <h3>

                            ${utilisateur.nom ?? ""}

                            ${utilisateur.postnom ?? ""}

                            ${utilisateur.prenom ?? ""}

                        </h3>





                        <p>

                            ${utilisateur.role ?? "-"}

                        </p>





                        <p>

                            ${
                                utilisateur.nom_ecole
                                ??
                                "Aucune école"
                            }

                        </p>






                    </div>



                </div>


                `;


            });







            // Ajouter le clic sur chaque utilisateur

            document
            .querySelectorAll(".carte-utilisateur")
            .forEach(carte=>{



                carte.addEventListener(
                    "click",
                    ()=>{





                        // retirer ancien actif

                        document
                        .querySelectorAll(
                            ".carte-utilisateur"
                        )
                        .forEach(c=>{


                            c.classList.remove(
                                "active"
                            );


                        });







                        // ajouter actif

                        carte.classList.add(
                            "active"
                        );







                        const idUtilisateur =
                        carte.dataset.id;







                        // retrouver l'utilisateur complet

                        const utilisateur =
                        listeUtilisateursGlobal.find(
                            u =>
                            u.id_utilisateur == idUtilisateur
                        );







                        if(utilisateur){



                            // mémoriser

                            utilisateurSelectionne =
                            utilisateur;




                            // afficher informations

                            afficherInfoUtilisateur(
                                utilisateur
                            );


                        }




                    }
                );



            });



        }



    }
    catch(error){


        console.error(
            "Erreur chargement utilisateurs :",
            error
        );


    }


}









// =====================================
// AFFICHER INFORMATIONS UTILISATEUR
// =====================================

function afficherInfoUtilisateur(utilisateur){



    const zone =
    document.getElementById(
        "contenuInfoUtilisateur"
    );



    zone.style.display = "block";

    document
    .getElementById(
        "contenuDetailUtilisateur"
    )
    .style.display = "none";





    zone.innerHTML = `



    <div class="profil-utilisateur">



        <div class="photo-profil">


            ${
                utilisateur.photo

                ?

                `
                <img 
                src="${utilisateur.photo}">
                `

                :

                `
                <i class="fa-solid fa-user"></i>
                `

            }


        </div>





        <h2>

            ${utilisateur.nom ?? ""}

            ${utilisateur.postnom ?? ""}

            ${utilisateur.prenom ?? ""}

        </h2>






        <p>
            <i class="fa-solid fa-envelope"></i>

            <b>Email :</b>

            ${utilisateur.email ?? "-"}

        </p>





        <p>
            <i class="fa-solid fa-phone"></i>

            <b>Téléphone :</b>

            ${utilisateur.telephone ?? "-"}

        </p>





        <p>
            <i class="fa-solid fa-user-shield"></i>

            <b>Rôle :</b>

            ${utilisateur.role ?? "-"}

        </p>


        <p>
            <i class="fa-solid fa-user-shield"></i>

            <b>Mp :</b>

            ${utilisateur.mot_de_passe  ?? "-"}

        </p>




        <p>
            <i class="fa-solid fa-school"></i>

            <b>École :</b>

            ${
                utilisateur.nom_ecole
                ??
                "Aucune école"
            }

        </p>





        <p>
            <i class="fa-solid fa-circle"></i>

            <b>Statut :</b>

            ${
                utilisateur.statut
                ??
                "-"
            }

        </p>




    </div>



    `;


}








// =====================================
// AFFICHER DETAILS UTILISATEUR
// =====================================

function afficherDetailUtilisateur(){



    const zone =
    document.getElementById(
        "contenuDetailUtilisateur"
    );




    if(!utilisateurSelectionne){


        zone.innerHTML = `

            <p>
            Aucun utilisateur sélectionné.
            </p>

        `;

        return;

    }





    const utilisateur =
    utilisateurSelectionne;




    zone.innerHTML = `


    <div class="details-utilisateur-box">


        <h2>
            Détails du compte
        </h2>




        <p>
            <b>ID :</b>

            ${utilisateur.id_utilisateur}

        </p>





        <p>
            <b>Date création :</b>

            ${
                utilisateur.date_creation
                ??
                "-"
            }

        </p>





        <p>
            <b>Dernière connexion :</b>

            ${
                utilisateur.derniere_connexion
                ??
                "Jamais connecté"
            }

        </p>





        <p>
            <b>École associée :</b>

            ${
                utilisateur.nom_ecole
                ??
                "Aucune"
            }

        </p>





        <p>
            <b>Date modification :</b>

            ${
                utilisateur.date_modification
                ??
                "-"
            }

        </p>



    </div>


    `;


}







// =====================================
// GESTION DES ONGLES
// =====================================


document
.getElementById("ongletInfo")
.addEventListener(
"click",
()=>{


    document
    .getElementById(
        "contenuInfoUtilisateur"
    )
    .style.display="block";



    document
    .getElementById(
        "contenuDetailUtilisateur"
    )
    .style.display="none";


});






document
.getElementById("ongletDetail")
.addEventListener(
"click",
()=>{


    document
    .getElementById(
        "contenuInfoUtilisateur"
    )
    .style.display="none";



    document
    .getElementById(
        "contenuDetailUtilisateur"
    )
    .style.display="block";



    afficherDetailUtilisateur();


});

chargerListeUtilisateurs();




// =====================================
// AFFICHER LES INFORMATIONS UTILISATEUR
// =====================================


function afficherInfoUtilisateur(utilisateur){

    utilisateurSelectionne = utilisateur;
    const zone = document.getElementById(
        "contenuInfoUtilisateur"
    );
    zone.innerHTML = `

    <div class="carte-information">
        <h2>

            ${utilisateur.nom ?? ""}
            ${utilisateur.postnom ?? ""}
            ${utilisateur.prenom ?? ""}
        </h2>

        <hr>

        <p>
            <i class="fa-solid fa-envelope"></i>
            <b>Email :</b>
            ${
                utilisateur.email
                ??
                "-"
            }
        </p>


        <p>
            <i class="fa-solid fa-phone"></i>
            <b>Téléphone :</b>
            ${
                utilisateur.telephone
                ??
                "-"
            }
        </p>







        <p>
            <i class="fa-solid fa-user-shield"></i>
            <b>Rôle :</b>
            ${
                utilisateur.role
                ??
                "-"
            }
        </p>







        <p>
            <i class="fa-solid fa-school"></i>
            <b>École :</b>
            ${
                utilisateur.nom_ecole
                ??
                "Aucune école"
            }
        </p>







        <p>
            <i class="fa-solid fa-circle"></i>
            <b>Statut :</b>
            ${
                utilisateur.statut
                ??
                "-"
            }
        </p>





        <p>
            <i class="fa-solid fa-calendar"></i>
            <b>Date création :</b>
            ${
                utilisateur.date_creation
                ??
                "-"
            }
        </p>





    </div>
    `;



}
}








// la partie tableau principal...///////////////////////////////////////////////////////////////////////////
document
.getElementById("menuDashboard")
.addEventListener("click", afficherDashboard);







function afficherDashboard(){

    const contenu = document.getElementById("contenuPrincipal");

    contenu.innerHTML = `

    <div id="pageDashboard">


        <div class="title">

            <h1>
                Tableau de bord
            </h1>


            <button id="boutonNouvelleEcole">
                <i class="fa-solid fa-plus"></i>
                Nouvelle école
            </button>


        </div>



        <div class="cards">


            <div class="card" id="carteEcoles">

                <div class="card-title">
                    Écoles
                    <i class="fa-solid fa-school"></i>
                </div>


                <div class="number" id="nombreEcoles">
                    0
                </div>

            </div>




            <div class="card">


                <div class="card-title">
                    Actives
                    <i class="fa-solid fa-check"></i>
                </div>


                <div class="number" id="nombreEcolesActive">
                    0
                </div>


            </div>





            <div class="card">


                <div class="card-title">
                    Suspendues
                    <i class="fa-solid fa-ban"></i>
                </div>


                <div class="number" id="nombreEcolesSuspendue">
                    0
                </div>


            </div>




            <div class="card">


                <div class="card-title">
                    Utilisateurs
                    <i class="fa-solid fa-users"></i>
                </div>


                <div class="number">
                    5400
                </div>


            </div>



        </div>





        <div class="box">


            <h2>
                Dernières écoles
            </h2>



            <table>

                <thead>

                    <tr>
                        <th>Ecole</th>
                        <th>Ville</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>

                </thead>


                <tbody id="tableauEcoles">


                </tbody>


            </table>



        </div>



    </div>

    `;



    // relancer les données du dashboard

    chargerNombreEcoles();

    chargerNombreEcolesActive();

    chargerNombreEcolesSuspendue();

    afficherEcoles();



    // réactiver le bouton nouvelle école

    document
    .getElementById("boutonNouvelleEcole")
    .onclick = function(){

        document
        .getElementById("fenetreAjoutEcole")
        .style.display="flex";

    };



    // réactiver ouverture modal écoles

    document
    .getElementById("carteEcoles")
    .onclick = function(){

        document
        .getElementById("modalEcoles")
        .style.display="flex";

    };


}
/////////////////////////////////////////////////////////////////////////////////////////////////



// partie Ecoles................................................................................
document
.getElementById("menuEcoles")
.addEventListener("click", afficherEcolesPage);


function afficherEcolesPage(){
    const contenu = document.getElementById("contenuPrincipal");
    contenu.innerHTML = `


    <div id="pageEcoles">
        <div class="title">
            <h1>
                Gestion des écoles
            </h1>


            <button id="boutonNouvelleEcole">
                <i class="fa-solid fa-plus"></i>
                Nouvelle école
            </button>


    </div>




        <div class="box">


            <h2>
                Liste des écoles
            </h2>



            <table>


                <thead>

                    <tr>

                        <th>
                            École
                        </th>

                        <th>
                            Adresse
                        </th>

                        <th>
                            Statut
                        </th>

                        <th>
                            Date création
                        </th>

                        <th>
                            Action
                        </th>


                    </tr>


                </thead>



                <tbody id="tableauEcoles">

                </tbody>


            </table>


        </div>



    </div>


    `;



    // recharge les données

    afficherEcoles();



    // bouton nouvelle école

    document
    .getElementById("boutonNouvelleEcole")
    .onclick = function(){


        document
        .getElementById("fenetreAjoutEcole")
        .style.display="flex";

    };
}
// fin partie Ecole...................................................................











// partie Abonnement ..................................................................
document
.getElementById("menuAbonnements")
.addEventListener("click", afficherAbonnements);





function afficherAbonnements(){


    const contenu = document.getElementById("contenuPrincipal");


    contenu.innerHTML = `


    <div id="pageAbonnements">


        <div class="title">


            <h1>
                Gestion des abonnements
            </h1>



            <button id="btnNouvelAbonnement">

                <i class="fa-solid fa-plus"></i>

                Nouvel abonnement

            </button>


        </div>




        <div class="cards">


            <div class="card">

                <div class="card-title">

                    Abonnements actifs

                    <i class="fa-solid fa-check"></i>

                </div>


                <div class="number">

                    0

                </div>


            </div>



            <div class="card">


                <div class="card-title">

                    Expirés

                    <i class="fa-solid fa-clock"></i>

                </div>


                <div class="number">

                    0

                </div>


            </div>



            <div class="card">


                <div class="card-title">

                    Revenus

                    <i class="fa-solid fa-money-bill-wave"></i>

                </div>


                <div class="number">

                    0 $

                </div>


            </div>



        </div>





        <div class="box">


            <h2>
                Liste des abonnements
            </h2>



            <table>


                <thead>

                    <tr>

                        <th>
                            École
                        </th>


                        <th>
                            Plan
                        </th>


                        <th>
                            Date début
                        </th>


                        <th>
                            Date fin
                        </th>


                        <th>
                            Statut
                        </th>


                        <th>
                            Action
                        </th>


                    </tr>


                </thead>



                <tbody id="tableauAbonnements">


                </tbody>


            </table>



        </div>



    </div>


    `;

    // on va develloper cette fonction apres.
    //chargerAbonnements();
}
// fin parti.............................................................................................






// partie Rapport ///////////////////////////////////////////////////////////////////////////////////////
document
.getElementById("menuRapports")
.addEventListener("click", afficherRapports);




function afficherRapports(){
    const contenu = document.getElementById("contenuPrincipal");

    contenu.innerHTML = `


    <div id="pageRapports">



        <div class="title">


            <h1>
                Rapports et statistiques
            </h1>


        </div>





        <div class="cards">


            <div class="card">


                <div class="card-title">

                    Total écoles

                    <i class="fa-solid fa-school"></i>

                </div>


                <div 
                class="number"
                id="rapportNombreEcoles">

                    0

                </div>


            </div>




            <div class="card">


                <div class="card-title">

                    Utilisateurs

                    <i class="fa-solid fa-users"></i>

                </div>


                <div 
                class="number"
                id="rapportNombreUtilisateurs">

                    0

                </div>


            </div>





            <div class="card">


                <div class="card-title">

                    Abonnements actifs

                    <i class="fa-solid fa-credit-card"></i>

                </div>


                <div 
                class="number"
                id="rapportAbonnements">

                    0

                </div>


            </div>




            <div class="card">


                <div class="card-title">

                    Revenus

                    <i class="fa-solid fa-chart-line"></i>

                </div>


                <div 
                class="number"
                id="rapportRevenus">

                    0

                </div>


            </div>


        </div>






        <div class="box">


            <h2>
                Synthèse générale
            </h2>



            <table>


                <thead>


                    <tr>

                        <th>
                            Indicateur
                        </th>


                        <th>
                            Valeur
                        </th>


                        <th>
                            Date
                        </th>


                    </tr>


                </thead>



                <tbody id="tableauRapports">


                </tbody>


            </table>



        </div>




    </div>


    `;


    // on va develloper cette fonction apres.
    //chargerRapports();


}

//la fin de la partie
//////////////////////////////////////////////////////////////////////////////////////////////////////

document
.getElementById("menuParametres")
.addEventListener("click", afficherParametres);

function afficherParametres(){


    const contenu = document.getElementById("contenuPrincipal");


    contenu.innerHTML = `


    <div id="pageParametres">



        <div class="title">


            <h1>
                Paramètres de la plateforme
            </h1>


        </div>





        <div class="box">


            <h2>
                Configuration générale
            </h2>



            <div class="groupeChamp">

                <label>
                    Nom de la plateforme
                </label>


                <input 
                type="text"
                id="nomPlateforme"
                value="School ERP">

            </div>




            <div class="groupeChamp">


                <label>
                    Email administrateur
                </label>


                <input 
                type="email"
                id="emailAdmin"
                placeholder="admin@schoolerp.com">


            </div>





            <div class="groupeChamp">


                <label>
                    Langue système
                </label>


                <select id="langueSysteme">


                    <option>
                        Français
                    </option>


                    <option>
                        English
                    </option>


                </select>


            </div>





            <button id="btnSauverParametres">


                <i class="fa-solid fa-save"></i>

                Enregistrer


            </button>



        </div>







        <div class="box">


            <h2>
                Gestion du compte
            </h2>


            <button>

                <i class="fa-solid fa-key"></i>

                Modifier le mot de passe

            </button>



            <button>
                <i class="fa-solid fa-right-from-bracket"></i>
                Déconnexion
            </button>
        </div>
    </div>
    `;



    document
    .getElementById("btnSauverParametres")
    .addEventListener(
        "click",
        sauvegarderParametres
    );
}