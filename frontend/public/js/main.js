// Effets au survol des boutons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease-in-out';
        });

        button.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease-in-out';
        });
    });

    // Animation du logo au survol
    const logo = document.querySelector('.logo');
    logo.addEventListener('mouseover', function() {
        this.style.transition = 'transform 0.5s ease-in-out';
        this.style.transform = 'rotate(30deg)';
    });

    logo.addEventListener('mouseout', function() {
        this.style.transition = 'transform 0.5s ease-in-out';
        this.style.transform = 'rotate(0deg)';
    });
});

// Animation du logo au chargement
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    logo.style.opacity = 0;

    setTimeout(() => {
        logo.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out';
        logo.style.opacity = 1;
        logo.style.transform = 'rotate(360deg)';
    }, 500);
});

///////////////////////////////////////////////////////////////
// Redirection des boutons (avec transition) // cela fait pour le bouton "S'inscrire" et "Se connecter"
function signUp() {
    // Ajoute la classe de transition au body
    document.body.classList.add('page-transition');
    // Attend la fin de la transition avant de rediriger
    setTimeout(function() {
        window.location.href = 'signup.html';
    }, 500); // 500ms (0.5s) correspond à la durée de la transition
}

function logIn() {
    // Ajoute la classe de transition au body
    document.body.classList.add('page-transition');
    // Attend la fin de la transition avant de rediriger
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 500); // 500ms (0.5s) correspond à la durée de la transition
}
/////////////////////////////////////////////////////////////

// Animation de la page // faire meme chose pour autre page
function runAnimation() {
    document.body.classList.add('loaded');
  
    const signupContainer = document.querySelector('.signup-container');
    if (signupContainer) signupContainer.classList.add('loaded');
  
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.classList.add('loaded');
  }
  
  // Au chargement initial
  document.addEventListener('DOMContentLoaded', runAnimation);
  
  // Au retour arrière (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) { // Si la page vient du cache bfcache
      runAnimation();
    }
});
//progress bar logic
document.addEventListener('DOMContentLoaded', function() {
    // Obtient le nom du fichier de la page actuelle
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];

    // Sélectionne tous les points de la barre de progression
    const pageDots = document.querySelectorAll('.page-dot');

    // Parcourt tous les points et ajoute la classe "active" à celui correspondant à la page actuelle
    pageDots.forEach(dot => {
        if (dot.dataset.page === currentPage) {
            dot.classList.add('active');
        }
    });
});

//boutons
function goBack() {
    window.history.back();
  }
  
  function goNext() {
    const form = document.querySelector('.signup-form');
    if (form.checkValidity()) {
      window.location.href = 'confirmation.html'; // Page suivante
    } else {
      form.reportValidity(); // Affiche les erreurs de validation
    }
  }
  


