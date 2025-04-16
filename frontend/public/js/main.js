// ==== Animation boutons ====
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseover', function () {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease-in-out';
        });

        button.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease-in-out';
        });
    });

    // Animation logo (hover)
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseover', function () {
            this.style.transition = 'transform 0.5s ease-in-out';
            this.style.transform = 'rotate(30deg)';
        });

        logo.addEventListener('mouseout', function () {
            this.style.transition = 'transform 0.5s ease-in-out';
            this.style.transform = 'rotate(0deg)';
        });
    }
});

// ==== Animation logo au chargement ====
document.addEventListener('DOMContentLoaded', function () {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = 0;

        setTimeout(() => {
            logo.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out';
            logo.style.opacity = 1;
            logo.style.transform = 'rotate(360deg)';
        }, 500);
    }
});

// ==== Transitions entre pages ====
function signUp() {
    document.body.classList.add('page-transition');
    setTimeout(function () {
        window.location.href = 'signup.html';
    }, 500);
}

function logIn() {
    document.body.classList.add('page-transition');
    setTimeout(function () {
        window.location.href = 'login.html';
    }, 500);
}

// ==== Animation de chargement pour login & signup ====
function runAnimation() {
    document.body.classList.add('loaded');

    const signupContainer = document.querySelector('.signup-container');
    if (signupContainer) signupContainer.classList.add('loaded');

    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.classList.add('loaded');
}

document.addEventListener('DOMContentLoaded', runAnimation);

// Gestion du retour arrière (cache navigateur)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        runAnimation();
    }
});

// ==== Indication de page active (progress bar) ====
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    const pageDots = document.querySelectorAll('.page-dot');

    pageDots.forEach(dot => {
        if (dot.dataset.page === currentPage) {
            dot.classList.add('active');
        }
    });
});

// ==== Navigation boutons retour / suivant ====
function goBack() {
    window.history.back();
}

function goNext() {
    const form = document.querySelector('.signup-form');
    if (form && form.checkValidity()) {
        window.location.href = 'confirmation.html';
    } else if (form) {
        form.reportValidity();
    }
}

