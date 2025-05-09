function gotosignUp() {
    window.location.href = window.location.origin + "/frontend/views/signup.html";
}

function gotologIn() {
    window.location.href = window.location.origin + "/frontend/views/login.html";
}

function goBack() {
    window.history.back();
}

function logout() {
    localStorage.removeItem("user");     // ✅ supprime les infos utilisateur (où est stocké le JWT)
    localStorage.removeItem("token");    // ❗ si tu stockes le token séparément
    window.location.href = "index.html"; // 🔁 redirige vers la page de login
}
  
// function logIn() {
//     document.body.classList.add('page-transition');
//     setTimeout(function () {
//         window.location.href = 'login.html';
//     }, 500);
// }


// // Gestion du retour arrière (cache navigateur)
// window.addEventListener('pageshow', (event) => {
//     if (event.persisted) {
//         runAnimation();
//     }
// });

// // ==== Navigation boutons retour / suivant ====
// function goBack() {
//     window.history.back();
// }

// function goNext() {
//     const currentPage = window.location.pathname.split('/').pop();
  
//     if (currentPage === 'signup.html') {
//       const form = document.querySelector('.signup-form');
//       if (form && form.checkValidity()) {
//         // plus tard tu pourras faire un envoi vers backend ici
//         window.location.href = 'login.html';
//       } else {
//         form.reportValidity();
//       }

//     } else if (currentPage === 'login.html') {
//       const form = document.querySelector('.login-form');
//       if (form && form.checkValidity()) {
//         // Redirection vers dashboard ou autre page (à adapter)
//         window.location.href = 'dashboard.html'; // ou examiner.html, etc.
//       } else {
//         form.reportValidity();
//       }
  
//     } else {
//       // par défaut ou erreur
//       console.warn("Page non prise en charge pour goNext()");
//     }
//   }
  
//   // ==== dashboard js ==== // 
//   function togglePasteSection() {
//     const section = document.getElementById('pasteSection');
//     section.style.display = section.style.display === 'none' ? 'block' : 'none';
//   }

//   function goToExam() {
//     const link = document.getElementById('examLink').value.trim();
//     if (link) {
//       // Validation future côté serveur ici si nécessaire
//       window.location.href = 'create.html';
//     }
//   }

//   //fonction pour le bouton de déconnexion
//   function logout() {
//     // Effacer le token ou session
//     localStorage.removeItem('token'); // si tu utilises JWT
//     // Rediriger vers la page d'accueil
//     window.location.href = 'index.html';
//   }


