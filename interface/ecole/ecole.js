const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));
const adresse_ip_serveur = "http://localhost:3000/";
if(utilisateur){

    document.getElementById("nomUtilisateurConnecte").textContent =
        `${utilisateur.nom} ${utilisateur.postnom ?? ""}`;

    document.getElementById("ecoleUtilisateurConnecte").textContent =
        utilisateur.nom_ecole ?? "Aucune école";

    // Initiales de l'avatar
    const initiales =
        (utilisateur.nom?.charAt(0) ?? "") +
        (utilisateur.postnom?.charAt(0) ?? "");

    document.getElementById("avatarUtilisateur").textContent =
        initiales.toUpperCase();

}






//page eleves /////////////////////////////////////////////////////////////////////////////////
document
.getElementById("menuEleves")
.addEventListener("click", afficherEleves);



function afficherEleves(){
    const contenu = document.getElementById("contenuPrincipal");
    contenu.innerHTML = "";
    const page = document.createElement("div");
    page.id = "pageEleves";
    page.innerHTML = `
        <div class="title">
            <h1>
                Gestion des élèves
            </h1>
            <button id="btnNouvelEleve">
                <i class="fa-solid fa-plus"></i>
                Nouvel élève
            </button>
        </div>



        <div class="box">
            Liste des élèves
        </div>



        <!-- MODAL AJOUT ELEVE -->
<div id="modalNouvelEleve" class="modal">


    <div class="modal-contenu">


        <button id="btnFermerModalEleve">
            X
        </button>



        <h2>
            Nouvelle inscription élève
        </h2>




        <form id="formAjoutEleve">
            <!-- =====================
                 INFORMATIONS ELEVE
            ====================== -->

            <div class="section-eleve">


                <h3>
                    Informations de l'élève
                </h3>


                <div class="form-group">

                    <label>
                        Photo
                    </label>

                    <input
                        type="file"
                        id="photo"
                        accept="image/*">

                </div>

                <div class="form-group-photo">

                    <img
                        id="apercuPhoto"
                        src="images/default-user.png"
                        alt="Photo de l'élève"
                        width="120"
                        height="120">

                </div>



                <div class="form-group">

    <label>
        Matricule
    </label>


    <select id="mode_matricule">

        <option value="auto" selected>
            Génération automatique
        </option>


        <option value="manuel">
            Saisie manuelle
        </option>

    </select>



    <input
        type="text"
        id="matricule"
        placeholder="Matricule"
        readonly>

</div>
            

                <div class="form-group">

                    <label>
                        Nom
                    </label>

                    <input 
                        type="text"
                        id="nom">

                </div>



                <div class="form-group">

                    <label>
                        Postnom
                    </label>

                    <input 
                        type="text"
                        id="postnom">

                </div>



                <div class="form-group">

                    <label>
                        Prénom
                    </label>

                    <input 
                        type="text"
                        id="prenom">

                </div>




                <div class="form-group">

                    <label>
                        Sexe
                    </label>

                    <select id="sexe">

                        <option value="">
                            Choisir
                        </option>

                        <option value="Masculin">
                            Masculin
                        </option>

                        <option value="Feminin">
                            Feminin
                        </option>

                    </select>

                </div>




                <div class="form-group">

                    <label>
                        Date naissance
                    </label>

                    <input 
                        type="date"
                        id="date_naissance">

                </div>



                <div class="form-group">

                    <label>
                        Lieu naissance
                    </label>

                    <input 
                        type="text"
                        id="lieu_naissance">

                </div>




                <div class="form-group">

                    <label>
                        Nationalité
                    </label>

                    <input 
                        type="text"
                        id="nationalite">

                </div>




                <div class="form-group">

                    <label>
                        Téléphone
                    </label>

                    <input 
                        type="text"
                        id="telephone">

                </div>







            </div>












            <!-- =====================
                 INFORMATIONS PARENT
            ====================== -->

            <div class="section-parent">

    <h3>
        Informations du parent
    </h3>

    <div class="choix-parent">

        <label>

            <input
                type="radio"
                name="mode_parent"
                value="existant"
                checked>

            Sélectionner un parent existant

        </label>


        <label>

            <input
                type="radio"
                name="mode_parent"
                value="nouveau">

            Créer un nouveau parent

        </label>

    </div>


<!-- Parent existant -->
<div id="parentExistant">

    <div class="form-group">

        <label>
            Rechercher un parent
        </label>

        <input
            type="text"
            id="recherche_parent"
            placeholder="Nom, téléphone...">

        <button 
            type="button"
            id="btnChercherParent">
            Chercher le parent
        </button>

    </div>


    <div id="resultatsParents">

    </div>


    <input 
        type="hidden"
        id="id_parent_selectionne"
        name="id_parent_selectionne"
    >

</div>



    <!-- Nouveau parent -->
    <div id="nouveauParent" style="display:none;">
        <div class="form-group">
            <label>Nom</label>
            <input type="text" id="parent_nom">
        </div>
        <div class="form-group">
            <label>Postnom</label>
            <input type="text" id="parent_postnom">
        </div>

        <div class="form-group">
            <label>Prénom</label>
            <input type="text" id="parent_prenom">
        </div>

        <div class="form-group">
            <label>Sexe</label>
            <select id="parent_sexe">
                <option>Masculin</option>
                <option>Féminin</option>
            </select>
        </div>
        <div class="form-group">
            <label>Téléphone</label>
            <input type="text" id="parent_telephone">
        </div>

        <div class="form-group">
            <label>Profession</label>
            <input type="text" id="profession">
        </div>

        <div class="form-group">
            <label>Type responsable</label>
            <select id="type_responsable">
                <option>Père</option>
                <option>Mère</option>
                <option>Tuteur</option>
                <option>Autre</option>
            </select>
        </div>
    </div>
</div>






            <!-- =====================
                 INSCRIPTION
            ====================== -->

            <div class="section-inscription">


                <h3>
                    Informations d'inscription
                </h3>




                <div class="ligne-inscription">



                    <div class="form-group">

                        <label>
                            Classe
                        </label>


                        <select id="id_classe">

                            <option>
                                Choisir classe
                            </option>

                        </select>


                    </div>





                    <div class="form-group">

                        <label>
                            Année scolaire
                        </label>


                        <select id="id_annee_scolaire">

                            <option>
                                Choisir année
                            </option>


                        </select>


                    </div>





                    <div class="form-group">

                        <label>
                            Date inscription
                        </label>


                        <input 
                            type="date"
                            id="date_inscription">


                    </div>





        <div class="form-group">

            <label>
                Numéro d'inscription
            </label>

            <select id="mode_numero_inscription">

                <option value="auto" selected>
                    Génération automatique
                </option>

                <option value="manuel">
                    Saisie manuelle
                </option>

            </select>

            <input
                type="text"
                id="numero_inscription"
                placeholder="Numéro d'inscription"
                disabled>

        </div>



                </div>




                <div class="form-group">


                    <label>
                        Observation
                    </label>


                    <textarea 
                        id="observation">
                    </textarea>


                </div>




            </div>







            <button type="submit">

                Enregistrer l'inscription

            </button>



        </form>



    </div>


</div>

<div id="notification"></div>
    `;


    contenu.appendChild(page);



    // seulement maintenant le bouton existe

    document
    .getElementById("btnNouvelEleve")
    .addEventListener(
        "click",
        ouvrirModalNouvelEleve
    );



    document
    .getElementById("btnFermerModalEleve")
    .addEventListener(
        "click",
        fermerModalNouvelEleve
    );





// =====================================
// PREVISUALISATION PHOTO ELEVE
// =====================================

const inputPhoto = document.getElementById("photo");
const apercuPhoto = document.getElementById("apercuPhoto");


inputPhoto.addEventListener("change", function(){

    if(this.files && this.files[0]){

        apercuPhoto.src = URL.createObjectURL(this.files[0]);

    }

});



const modeMatricule =
document.getElementById("mode_matricule");


const champMatricule =
document.getElementById("matricule");



async function chargerMatricule(){


    const utilisateur =
    JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if(!utilisateur){

        console.error(
            "Utilisateur introuvable"
        );

        return;

    }



    try {


        const response = await fetch(

            `${adresse_ip_serveur}generer_matricule_eleve?id_ecole=${utilisateur.id_ecole}`

        );



        const resultat =
        await response.json();



        if(resultat.success){


            champMatricule.value =
            resultat.matricule;
            afficherNotification(resultat.matricule);


        }else{
            console.error(
                resultat.message
            );
        }



    } catch(error){

        console.error(
            "Erreur génération matricule :",
            error
        );


    }


}




modeMatricule.addEventListener(
"change",
function(){

    if(this.value === "auto"){
        champMatricule.readOnly = true;
        chargerMatricule();
    }else{


        champMatricule.readOnly = false;
        champMatricule.value = "";
        champMatricule.placeholder =
        "Saisir le matricule";
    }
});



// génération dès l'ouverture du formulaire
if(modeMatricule.value === "auto"){
    chargerMatricule();
}






// =====================================
// GESTION NUMERO INSCRIPTION
// =====================================


const modeNumeroInscription =
document.getElementById("mode_numero_inscription");

const champNumeroInscription =
document.getElementById("numero_inscription");



modeNumeroInscription.addEventListener("change", function(){
    if(this.value === "auto"){
        champNumeroInscription.disabled = true;
        champNumeroInscription.value = "";
    }


    else{


        champNumeroInscription.disabled = false;

        champNumeroInscription.focus();


    }


});







// =====================================
// CHOIX PARENT EXISTANT / NOUVEAU
// =====================================


const choixModeParent =
document.querySelectorAll('input[name="mode_parent"]');


const parentExistant =
document.getElementById("parentExistant");


const nouveauParent =
document.getElementById("nouveauParent");




choixModeParent.forEach(option => {

    option.addEventListener("change", function(){
        if(this.value === "existant"){
            parentExistant.style.display = "block";
            nouveauParent.style.display = "none";
        }


        else{

            parentExistant.style.display = "none";
            nouveauParent.style.display = "block";
        }
    });

});



let parentSelectionne = null;
document.getElementById("btnChercherParent")
.addEventListener("click", ()=>{


    const recherche =
    document.getElementById("recherche_parent").value.trim();



    if(recherche.length < 2){

        afficherNotification("Entrez au moins 2 caractères");

        return;

    }



    fetch(
        adresse_ip_serveur +
        "parents/recherche?texte=" +
        encodeURIComponent(recherche)
    )


    .then(res=>res.json())
    .then(data=>{
        const zone =
        document.getElementById("resultatsParents");


        zone.innerHTML="";
        if(!data.success || data.parents.length===0){

            zone.innerHTML =
            `
            <p>
                Aucun parent trouvé
            </p>
            `;
            afficherNotification(data.success);
            return;
        }
        data.parents.forEach(parent=>{
            const div =
            document.createElement("div");
            div.className =
            "parent-resultat";
            div.innerHTML = `
                <strong>
                    ${parent.nom}
                    ${parent.postnom || ""}
                    ${parent.prenom || ""}
                </strong>

                <br>

                Téléphone :
                ${parent.telephone}
            `;
            div.onclick = ()=>{
                parentSelectionne = parent.id_parent;


                // garder aussi dans le champ caché
                document.getElementById(
                    "id_parent_selectionne"
                ).value = parent.id_parent;


                console.log(
                    "Parent sélectionné global :",
                    parentSelectionne
                );


                document.getElementById(
                    "recherche_parent"
                ).value =
                parent.nom+" "+parent.prenom;
                zone.innerHTML =
                `
                <p style="color:green">
                Parent sélectionné
                </p>
                `;
            };
            zone.appendChild(div);
        });
    })
    .catch(err=>{

        console.error(
            "Erreur recherche parent :",
            err
        );
    });
});











document
.getElementById("formAjoutEleve")
.addEventListener("submit", async function(e){

    e.preventDefault();


    const formData = new FormData();


    // =====================
    // ECOLE
    // =====================

    const utilisateur =
    JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if(!utilisateur){

        alert("Utilisateur non connecté");

        return;

    }



    formData.append(
        "id_ecole",
        utilisateur.id_ecole
    );



    // =====================
    // ELEVE
    // =====================

    formData.append(
        "photo",
        document.getElementById("photo").files[0]
    );


    formData.append(
        "matricule",
        document.getElementById("matricule").value
    );


    formData.append(
        "mode_matricule",
        document.getElementById("mode_matricule").value
    );


    formData.append(
        "nom",
        document.getElementById("nom").value
    );


    formData.append(
        "postnom",
        document.getElementById("postnom").value
    );


    formData.append(
        "prenom",
        document.getElementById("prenom").value
    );


    formData.append(
        "sexe",
        document.getElementById("sexe").value
    );


    formData.append(
        "date_naissance",
        document.getElementById("date_naissance").value
    );


    formData.append(
        "lieu_naissance",
        document.getElementById("lieu_naissance").value
    );


    formData.append(
        "nationalite",
        document.getElementById("nationalite").value
    );


    formData.append(
        "telephone",
        document.getElementById("telephone").value
    );





    // =====================
    // PARENT
    // =====================


    const modeParent =
    document.querySelector(
        'input[name="mode_parent"]:checked'
    ).value;



    formData.append(
        "mode_parent",
        modeParent
    );



    if(modeParent === "nouveau"){
        formData.append(
            "parent_nom",
            document.getElementById("parent_nom").value
        );

        formData.append(
            "parent_postnom",
            document.getElementById("parent_postnom").value
        );


        formData.append(
            "parent_prenom",
            document.getElementById("parent_prenom").value
        );


        formData.append(
            "parent_sexe",
            document.getElementById("parent_sexe").value
        );


        formData.append(
            "parent_telephone",
            document.getElementById("parent_telephone").value
        );


        formData.append(
            "profession",
            document.getElementById("profession").value
        );


        formData.append(
            "type_responsable",
            document.getElementById("type_responsable").value
        );

    }
    else{


    // =====================
    // PARENT EXISTANT
    // =====================


    formData.append(
        "id_parent_selectionne",
        parentSelectionne
    );


    console.log(
        "Parent envoyé :",
        parentSelectionne
    );

}




    // =====================
    // INSCRIPTION
    // =====================
    formData.append(
        "id_classe",
        document.getElementById("id_classe").value
    );


    formData.append(
        "id_annee_scolaire",
        document.getElementById("id_annee_scolaire").value
    );


    formData.append(
        "date_inscription",
        document.getElementById("date_inscription").value
    );


    formData.append(
        "mode_numero_inscription",
        document.getElementById("mode_numero_inscription").value
    );


    formData.append(
        "numero_inscription",
        document.getElementById("numero_inscription").value
    );


    formData.append(
        "observation",
        document.getElementById("observation").value
    );




    // ENVOI AU SERVEUR
    const response = await fetch(
        `${adresse_ip_serveur}eleves/inscription`,
        {
            method:"POST",
            body:formData
        }
    );


    const resultat = await response.json();
    console.log(resultat, 'erreur');


});


async function chargerAnneesScolaires(){
    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if(!utilisateur){
        console.error("Utilisateur non connecté");
        return;

    }


    const id_ecole = utilisateur.id_ecole;
    const select =
    document.getElementById("id_annee_scolaire");



    try {
        const response = await fetch(
            `${adresse_ip_serveur}annees-scolaires?id_ecole=${id_ecole}`
        );
        const resultat = await response.json();
        if(!resultat.success){
            console.error(
                resultat.message
            );
            return;
        }



        select.innerHTML = `

            <option value="">
                Choisir année scolaire
            </option>

        `;



        resultat.data.forEach(annee => {
            select.innerHTML += `
                <option value="${annee.id_annee}">
                    ${annee.libelle}
                </option>
            `;
        });
    } catch(error){
        console.error(
            "Erreur chargement années scolaires :",
            error
        );
    }
}





async function chargerClassesPourInscription(){


    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if(!utilisateur){

        console.error(
            "Utilisateur non connecté"
        );

        return;

    }



    const id_ecole = utilisateur.id_ecole;



    const select = document.getElementById(
        "id_classe"
    );



    try {


        const response = await fetch(

            `${adresse_ip_serveur}chargement_classe_pour_inscription?id_ecole=${id_ecole}`

        );



        const resultat = await response.json();



        if(!resultat.success){


            console.error(
                resultat.message
            );

            return;

        }



        select.innerHTML = `

            <option value="">
                Choisir classe
            </option>

        `;



        resultat.data.forEach(classe => {


            select.innerHTML += `

                <option value="${classe.id_classe}">
                    ${classe.nom_classe} - ${classe.nom_section}
                </option>

            `;


        });



    } catch(error){
        console.error(
            "Erreur chargement classes inscription :",
            error
        );
    }
}


















chargerAnneesScolaires();
chargerClassesPourInscription();
}




function ouvrirModalNouvelEleve(){
    document
    .getElementById("modalNouvelEleve")
    .style.display = "flex";

}



function fermerModalNouvelEleve(){

    document
    .getElementById("modalNouvelEleve")
    .style.display = "none";
}







// =====================================
// MENU PARENTS
// =====================================

document
.getElementById("menuParents")
.addEventListener("click", afficherParents);



function afficherParents(){

    const contenu = document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML = "";



    const page = document.createElement("div");

    page.id = "pageParents";



    page.innerHTML = `



    <div class="parent-header">

        <h1>
            Gestion des parents
        </h1>


        <button 
        class="parent-btn-ajouter"
        id="btnNouveauParent">


            <i class="fa-solid fa-plus"></i>

            Nouveau parent


        </button>


    </div>






    <div class="parent-box">


        <h2>
            Liste des parents
        </h2>



        <table class="parent-table">


            <thead>

                <tr>

                    <th>
                        Nom
                    </th>


                    <th>
                        Téléphone
                    </th>


                    <th>
                        Email
                    </th>


                    <th>
                        Élève lié
                    </th>


                    <th>
                        Action
                    </th>


                </tr>


            </thead>



            <tbody id="tableauParents">


            </tbody>


        </table>



    </div>








    <!-- MODAL AJOUT PARENT -->

    <div 
    id="modalNouveauParent"
    class="parent-modal">


        <div class="parent-modal-contenu">


            <div class="parent-modal-header">

                <h2>
                    Ajouter un parent
                </h2>


                <button
                id="btnFermerModalParent"
                class="parent-btn-fermer">

                    &times;

                </button>


            </div>





            <div class="parent-form">


                <div class="parent-groupe">


                    <label>
                        Nom
                    </label>


                    <input
                    id="nomParent"
                    type="text"
                    placeholder="Nom du parent">


                </div>






                <div class="parent-groupe">


                    <label>
                        Postnom
                    </label>


                    <input
                    id="postnomParent"
                    type="text"
                    placeholder="Postnom">


                </div>






                <div class="parent-groupe">


                    <label>
                        Prénom
                    </label>


                    <input
                    id="prenomParent"
                    type="text"
                    placeholder="Prénom">


                </div>






                <div class="parent-groupe">


                    <label>
                        Téléphone
                    </label>


                    <input
                    id="telephoneParent"
                    type="text"
                    placeholder="Téléphone">


                </div>






                <div class="parent-groupe">


                    <label>
                        Email
                    </label>


                    <input
                    id="emailParent"
                    type="email"
                    placeholder="Email">


                </div>



            </div>




            <div class="parent-actions">


                <button
                class="parent-btn-annuler"
                id="btnAnnulerParent">

                    Annuler

                </button>



                <button
                class="parent-btn-enregistrer"
                id="btnEnregistrerParent">

                    Enregistrer

                </button>


            </div>



        </div>


    </div>



    `;



    contenu.appendChild(page);






    // ouverture modal

    document
    .getElementById("btnNouveauParent")
    .addEventListener(
        "click",
        ouvrirModalNouveauParent
    );





    // fermeture X

    document
    .getElementById("btnFermerModalParent")
    .addEventListener(
        "click",
        fermerModalNouveauParent
    );





    // fermeture bouton annuler

    document
    .getElementById("btnAnnulerParent")
    .addEventListener(
        "click",
        fermerModalNouveauParent
    );



}





// =====================================
// OUVRIR MODAL
// =====================================

function ouvrirModalNouveauParent(){


    document
    .getElementById("modalNouveauParent")
    .style.display="flex";


}





// =====================================
// FERMER MODAL
// =====================================

function fermerModalNouveauParent(){


    document
    .getElementById("modalNouveauParent")
    .style.display="none";


}





















// =====================================
// MENU PAIEMENTS
// =====================================

document
.getElementById("menuPaiements")
.addEventListener(
    "click",
    afficherPaiements
);




// =====================================
// AFFICHER PAGE PAIEMENTS
// =====================================

function afficherPaiements(){


    const contenu =
    document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML = "";



    const page =
    document.createElement("div");


    page.id = "pagePaiements";



    page.innerHTML = `



    <div class="paiements-entete">


        <h1>
            Gestion des paiements
        </h1>



        <button
        id="btnNouveauPaiement"
        class="paiements-bouton-ajouter">


            <i class="fa-solid fa-plus"></i>

            Nouveau paiement


        </button>


    </div>






    <div class="paiements-boite">


        <h2>
            Liste des paiements
        </h2>





        <table class="paiements-tableau">


            <thead>

                <tr>

                    <th>
                        Reçu
                    </th>


                    <th>
                        Élève
                    </th>


                    <th>
                        Classe
                    </th>


                    <th>
                        Montant
                    </th>


                    <th>
                        Devise
                    </th>


                    <th>
                        Date
                    </th>


                    <th>
                        Action
                    </th>


                </tr>


            </thead>





            <tbody id="tableauPaiements">


            </tbody>


        </table>


    </div>









    <!-- MODAL AJOUT PAIEMENT -->


    <div
    id="modalNouveauPaiement"
    class="paiements-modal">



        <div class="paiements-modal-contenu">



            <div class="paiements-modal-entete">


                <h2>
                    Enregistrer un paiement
                </h2>



                <button
                id="btnFermerModalPaiement"
                class="paiements-bouton-fermer">

                    &times;

                </button>


            </div>







            <div class="paiements-formulaire">



                <div class="paiements-groupe">


                    <label>
                        Élève
                    </label>


                    <select id="elevePaiement">


                        <option value="">
                            Sélectionner un élève
                        </option>


                    </select>


                </div>






                <div class="paiements-groupe">


                    <label>
                        Montant
                    </label>


                    <input
                    type="number"
                    id="montantPaiement"
                    placeholder="Montant">


                </div>






                <div class="paiements-groupe">


                    <label>
                        Devise
                    </label>


                    <select id="devisePaiement">


                        <option value="USD">
                            USD
                        </option>


                        <option value="CDF">
                            CDF
                        </option>


                    </select>


                </div>






                <div class="paiements-groupe">


                    <label>
                        Motif
                    </label>


                    <input
                    type="text"
                    id="motifPaiement"
                    placeholder="Motif du paiement">


                </div>



            </div>







            <div class="paiements-actions">



                <button
                id="btnAnnulerPaiement"
                class="paiements-bouton-annuler">


                    Annuler


                </button>





                <button
                id="btnEnregistrerPaiement"
                class="paiements-bouton-enregistrer">


                    Enregistrer


                </button>



            </div>





        </div>


    </div>



    `;



    contenu.appendChild(page);






    // OUVRIR MODAL

    document
    .getElementById("btnNouveauPaiement")
    .addEventListener(
        "click",
        ouvrirModalNouveauPaiement
    );





    // FERMER MODAL

    document
    .getElementById("btnFermerModalPaiement")
    .addEventListener(
        "click",
        fermerModalNouveauPaiement
    );




    document
    .getElementById("btnAnnulerPaiement")
    .addEventListener(
        "click",
        fermerModalNouveauPaiement
    );


}






// =====================================
// OUVRIR MODAL
// =====================================

function ouvrirModalNouveauPaiement(){


    document
    .getElementById(
        "modalNouveauPaiement"
    )
    .style.display = "flex";


}







// =====================================
// FERMER MODAL
// =====================================

function fermerModalNouveauPaiement(){
    document
    .getElementById(
        "modalNouveauPaiement"
    )
    .style.display = "none";

}










// =====================================
// MENU REÇUS
// =====================================

document
.getElementById("menuRecus")
.addEventListener(
    "click",
    afficherRecus
);





function afficherRecus(){


    const contenu =
    document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML = "";



    const page =
    document.createElement("div");


    page.id = "pageRecus";



    page.innerHTML = `



    <div class="recus-entete">


        <h1>
            Gestion des reçus
        </h1>



        <button
        id="btnNouveauRecu"
        class="recus-bouton-ajouter">


            <i class="fa-solid fa-plus"></i>

            Nouveau reçu


        </button>


    </div>







    <div class="recus-conteneur">


        <h2>
            Liste des reçus
        </h2>





        <table class="tableau-recus">


            <thead>


                <tr>


                    <th>
                        Numéro reçu
                    </th>


                    <th>
                        Élève
                    </th>


                    <th>
                        Classe
                    </th>


                    <th>
                        Montant
                    </th>


                    <th>
                        Devise
                    </th>


                    <th>
                        Date
                    </th>


                    <th>
                        Action
                    </th>


                </tr>


            </thead>




            <tbody id="tableauRecus">


            </tbody>



        </table>


    </div>








    <!-- MODAL CREATION RECU -->


    <div
    id="modalNouveauRecu"
    class="recus-modal">



        <div class="recus-modal-contenu">





            <div class="recus-modal-entete">


                <h2>
                    Générer un reçu
                </h2>



                <button
                id="btnFermerModalRecu"
                class="recus-bouton-fermer">


                    &times;


                </button>


            </div>








            <div class="recus-formulaire">





                <div class="recus-groupe">


                    <label>
                        Élève
                    </label>


                    <select id="eleveRecu">


                        <option>
                            Sélectionner un élève
                        </option>


                    </select>


                </div>






                <div class="recus-groupe">


                    <label>
                        Montant
                    </label>


                    <input
                    type="number"
                    id="montantRecu"
                    placeholder="Montant">


                </div>







                <div class="recus-groupe">


                    <label>
                        Devise
                    </label>


                    <select id="deviseRecu">


                        <option value="USD">
                            USD
                        </option>


                        <option value="CDF">
                            CDF
                        </option>


                    </select>


                </div>






                <div class="recus-groupe">


                    <label>
                        Motif
                    </label>


                    <input
                    type="text"
                    id="motifRecu"
                    placeholder="Ex: Frais scolaires">


                </div>



            </div>









            <div class="recus-actions">


                <button
                id="btnAnnulerRecu"
                class="recus-annuler">


                    Annuler


                </button>





                <button
                id="btnEnregistrerRecu"
                class="recus-enregistrer">


                    Générer


                </button>



            </div>






        </div>



    </div>




    `;



    contenu.appendChild(page);






    // OUVRIR MODAL


    document
    .getElementById("btnNouveauRecu")
    .addEventListener(
        "click",
        ouvrirModalNouveauRecu
    );





    // FERMER MODAL


    document
    .getElementById("btnFermerModalRecu")
    .addEventListener(
        "click",
        fermerModalNouveauRecu
    );




    document
    .getElementById("btnAnnulerRecu")
    .addEventListener(
        "click",
        fermerModalNouveauRecu
    );


}








// =====================================
// OUVRIR MODAL REÇU
// =====================================

function ouvrirModalNouveauRecu(){


    document
    .getElementById(
        "modalNouveauRecu"
    )
    .style.display="flex";


}









// =====================================
// FERMER MODAL REÇU
// =====================================

function fermerModalNouveauRecu(){


    document
    .getElementById(
        "modalNouveauRecu"
    )
    .style.display="none";


}





//la page section
document
.getElementById("menuSections")
.addEventListener(
    "click",
    afficherSections
);

function afficherSections(){

    const contenu = document.getElementById("contenuPrincipal");

    contenu.innerHTML = "";

    const page = document.createElement("div");

    page.id = "pageSections";

    page.innerHTML = `

        <div class="title">

            <h1>
                Gestion des sections
            </h1>


            <button id="btnNouvelleSection">

                <i class="fa-solid fa-plus"></i>

                Nouvelle section

            </button>


        </div>



        <div class="box">

            <h2>
                Liste des sections
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>
                            Section
                        </th>

                        <th>
                            Description
                        </th>

                        <th>
                            Statut
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody id="tableauSections">

                </tbody>


            </table>
        </div>




<!-- MODAL AJOUT SECTION -->

<div 
id="modalNouvelleSection"
class="modal">


    <div class="modal-contenu">


        <div class="modal-entete">

            <h2>
                Nouvelle section
            </h2>


            <button
            id="btnFermerModalSection"
            class="btn-fermer">

                &times;

            </button>


        </div>




        <div class="form-groupe">

            <label>
                Nom de la section
            </label>


            <input
            type="text"
            id="nomSection"
            placeholder="Ex: Primaire">


        </div>




        <div class="form-groupe">


            <label>
                Description
            </label>


            <textarea
            id="descriptionSection"
            placeholder="Description de la section">
            </textarea>


        </div>





        <div class="zone-boutons">


            <button
            id="btnAnnulerSection"
            class="btn-secondaire">

                Annuler

            </button>




            <button
            id="btnEnregistrerSection"
            class="btn-principal">
                Enregistrer
            </button>
        </div>
    </div>
</div>

<div id="notification" class="notification"></div>
`;

    contenu.appendChild(page);


// =====================================
// EVENEMENT NOUVELLE SECTION
// =====================================

document
.getElementById("btnNouvelleSection")
.addEventListener(
    "click",
    ouvrirModalNouvelleSection
);


document
.getElementById("btnFermerModalSection")
.addEventListener(
    "click",
    fermerModalNouvelleSection
);



document
.getElementById("btnAnnulerSection")
.addEventListener(
    "click",
    fermerModalNouvelleSection
);







// =====================================
// OUVRIR MODAL SECTION
// =====================================

function ouvrirModalNouvelleSection(){

    document
    .getElementById("modalNouvelleSection")
    .style.display = "flex";

}





// =====================================
// FERMER MODAL SECTION
// =====================================

function fermerModalNouvelleSection(){

    document
    .getElementById("modalNouvelleSection")
    .style.display = "none";

}





// =====================================
// ENREGISTRER UNE SECTION
// =====================================


document
.getElementById("btnEnregistrerSection")
.addEventListener(
    "click",
    enregistrerSection
);



const utilisateur = JSON.parse(
    localStorage.getItem("utilisateur")
);

const id_ecole = utilisateur.id_ecole;

async function enregistrerSection(){


    const nom =
    document
    .getElementById("nomSection")
    .value
    .trim();



    const description =
    document
    .getElementById("descriptionSection")
    .value
    .trim();





    if(!nom){

        alert(
            "Le nom de la section est obligatoire."
        );

        return;

    }





    try{


        const reponse = await fetch(

            `${adresse_ip_serveur}sections`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body: JSON.stringify({

                    id_ecole: id_ecole,

                    nom: nom,

                    description: description

                })

            }

        );





        const resultat =
        await reponse.json();





        if(resultat.success){


            afficherNotification(
                resultat.message
            );



            // fermer le modal

            fermerModalNouvelleSection();




            // vider les champs

            document
            .getElementById("nomSection")
            .value="";



            document
            .getElementById("descriptionSection")
            .value="";

            // recharger la liste
            chargerSections();
        }
        else{


            afficherNotification(
                resultat.message
            );
        }
    }
    catch(error){
        console.error(
            "Erreur ajout section :",
            error
        );
        afficherNotification(
            "Erreur de connexion au serveur."
        );
    }
}



chargerSections();

// =====================================
// CHARGER LES SECTIONS
// =====================================

async function chargerSections() {

    try {

        const utilisateur = JSON.parse(
            localStorage.getItem("utilisateur")
        );

        const id_ecole = utilisateur.id_ecole;
        console.log(id_ecole);

        const reponse = await fetch(
            `${adresse_ip_serveur}sections/liste/${id_ecole}`
        );
        const resultat = await reponse.json();
        const tableau = document.getElementById("tableauSections");
        tableau.innerHTML = "";
        if(resultat.success){
            resultat.sections.forEach(section => {
                tableau.innerHTML += `
                    <tr>
                        <td>
                            ${section.nom}
                        </td>
                        <td>
                            ${section.description ?? "-"}
                        </td>
                        <td>
                            <span class="
                                ${section.statut === "Active"
                                    ? "badge badge-actif"
                                    : "badge badge-inactif"}
                            ">
                                ${section.statut}
                            </span>
                        </td>
                        <td>
                            <button
                                class="btnModifierSection"
                                data-id="${section.id_section}">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button
                                class="btnChangerStatutSection ${section.statut === 'Inactive' ? 'statut-inactif' : 'statut-actif'}"
                                data-id="${section.id_section}">
                                <i class="fa-solid fa-power-off"></i>
                            </button>

                            <button
                                class="btnSupprimerSection"
                                data-id="${section.id_section}">
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </td>

                    </tr>
                `;

            });

        }

    }
    catch(error){

        console.error(
            "Erreur chargement sections :",
            error
        );

    }





// =====================================
// ACTIONS DES BOUTONS
// =====================================

document
.querySelectorAll(".btnModifierSection")
.forEach(bouton=>{

    bouton.addEventListener(
        "click",
        ()=>{

            console.log(
                "ID reçu :",
                bouton.dataset.id
            );

            modifierSection(
                bouton.dataset.id
            );

        }
    );

});



document
.querySelectorAll(".btnChangerStatutSection")
.forEach(bouton=>{

    bouton.addEventListener(
        "click",
        ()=>{



            changerStatutSection(
                bouton.dataset.id
            );


        }
    );

});



document
.querySelectorAll(".btnSupprimerSection")
.forEach(bouton=>{

    bouton.addEventListener(
        "click",
        ()=>{

            supprimerSection(
                bouton.dataset.id
            );

        }
    );

});











// =====================================
// CHANGER LE STATUT
// =====================================

async function changerStatutSection(idSection){

    try {

        const response = await fetch(
            `${adresse_ip_serveur}sections/changer-statut/${idSection}`,
            {
                method:"PUT"
            }
        );


        const data = await response.json();

        afficherNotification(
            "Succès",
            data.message
        );


        // recharger le tableau
        chargerSections();


    } catch(error){

        console.log(error);

        afficherNotification(
            "Erreur",
            "Impossible de changer le statut"
        );
    }

}



// =====================================
// SUPPRIMER UNE SECTION
// =====================================

async function supprimerSection(idSection){

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer cette section ?"
    );


    if(!confirmation){
        return;
    }


    try {

        const response = await fetch(
            `${adresse_ip_serveur}sections/supprimer/${idSection}`,
            {
                method:"DELETE"
            }
        );


        const data = await response.json();


        afficherNotification(
            "Suppression",
            data.message
        );


        chargerSections();


    } catch(error){

        console.log(error);

        afficherNotification(
            "Erreur",
            "Impossible de supprimer cette section"
        );

    }

}

}



//fin du code section....
}









// =====================================
// MENU CLASSES
// =====================================
//page classe...........................
document
.getElementById("menuClasses")
.addEventListener(
    "click",
    afficherClasses
);





function afficherClasses(){
    const contenu =
    document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML = "";
    const page =
    document.createElement("div");


    page.id = "pageClasses";
    page.innerHTML = `
    <div class="title">
        <h1>
            Gestion des classes
        </h1>
        <button
        id="btnNouvelleClasse">
            <i class="fa-solid fa-plus"></i>
            Nouvelle classe
        </button>
    </div>







    <div class="box">
        <h2>
            Liste des classes
        </h2>
        <table>
            <thead>
                <tr>
                    <th>
                        Classe
                    </th>
                    <th>
                        Section
                    </th>


                    <th>
                        Niveau
                    </th>


                    <th>
                        Effectif
                    </th>


                    <th>
                        Action
                    </th>


                </tr>


            </thead>





            <tbody id="tableauClasses">


            </tbody>



        </table>



    </div>








    <!-- MODAL AJOUT CLASSE -->
    <div
    id="modalNouvelleClasse"
    class="modal-classe">
        <div
        class="modal-classe-contenu">
            <div
            class="modal-classe-entete">
                <h2>
                    Ajouter une classe
                </h2>
                <button
                id="btnFermerModalClasse">
                    &times;
                </button>
            </div>
            <div class="formulaire-classe">
                <div class="groupe-classe">
                    <label>
                        Nom de la classe
                    </label>
                    <input
                    type="text"
                    id="nomClasse"
                    placeholder="Ex: 6ème A">
                </div>
                <div class="groupe-classe">
                    <label>
                        Section
                    </label>
                    <select id="sectionClasse">
                        <option>
                            Sélectionner une section
                        </option>
                    </select>
                </div>


                <div class="groupe-classe">
                    <label>
                        Capacité 
                    </label>
                    <input
                    type="text"
                    id="capacite"
                    placeholder="Ex: 30">
                </div>
                <div class="groupe-classe">
                    <label>
                        Niveau
                    </label>
                    <input
                    type="text"
                    id="niveauClasse"
                    placeholder="Ex: Primaire">
                </div>
            </div>

            <div class="actions-classe">
                <button
                id="btnAnnulerClasse">
                    Annuler
                </button>
                <button
                id="btnEnregistrerClasse">
                    Enregistrer
                </button>
            </div>
        </div>
    </div>






<!-- POPUP RECUPERATION CLASSES -->

<div 
id="modalRecupererClasse"
class="popup-recuperation-classe">


    <div class="contenu-popup-recuperation">


        <div class="entete-popup-recuperation">

            <h2>
                Classes désactivées
            </h2>


            <button id="fermerPopupRecuperation">

                &times;

            </button>


        </div>



        <div class="corps-popup-recuperation">


            <table class="tableau-classes-desactivees">


                <thead>

                    <tr>

                        <th></th>

                        <th>Classe</th>

                        <th>Section</th>

                        <th>Capacité</th>

                    </tr>

                </thead>



                <tbody id="tableauClassesDesactivees">


                </tbody>


            </table>


        </div>




        <div class="pied-popup-recuperation">


            <button id="btnRecupererClasses">

                Récupérer

            </button>


        </div>


    </div>


</div>


<button id="repupere_classe">
    <i class="fa-solid fa-rotate"></i>
    <span id="nombreClassesSupprimees">
        0
    </span>
</button>


    <div id="notification" class="notification"></div>
    `;



contenu.appendChild(page);














// bouton principal
const boutonRecupererClasse =
document.getElementById("repupere_classe");
if(boutonRecupererClasse){

    boutonRecupererClasse.addEventListener(
        "click",
        ouvrirPopupRecupererClasse
    );

}

// bouton fermer (X)
const boutonFermerPopup =
document.getElementById("fermerPopupRecuperation");

if(boutonFermerPopup){

    boutonFermerPopup.addEventListener(
        "click",
        fermerPopupRecupererClasse
    );

}




// ouvrir la popup des classes désactivées
function ouvrirPopupRecupererClasse(){
    const popup =
    document.getElementById("modalRecupererClasse");


    if(popup){
        popup.style.display = "block";


        // charger les classes désactivées
        chargerClassesDesactivees();

    }

}





// fermer la popup
function fermerPopupRecupererClasse(){
    const popup =
    document.getElementById("modalRecupererClasse");
    if(popup){
        popup.style.display = "none";
    }
    const tableau =
    document.getElementById("tableauClassesDesactivees");
    if(tableau){

        tableau.innerHTML = "";
    }
}



// ===============================
// Déplacement de la popup
// ===============================


const popup =
document.getElementById("modalRecupererClasse");


const entete =
document.querySelector(".entete-popup-recuperation");



let deplacement = false;

let positionX = 0;
let positionY = 0;



entete.addEventListener(
    "mousedown",
    function(e){


        deplacement = true;


        positionX =
        e.clientX - popup.offsetLeft;


        positionY =
        e.clientY - popup.offsetTop;


        popup.style.bottom = "auto";

        popup.style.right = "auto";


    }
);





document.addEventListener(
    "mousemove",
    function(e){


        if(!deplacement){

            return;

        }



        popup.style.left =
        (e.clientX - positionX) + "px";



        popup.style.top =
        (e.clientY - positionY) + "px";


    }
);





document.addEventListener(
    "mouseup",
    function(){

        deplacement = false;

    }
);








async function chargerClassesDesactivees(){
    try{
        const utilisateur =
        JSON.parse(
            localStorage.getItem("utilisateur")
        );

        if(!utilisateur || !utilisateur.id_ecole){
            console.error(
                "Ecole introuvable."
            );
            return;
        }

        const id_ecole =
        utilisateur.id_ecole;
        const reponse = await fetch(
            `${adresse_ip_serveur}classes/desactivees/${id_ecole}`
        );
        const resultat =
        await reponse.json();
        const tableau =
        document.getElementById(
            "tableauClassesDesactivees"
        );

        tableau.innerHTML="";
        if(resultat.success){
            resultat.classes.forEach(classe=>{
                tableau.innerHTML += `
                <tr>
                    <td>
                        <input
                        type="checkbox"
                        class="classeSelectionnee"
                        value="${classe.id_classe}">
                    </td>

                    <td>
                        ${classe.nom}
                    </td>


                    <td>
                        ${classe.section}
                    </td>



                    <td>
                        ${classe.capacite}
                    </td>
                </tr>

                `;
            });
        }
    }
    catch(error){
        console.error(
            "Erreur chargement classes désactivées :",
            error
        );
    }
}




async function recupererClassesSelectionnees(){
    const cases =
    document.querySelectorAll(
        ".classeSelectionnee:checked"
    );



    if(cases.length === 0){
        afficherNotification(
            "Veuillez sélectionner au moins une classe."
        );
        return;
    }



    const classes = [];

    cases.forEach(c=>{
        classes.push(
            c.value
        );

    });




    try{


        const reponse = await fetch(
            `${adresse_ip_serveur}classes/recuperer`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    classes:classes
                })
            }
        );

        const resultat =
        await reponse.json();
        if(resultat.success){
            afficherNotification(
                resultat.message
            );
            // actualiser la liste
            chargerClassesDesactivees();
            // fermer popup
            fermerPopupRecupererClasse();
            // recharger les classes actives
            chargerClasses();
        }
        else{
            afficherNotification(
                resultat.message
            );
        }
    }
    catch(error){
        console.error(
            "Erreur récupération classes :",
            error
        );
    }
}


chargerNombreClassesDesactivees();
async function chargerNombreClassesDesactivees(){

    const utilisateur =
    JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if(!utilisateur){
        return;
    }



    const reponse = await fetch(
        `${adresse_ip_serveur}classes/desactivees/count/${utilisateur.id_ecole}`
    );



    const resultat =
    await reponse.json();



    if(resultat.success){


        document
        .getElementById("nombreClassesSupprimees")
        .textContent =
        resultat.total;


    }


}






document
.getElementById("btnRecupererClasses")
.addEventListener(
    "click",
    recupererClassesSelectionnees
);


    // ouverture modal

    document
    .getElementById("btnNouvelleClasse")
    .addEventListener(
        "click",
        ouvrirModalNouvelleClasse
    );




    // fermeture modal

    document
    .getElementById("btnFermerModalClasse")
    .addEventListener(
        "click",
        fermerModalNouvelleClasse
    );



    document
    .getElementById("btnAnnulerClasse")
    .addEventListener(
        "click",
        fermerModalNouvelleClasse
    );



    document
    .getElementById("btnEnregistrerClasse")
    .addEventListener(
    "click",
    enregistrerClasse
    );


chargerClasses();
}



async function chargerClasses(){
    try{


        const utilisateur = JSON.parse(
            localStorage.getItem("utilisateur")
        );

        const id_ecole = utilisateur.id_ecole;
        const reponse = await fetch(
            `${adresse_ip_serveur}classes/liste/${id_ecole}`
        );



        const resultat = await reponse.json();

        const tableau = 
        document.getElementById("tableauClasses");



        tableau.innerHTML = "";

        if(resultat.success){
            resultat.classes.forEach(classe=>{
                tableau.innerHTML += `
                    <tr>
                        <td>
                            ${classe.nom}
                        </td>
                        <td>
                            ${classe.section}
                        </td>

                        <td>
                            ${classe.niveau ?? "-"}
                        </td>

                        <td>
                            ${classe.capacite}
                        </td>

                        <td>


                            <button
                            class="btnModifierClasse"
                            data-id="${classe.id_classe}">
                                <i class="fa-solid fa-pen"></i>
                            </button>



                            <button
                            class="btnSupprimerClasse"
                            data-id="${classe.id_classe}">
                                <i class="fa-solid fa-trash"></i>
                            </button>


                        </td>


                    </tr>





                `;


            });


        }
        else{
            tableau.innerHTML = `
                <tr>
                    <td colspan="5">
                        Aucune classe trouvée.
                    </td>
                </tr>
            `;
        }



    }
    catch(error){
        console.error(
            "Erreur chargement classes :",
           error
        );
    }
}


//fonction pour ouvrir le modal ajout classe.....................
function ouvrirModalNouvelleClasse(){
    document
    .getElementById(
        "modalNouvelleClasse"
    )
    .style.display="flex";
    chargerSectionsClasse();

}







async function enregistrerClasse(){


    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );


    const id_ecole = utilisateur.id_ecole;



    const nom =
    document
    .getElementById("nomClasse")
    .value
    .trim();



    const id_section =
    document
    .getElementById("sectionClasse")
    .value;



    const capacite =
    document
    .getElementById("capacite")
    .value;



    const niveau =
    document
    .getElementById("niveauClasse")
    .value
    .trim();




    if(!nom || !id_section){


        afficherNotification(
            "Le nom et la section sont obligatoires."
        );


        return;

    }




    try{


        const reponse = await fetch(

            `${adresse_ip_serveur}classes`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    id_ecole:id_ecole,

                    id_section:id_section,

                    nom:nom,

                    capacite:capacite || 40,

                    niveau:niveau

                })

            }

        );



        const resultat =
        await reponse.json();



        if(resultat.success){

            afficherNotification(
                resultat.message
            );
            chargerClasses();
            fermerModalNouvelleClasse();



            document
            .getElementById("nomClasse")
            .value="";


            document
            .getElementById("capacite")
            .value="";


            document
            .getElementById("niveauClasse")
            .value="";



            document
            .getElementById("sectionClasse")
            .value="";


        }
        else{
            afficherNotification(
                resultat.message
            );
        }
    }

    catch(error){
        console.error(
            "Erreur création classe :",
            error
        );

        afficherNotification(
            "Erreur serveur."
        );
    }
}





document.addEventListener(
"click",
function(e){


    const bouton =
    e.target.closest(".btnSupprimerClasse");


    if(bouton){


        const id_classe =
        bouton.dataset.id;


        supprimerClasse(id_classe);


    }


});





async function supprimerClasse(id_classe){


    const confirmation = confirm(
        "Voulez-vous désactiver cette classe ?\n\nElle sera supprimée automatiquement après 10 jours."
    );


    if(!confirmation){

        return;

    }



    try{


        const reponse = await fetch(

            `${adresse_ip_serveur}classes/${id_classe}`,

            {

                method:"DELETE"

            }

        );



        const resultat =
        await reponse.json();



        if(resultat.success){


            afficherNotification(
                resultat.message
            );


            // actualiser la liste des classes
            chargerClasses();



        }
        else{


            afficherNotification(
                resultat.message
            );


        }


    }
    catch(error){


        console.error(
            "Erreur désactivation classe :",
            error
        );


        afficherNotification(
            "Erreur de connexion au serveur."
        );


    }


}









//chargement de section dans la selelection................
async function chargerSectionsClasse(){
    try{
        const utilisateur = JSON.parse(
            localStorage.getItem("utilisateur")
        );
        const id_ecole = utilisateur.id_ecole;
        const reponse = await fetch(
            `${adresse_ip_serveur}sections/liste/${id_ecole}`

        );
        const resultat = await reponse.json();
        const select =
        document.getElementById("sectionClasse");
        select.innerHTML = `
            <option value="">
                Sélectionner une section
            </option>

        `;

        if(resultat.success){
            resultat.sections.forEach(section=>{
                select.innerHTML += `
                    <option value="${section.id_section}">
                        ${section.nom}
                    </option>
                `;
            });
        }
    }
    catch(error){
        console.error(
            "Erreur chargement sections :",
            error
        );
    }
}





function fermerModalNouvelleClasse(){
    document
    .getElementById(
        "modalNouvelleClasse"
    )
    .style.display="none";
}









// =====================================
// MENU FRAIS SCOLAIRES
// =====================================

document
.getElementById("menuFraisScolaires")
.addEventListener(
    "click",
    afficherFraisScolaires
);



function afficherFraisScolaires(){
    const contenu =
    document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML = "";
    const page =
    document.createElement("div");
    page.id = "pageFraisScolaires";
    page.innerHTML = `
    <div class="frais-header">
        <h1>
            Gestion des frais scolaires
        </h1>
        <button
        id="btnNouveauFrais"
        class="frais-bouton-ajouter">
            <i class="fa-solid fa-plus"></i>
            Nouveau frais

        </button>


    </div>





    <div class="frais-box">


        <h2>
            Liste des frais
        </h2>



        <table class="frais-table">


            <thead>

                <tr>

                    <th>
                        Libellé
                    </th>


                    <th>
                        Classe
                    </th>


                    <th>
                        Montant USD
                    </th>


                    <th>
                        Montant CDF
                    </th>


                    <th>
                        Année scolaire
                    </th>


                    <th>
                        Action
                    </th>


                </tr>


            </thead>



            <tbody id="tableauFraisScolaires">


            </tbody>


        </table>


    </div>







    <!-- MODAL AJOUT FRAIS -->


    <div 
    id="modalNouveauFrais"
    class="frais-modal">


        <div class="frais-modal-contenu">



            <div class="frais-modal-entete">


                <h2>
                    Ajouter un frais scolaire
                </h2>



                <button
                id="btnFermerModalFrais"
                class="frais-fermer">

                    &times;

                </button>


            </div>






            <div class="frais-formulaire">


                <div class="frais-groupe">

                    <label>
                        Libellé
                    </label>


                    <input
                    type="text"
                    id="libelleFrais"
                    placeholder="Ex: Minerval">


                </div>





                <div class="frais-groupe">

                    <label>
                        Classe
                    </label>


                    <select id="classeFrais">

                        <option>
                            Sélectionner une classe
                        </option>


                    </select>


                </div>





                <div class="frais-groupe">

                    <label>
                        Montant USD
                    </label>


                    <input
                    type="number"
                    id="montantUsdFrais">


                </div>






                <div class="frais-groupe">

                    <label>
                        Montant CDF
                    </label>


                    <input
                    type="number"
                    id="montantCdfFrais">


                </div>


            </div>






            <div class="frais-actions">


                <button
                id="btnAnnulerFrais"
                class="frais-annuler">

                    Annuler

                </button>




                <button
                id="btnEnregistrerFrais"
                class="frais-enregistrer">

                    Enregistrer

                </button>


            </div>



        </div>


    </div>


    `;



    contenu.appendChild(page);






    // ouvrir modal

    document
    .getElementById("btnNouveauFrais")
    .addEventListener(
        "click",
        ouvrirModalNouveauFrais
    );





    // fermer modal

    document
    .getElementById("btnFermerModalFrais")
    .addEventListener(
        "click",
        fermerModalNouveauFrais
    );



    document
    .getElementById("btnAnnulerFrais")
    .addEventListener(
        "click",
        fermerModalNouveauFrais
    );


}






function ouvrirModalNouveauFrais(){


    document
    .getElementById(
        "modalNouveauFrais"
    )
    .style.display="flex";


}






function fermerModalNouveauFrais(){


    document
    .getElementById(
        "modalNouveauFrais"
    )
    .style.display="none";


}







// =====================================
// MENU RAPPORTS
// =====================================

document
.getElementById("menuRapports")
.addEventListener(
    "click",
    afficherRapports
);



function afficherRapports(){

    const contenu =
    document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML = "";


    const page =
    document.createElement("div");


    page.id = "pageRapports";


    page.innerHTML = `


    <div class="entete-rapports">

        <h1>
            Rapports et statistiques
        </h1>


    </div>





    <div class="boite-rapports">


        <h2>
            Synthèse générale
        </h2>



        <table class="table-rapports">


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



    `;


    contenu.appendChild(page);

}
















// =====================================
// MENU PARAMETRES
// =====================================


document
.getElementById("menuParametres")
.addEventListener(
    "click",
    afficherParametres
);



function afficherParametres(){


    const contenu =
    document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML="";



    const page =
    document.createElement("div");


    page.id="pageParametres";



    page.innerHTML=`


    <div class="entete-parametres">

        <h1>
            Paramètres de la plateforme
        </h1>

    </div>





    <!-- CONFIGURATION GENERALE -->

    <div class="boite-parametres">


        <h2>
            Configuration générale
        </h2>



        <div class="groupe-parametre">

            <label>
                Nom de la plateforme
            </label>


            <input 
            type="text"
            value="School ERP">


        </div>




        <div class="groupe-parametre">


            <label>
                Email administrateur
            </label>


            <input 
            type="email"
            placeholder="admin@schoolerp.com">


        </div>




        <button class="bouton-enregistrer-parametre">

            <i class="fa-solid fa-save"></i>

            Enregistrer

        </button>



    </div>




<!-- ===============================
     CONFIGURATION MATRICULE ELEVE
================================ -->

<div class="boite-parametres">


    <h2>
        Configuration matricule élève
    </h2>



    <div class="groupe-parametre">

        <label>
            Nom de la configuration
        </label>

        <input
            type="text"
            id="nom_configuration_matricule"
            placeholder="Ex: Matricule standard">

    </div>




    <div class="groupe-parametre">

        <label>
            Préfixe
        </label>

        <input
            type="text"
            id="prefixe_matricule"
            value="ELV"
            placeholder="Ex: ELV">

    </div>





    <div class="groupe-parametre">

        <label>
            Format du matricule
        </label>


        <select id="format_matricule">


            <option value="{PREFIXE}-{SECTION}-{ANNEE}-{NUMERO}">

                ELV-PRI-2026-0001

            </option>



            <option value="{PREFIXE}-{ANNEE}-{NUMERO}">

                ELV-2026-0001

            </option>



            <option value="{SECTION}-{NUMERO}">

                PRI-0001

            </option>



            <option value="{ANNEE}-{NUMERO}">

                2026-0001

            </option>


        </select>


    </div>






    <div class="groupe-parametre">

        <label>
            Utiliser la section dans le matricule
        </label>


        <select id="utiliser_section">


            <option value="1">
                Oui
            </option>


            <option value="0">
                Non
            </option>


        </select>


    </div>







    <div class="groupe-parametre">

        <label>
            Nombre de chiffres du numéro
        </label>


        <input
            type="number"
            id="longueur_numero"
            value="4"
            min="1"
            max="10">


    </div>







    <div class="groupe-parametre">

        <label>
            Séparateur
        </label>


        <input
            type="text"
            id="separateur_matricule"
            value="-"
            maxlength="1">


    </div>







    <div class="groupe-parametre">

        <label>
            Exemple généré
        </label>


        <input
            type="text"
            id="exemple_matricule"
            value="ELV-PRI-2026-0001"
            disabled>


    </div>







    <button 
        class="bouton-enregistrer-parametre"
        id="btnEnregistrerMatricule">


        <i class="fa-solid fa-save"></i>

        Enregistrer configuration matricule


    </button>



</div>





    `;


    contenu.appendChild(page);





async function enregistrerConfigurationMatricule(){


    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if(!utilisateur){

        console.error(
            "Utilisateur non connecté"
        );

        return;

    }



    const data = {


        id_ecole: utilisateur.id_ecole,


        nom_configuration:
        document.getElementById(
            "nom_configuration_matricule"
        ).value,



        prefixe:
        document.getElementById(
            "prefixe_matricule"
        ).value,



        format_matricule:
        document.getElementById(
            "format_matricule"
        ).value,



        utiliser_section:
        document.getElementById(
            "utiliser_section"
        ).value,



        longueur_numero:
        document.getElementById(
            "longueur_numero"
        ).value,



        separateur:
        document.getElementById(
            "separateur_matricule"
        ).value


    };




    try{


        const response = await fetch(

            `${adresse_ip_serveur}configuration_matricule/ajouter`,

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },


                body:JSON.stringify(data)

            }

        );



        const resultat =
        await response.json();




        if(resultat.success){


            alert(
                "Configuration matricule enregistrée"
            );



        }else{


            alert(
                resultat.message
            );


        }




    }catch(error){


        console.error(
            "Erreur enregistrement configuration matricule :",
            error
        );


    }



}

}



















// =====================================
// MENU DASHBOARD
// =====================================

document
.getElementById("menuDashboard")
.addEventListener(
    "click",
    afficherDashboard
);



function afficherDashboard(){

    const contenu =
    document.getElementById(
        "contenuPrincipal"
    );


    contenu.innerHTML = "";



    const page =
    document.createElement("div");


    page.id = "pageDashboard";



    page.innerHTML = `


    <div class="topbar">


        <h1>
            Tableau de bord
        </h1>


        <input 
        class="search"
        placeholder="Rechercher un élève...">


    </div>






    <div class="cards">



        <div class="card">

            <div class="card-title">

                Élèves

                <i class="fa-solid fa-user-graduate"></i>

            </div>


            <div class="value">

                1458

            </div>


        </div>






        <div class="card">


            <div class="card-title">

                Paiements

                <i class="fa-solid fa-money-bill"></i>

            </div>


            <div class="value">

                128

            </div>


        </div>






        <div class="card">


            <div class="card-title">

                Dette

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>


            <div class="value">

                315

            </div>


        </div>






        <div class="card">


            <div class="card-title">

                Reçus

                <i class="fa-solid fa-receipt"></i>

            </div>


            <div class="value">

                1025

            </div>


        </div>


    </div>







    <div class="section">



        <div class="box chart">

            📊 Graphique des entrées financières

        </div>




        <div class="box">


            <h3>
                Caisse actuelle
            </h3>


            <br>


            <h2>
                3500 USD
            </h2>


            <br>


            <h2>
                12 500 000 CDF
            </h2>



        </div>



    </div>








    <div class="box" style="margin-top:30px;">


        <h3>
            Derniers paiements
        </h3>



        <table>


            <tr>

                <th>
                    Reçu
                </th>


                <th>
                    Élève
                </th>


                <th>
                    Classe
                </th>


                <th>
                    Montant
                </th>


                <th>
                    Etat
                </th>


            </tr>





            <tr>

                <td>
                    REC0001
                </td>


                <td>
                    Steve Kasongo
                </td>


                <td>
                    6ème A
                </td>


                <td>
                    150 USD
                </td>


                <td>

                    <span class="status">
                        Payé
                    </span>

                </td>


            </tr>






            <tr>

                <td>
                    REC0002
                </td>


                <td>
                    Grâce Ilunga
                </td>


                <td>
                    5ème B
                </td>


                <td>
                    250000 CDF
                </td>


                <td>

                    <span class="status">
                        Payé
                    </span>

                </td>


            </tr>


        </table>


    </div>



    `;



    contenu.appendChild(page);


}















function afficherNotification(
    message,
    type="success"
){


    const notification =
    document.getElementById(
        "notification"
    );



    notification.innerHTML = message;



    notification.className =
    "notification";



    if(type==="erreur"){

        notification.classList.add(
            "erreur"
        );

    }


    if(type==="info"){

        notification.classList.add(
            "info"
        );

    }



    notification.classList.add(
        "afficher"
    );



    setTimeout(()=>{


        notification.classList.remove(
            "afficher"
        );


    },3000);


}

chargerNombreEleves();
function chargerNombreEleves(){

const utilisateur = JSON.parse(
    localStorage.getItem("utilisateur")
);
const id_ecole = utilisateur.id_ecole;


    fetch(
        adresse_ip_serveur +
        "eleves/count?id_ecole=" +
        id_ecole
    )

    .then(res=>res.json())

    .then(data=>{


        if(data.success){
            document.getElementById(
                "nombreEleves"
            ).innerHTML =
            data.total;
        }
    })

    .catch(err=>{
        console.error(
            "Erreur chargement nombre élèves :",
            err
        );
    });
}