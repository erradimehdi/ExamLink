document.addEventListener('DOMContentLoaded', function() {
  // 1. Récupérer l'examen en cours
  const exam = JSON.parse(localStorage.getItem("currentExam"));
  if (!exam) {
    alert("Aucun examen trouvé. Retour au tableau de bord.");
    window.location.href = "dashboard.html";
    return;
  }

  const typeQuestion = document.getElementById("typeQuestion");
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const finishExamBtn = document.getElementById("finishExamBtn");

  if (typeQuestion) {
    typeQuestion.addEventListener("change", renderQuestionForm);
  }
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", addQuestion);
  }
  if (finishExamBtn) {
    finishExamBtn.addEventListener("click", finishExam);
  }

  renderQuestionForm();

  function renderQuestionForm() {
    const type = typeQuestion.value;
    const container = document.getElementById("questionForm");
    container.innerHTML = "";

    const commonFields = `
      <div class="form-group">
        <label for="questionText">Énoncé :</label>
        <input type="text" id="questionText" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Média :</label>
        <input type="file" id="mediaFile" class="form-control">
        <small>Ou entrer une URL :</small>
        <input type="text" id="mediaURL" class="form-control" placeholder="https://...">
      </div>
      <div class="form-group">
        <label for="note">Note :</label>
        <input type="number" id="note" class="form-control" min="1" required>
      </div>
      <div class="form-group">
        <label for="duration">Durée (en secondes) :</label>
        <input type="number" id="duration" class="form-control" min="5" required>
      </div>
    `;

    if (type === "qcm") {
      container.innerHTML = `
        ${commonFields}
        <div class="form-group">
          <label>Options :</label>
          <div><input type="checkbox" id="correct1"> <input type="text" id="option1" class="form-control" placeholder="Option 1" required></div>
          <div><input type="checkbox" id="correct2"> <input type="text" id="option2" class="form-control" placeholder="Option 2" required></div>
          <div><input type="checkbox" id="correct3"> <input type="text" id="option3" class="form-control" placeholder="Option 3" required></div>
          <div><input type="checkbox" id="correct4"> <input type="text" id="option4" class="form-control" placeholder="Option 4" required></div>
        </div>
      `;
    } else if (type === "directe") {
      container.innerHTML = `
        ${commonFields}
        <div class="form-group">
          <label for="answer">Réponse attendue :</label>
          <input type="text" id="answer" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="tolerance">Taux de tolérance (%) :</label>
          <input type="number" id="tolerance" class="form-control" min="0" max="100" value="0">
        </div>
      `;
    }
  }

  async function addQuestion() {
    const type = typeQuestion.value;
    const questionText = document.getElementById("questionText").value;
    const note = parseInt(document.getElementById("note").value);
    const duration = parseInt(document.getElementById("duration").value);

    let media = null;
    const mediaFileInput = document.getElementById("mediaFile");
    const mediaURLInput = document.getElementById("mediaURL").value;

    if (mediaFileInput && mediaFileInput.files.length > 0) {
      media = mediaFileInput.files[0].name; // Ici on enregistre juste le nom du fichier (upload à gérer plus tard)
    } else if (mediaURLInput) {
      media = mediaURLInput;
    }

    if (!questionText || isNaN(note) || isNaN(duration)) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    let question = { 
      type, 
      enonce: questionText, 
      media,
      note,
      duration
    };

    if (type === "qcm") {
      question.options = [
        document.getElementById("option1").value,
        document.getElementById("option2").value,
        document.getElementById("option3").value,
        document.getElementById("option4").value
      ];

      question.correct = [];
      for (let i = 1; i <= 4; i++) {
        if (document.getElementById(`correct${i}`).checked) {
          question.correct.push(i); // On stocke les numéros des bonnes réponses
        }
      }
    } else if (type === "directe") {
      question.reponse = document.getElementById("answer").value;
      question.tolerance = parseInt(document.getElementById("tolerance").value) || 0;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/exams/${exam.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: [...exam.questions, question]
        })
      });

      if (res.ok) {
        exam.questions.push(question);
        localStorage.setItem("currentExam", JSON.stringify(exam));
        alert("Question ajoutée !");
        renderQuestionForm(); // reset pour ajouter une autre question
      } else {
        alert("Erreur lors de l'ajout de la question.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau !");
    }
  }

  function finishExam() {
    localStorage.removeItem("currentExam");
    alert("Examen finalisé !");
    window.location.href = "dashboard.html";
  }
});
