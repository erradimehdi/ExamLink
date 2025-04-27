// 1. Fonction pour générer un code unique
function generateRandomCode(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 2. Ecouter le submit du formulaire, seulement si le formulaire existe
document.addEventListener('DOMContentLoaded', function() {
  const examForm = document.getElementById("examForm");
  if (examForm) {
    examForm.addEventListener("submit", createExam);
  }
});

// 3. Créer l'examen
async function createExam(event) {
  event.preventDefault(); // Empêcher le refresh de la page

  const titre = document.getElementById("titre").value;
  const description = document.getElementById("description").value;
  const filiere = document.getElementById("filiere").value;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Utilisateur non connecté.");
    return;
  }

  const code = generateRandomCode(8);

  const newExam = {
    titre,
    description,
    filiere,
    code,
    createdBy: user.id || user.email,
    questions: [],
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch(`${API_BASE_URL}/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExam)
    });

    if (res.ok) {
      const examData = await res.json();

      // Stocker dans localStorage pour utiliser après dans la page des questions
      localStorage.setItem("currentExam", JSON.stringify(examData));

      // ✅ Rediriger vers la page d'ajout de questions
      window.location.href = "add-questions.html";
    } else {
      alert("Erreur lors de la création de l'examen.");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Erreur réseau.");
  }
}
