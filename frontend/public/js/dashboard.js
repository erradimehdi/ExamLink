// ✅ dashboard.js - Affiche tous les examens avec indication du dernier créé

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) return;

  const createdExamsList = document.getElementById("createdExams");
  const newlyCreated = JSON.parse(localStorage.getItem("newlyCreatedExam"));

  try {
    const res = await fetch(`http://localhost:3001/api/exams/by-user/${user.id}`);
    const exams = await res.json();

    if (exams.length === 0) {
      createdExamsList.innerHTML = "<li>Aucun examen créé pour l'instant.</li>";
    } else {
      createdExamsList.innerHTML = "";
    
      exams.forEach((exam) => {
        const isNew = newlyCreated && Number(newlyCreated.examId) === Number(exam.id);
        const examUrl = `${window.location.origin}/views/pass-exam.html?examId=${exam.id}&code=${exam.exam_code}`;
    
        const li = document.createElement("li");
        li.innerHTML = `
          <div style="border: 1px solid ${isNew ? '#6fcf97' : '#ccc'}; padding: 10px; border-radius: 8px; margin-bottom: 10px; background-color: ${isNew ? '#e7f9e9' : '#fff'}">
            <p style="margin: 0;">
              <strong>${exam.title}</strong> 
              ${isNew ? '<span style="color: green; font-weight: bold;">(Dernier examen créé)</span>' : ''}
            </p>
            <p style="margin: 0;">
              🔗 <input type="text" value="${examUrl}" readonly style="width: 60%; padding: 5px;">
              <button onclick="copyExamLink('${examUrl}')">Copier</button>
              <button onclick="editExam(${exam.id}, '${exam.exam_code}')">Modifier</button>
              <button onclick="deleteExam(${exam.id})">Supprimer</button>
            </p>
          </div>
        `;
        createdExamsList.appendChild(li);
      });
    }
    

    createdExamsList.innerHTML = "";

    exams.forEach((exam) => {
      const isNew = newlyCreated && Number(newlyCreated.examId) === Number(exam.id);
      const examUrl = `${window.location.origin}/views/pass-exam.html?examId=${exam.id}&code=${exam.exam_code}`;

      const li = document.createElement("li");
      li.innerHTML = `
        <div style="border: 1px solid ${isNew ? '#6fcf97' : '#ccc'}; padding: 10px; border-radius: 8px; margin-bottom: 10px; background-color: ${isNew ? '#e7f9e9' : '#fff'}">
          <p style="margin: 0;">
            <strong>${exam.title}</strong> 
            ${isNew ? '<span style="color: green; font-weight: bold;">(Dernier examen créé)</span>' : ''}
          </p>
          <p style="margin: 0;">
            🔗 <input type="text" value="${examUrl}" readonly style="width: 60%; padding: 5px;">
            <button onclick="copyExamLink('${examUrl}')">Copier</button>
            <button onclick="editExam(${exam.id}, '${exam.exam_code}')">Modifier</button>
            <button onclick="deleteExam(${exam.id})">Supprimer</button>
          </p>
        </div>
      `;
      createdExamsList.appendChild(li);
    });

    // Nettoyage
    if (newlyCreated) localStorage.removeItem("newlyCreatedExam");

  } catch (error) {
    console.error("Erreur lors du chargement des examens:", error);
  }
  // ✅ Section des examens passés
const passedList = document.getElementById("examensList");
console.log("Utilisateur connecté :", user);


fetch(`http://localhost:3001/api/responses/by-user/${user.id}`)
  .then(res => res.json())
  .then(data => {
    console.log("Examens passés récupérés :", data);
    if (data.length === 0) {
      passedList.innerHTML = "<li>Aucun examen passé pour l'instant.</li>";
      return;
    }

    data.forEach(ex => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div style="border: 1px solid #ccc; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
          <strong>${ex.title}</strong><br>
          Score : <strong>${ex.score}/100</strong> <br>
          Date : ${new Date(ex.timestamp).toLocaleString()}
        </div>
      `;
      passedList.appendChild(li);
    });
  })
  .catch(err => {
    console.error("Erreur chargement examens passés:", err);
    passedList.innerHTML = "<li>Erreur chargement...</li>";
  });

});

function copyExamLink(link) {
  navigator.clipboard.writeText(link).then(() => {
    alert("Lien copié !");
  });
}

function editExam(id, code) {
  localStorage.setItem("currentExam", JSON.stringify({ examId: id, examCode: code }));
  window.location.href = `add-questions.html?examId=${id}&code=${code}`;
}

async function deleteExam(examId) {
  const confirmDelete = confirm("Voulez-vous vraiment supprimer cet examen ?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:3001/api/exams/${examId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      alert("Examen supprimé avec succès !");
      location.reload();
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (error) {
    console.error("Erreur suppression examen:", error);
    alert("Erreur réseau lors de la suppression.");
  }
}

function goToExam() {
  const link = document.getElementById("examLink").value.trim();

  try {
    const url = new URL(link);
    const examId = url.searchParams.get("examId");
    const code = url.searchParams.get("code");

    if (!examId || !code) {
      alert("Lien invalide. Il doit contenir 'examId' et 'code'.");
      return;
    }

    // Rediriger vers la page de passage d’examen
    window.location.href = `pass-exam.html?examId=${examId}&code=${code}`;
  } catch (err) {
    alert("Lien invalide. Vérifiez le format.");
  }
}

