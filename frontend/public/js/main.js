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

// ==== Animation de chargement pour login & signup ====
function runAnimation() {
    document.body.classList.add('loaded');

    const signupContainer = document.querySelector('.signup-container');
    if (signupContainer) signupContainer.classList.add('loaded');

    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.classList.add('loaded');
}

document.addEventListener('DOMContentLoaded', runAnimation);

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

// // ✅ Affichage du lien de l'examen tout juste créé
// document.addEventListener("DOMContentLoaded", () => {
//     const banner = document.getElementById("newExamBanner");
//     const exam = JSON.parse(localStorage.getItem("newlyCreatedExam"));

//     if (exam && banner) {
//         banner.style.display = "block";
//         document.getElementById("newExamTitle").textContent = exam.examId + " — " + (exam.examCode || "");
//         const fullLink = `${window.location.origin}/views/pass-exam.html?code=${exam.examCode}`;
//         document.getElementById("newExamLink").value = fullLink;
//         localStorage.removeItem("newlyCreatedExam");
//     }
// });

// function copyNewExamLink() {
//     const input = document.getElementById("newExamLink");
//     input.select();
//     document.execCommand("copy");
//     alert("Lien copié !");
// // }

// function editNewExam() {
//     const exam = JSON.parse(localStorage.getItem("currentExam"));
//     if (exam) {
//         window.location.href = `add-questions.html?examId=${exam.examId}&code=${exam.examCode}`;
//     }
// }
function togglePasteSection() {
    const section = document.getElementById("pasteSection");
    if (section.style.display === "none") {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
}
  