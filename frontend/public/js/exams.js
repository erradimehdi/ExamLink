// Génère un code aléatoire (utilisé aussi côté backend si tu veux en double)
function generateRandomCode(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Gère le formulaire
document.addEventListener('DOMContentLoaded', function () {
  const examForm = document.getElementById("examForm");
  if (examForm) {
    examForm.addEventListener("submit", createExam);
  }
});

// Crée un examen
async function createExam(event) {
  event.preventDefault();

  const titre = document.getElementById("titre").value.trim();
  const description = document.getElementById("description").value.trim();
  const filiere = document.getElementById("filiere").value;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) {
    alert("Utilisateur non connecté.");
    return;
  }

  const newExam = {
    titre,
    description,
    filiere,
    createdBy: user.id
  };

  try {
    const res = await fetch("http://localhost:3001/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExam)
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("currentExam", JSON.stringify(data));

      // ✅ Redirige vers la page d’ajout de questions avec le code unique
      window.location.href = `add-questions.html?examId=${data.examId}&code=${data.examCode}`;
    } else {
      alert("Erreur : " + (data.error || "Création échouée"));
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
    alert("Erreur réseau.");
  }
}
