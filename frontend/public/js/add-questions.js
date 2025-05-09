// JS complet pour add-questions.js avec ajout, suppression, affichage et modification des questions

let editingQuestionId = null;

document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("typeQuestion");
  const questionForm = document.getElementById("questionForm");
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const finishExamBtn = document.getElementById("finishExamBtn");
  const questionList = document.getElementById("questionList");
  const formTitle = document.getElementById("formTitle"); // ajouté pour afficher l'état du formulaire
  const cancelEditBtn = document.getElementById("cancelEditBtn"); // bouton pour annuler la modification

  const examParams = new URLSearchParams(window.location.search);
  const examId = examParams.get("examId");
  const examCode = examParams.get("code");

  if (!examId || !examCode) {
    alert("Paramètres d'examen manquants !");
    return;
  }

  function renderForm(type, data = {}) {
    formTitle.textContent = editingQuestionId ? "Entrain de modifier..." : "Ajouter une question";
    cancelEditBtn.style.display = editingQuestionId ? "inline-block" : "none";

    if (type === "qcm") {
      questionForm.innerHTML = `
        <div class="form-group">
          <label>Énoncé :</label>
          <textarea id="questionText" required>${data.text || ""}</textarea>
        </div>

        <div class="form-group">
          <label>Média (facultatif) :</label>
          <input type="file" id="media" />
        </div>

        <div id="qcmOptions"></div>
        <button type="button" id="addOptionBtn">+ Ajouter une option</button>

        <div class="form-group">
          <label>Note :</label>
          <input type="number" id="note" required value="${data.note || ""}" />
        </div>

        <div class="form-group">
          <label>Durée (en secondes) :</label>
          <input type="number" id="duration" required value="${data.duration || ""}" />
        </div>
      `;

      document.getElementById("addOptionBtn").addEventListener("click", addQCMOption);

      if (data.options) {
        data.options.forEach((opt, idx) => addQCMOption(opt, data.correct[idx]));
      } else {
        addQCMOption();
      }
    } else {
      questionForm.innerHTML = `
        <div class="form-group">
          <label>Énoncé :</label>
          <textarea id="questionText" required>${data.text || ""}</textarea>
        </div>

        <div class="form-group">
          <label>Média (facultatif) :</label>
          <input type="file" id="media" />
        </div>

        <div class="form-group">
          <label>Réponse attendue :</label>
          <input type="text" id="expectedAnswer" required value="${data.expected_answer || ""}" />
        </div>

        <div class="form-group">
          <label>Taux de tolérance (%) :</label>
          <input type="number" id="tolerance" min="0" max="100" value="${data.tolerance || 0}" />
        </div>

        <div class="form-group">
          <label>Note :</label>
          <input type="number" id="note" required value="${data.note || ""}" />
        </div>

        <div class="form-group">
          <label>Durée (en secondes) :</label>
          <input type="number" id="duration" required value="${data.duration || ""}" />
        </div>
      `;
    }
  }

  window.addQCMOption = function (value = "", isCorrect = false) {
    const qcmOptions = document.getElementById("qcmOptions");
    const index = qcmOptions.children.length;

    const optionDiv = document.createElement("div");
    optionDiv.classList.add("form-group", "qcm-option-group");

    optionDiv.innerHTML = `
      <input type="text" placeholder="Option ${index + 1}" class="qcm-option" value="${value}" />
      <label>
        <input type="checkbox" class="qcm-correct" ${isCorrect ? "checked" : ""} /> Bonne réponse
      </label>
      <button type="button" class="remove-option-btn" style="margin-left:10px;">❌</button>
    `;

    optionDiv.querySelector(".remove-option-btn").addEventListener("click", () => {
      optionDiv.remove();
      updateQCMOptionLabels();
    });

    qcmOptions.appendChild(optionDiv);
  };

  function updateQCMOptionLabels() {
    const optionInputs = document.querySelectorAll(".qcm-option");
    optionInputs.forEach((input, index) => {
      input.placeholder = `Option ${index + 1}`;
    });
  }

  async function loadQuestions() {
    try {
      const res = await fetch(`http://localhost:3001/api/questions/by-exam/${examId}`);
      const data = await res.json();
      questionList.innerHTML = "";

      if (data.length === 0) {
        questionList.innerHTML = "<li>Aucune question ajoutée.</li>";
        return;
      }

      data.forEach(q => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${q.text}</strong> (${q.type})
          <button class="btn btn-small" onclick="deleteQuestion(${q.id})">🗑 Supprimer</button>
          <button class="btn btn-small" onclick="editQuestion(${q.id})">✏ Modifier</button>
        `;
        questionList.appendChild(li);
      });
    } catch (err) {
      console.error("Erreur de chargement des questions:", err);
    }
  }

  window.deleteQuestion = async function (id) {
    if (!confirm("Supprimer cette question ?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/questions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadQuestions();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  window.editQuestion = async function (id) {
    try {
      const res = await fetch(`http://localhost:3001/api/questions/${id}`);
      const data = await res.json();
      if (data) {
        editingQuestionId = id;
        typeSelect.value = data.type;
        renderForm(data.type, data);
      }
    } catch (err) {
      console.error("Erreur chargement question à modifier:", err);
    }
  };

  cancelEditBtn.addEventListener("click", () => {
    editingQuestionId = null;
    renderForm(typeSelect.value);
  });

  typeSelect.addEventListener("change", () => {
    renderForm(typeSelect.value);
  });

  renderForm(typeSelect.value);
  loadQuestions();

  addQuestionBtn.addEventListener("click", async () => {
    const type = typeSelect.value;
    const text = document.getElementById("questionText").value;
    const note = document.getElementById("note").value;
    const duration = document.getElementById("duration").value;
    const mediaFile = document.getElementById("media").files[0];

    const formData = new FormData();
    formData.append("examId", examId);
    formData.append("type", type);
    formData.append("text", text);
    formData.append("note", note);
    formData.append("duration", duration);
    if (mediaFile) formData.append("media", mediaFile);

    if (type === "qcm") {
      const options = [...document.querySelectorAll(".qcm-option")].map(input => input.value);
      const correct = [...document.querySelectorAll(".qcm-correct")].map(cb => cb.checked);

      formData.append("options", JSON.stringify(options));
      formData.append("correct", JSON.stringify(correct));
    } else {
      const expected = document.getElementById("expectedAnswer").value;
      const tolerance = document.getElementById("tolerance").value;

      formData.append("expectedAnswer", expected);
      formData.append("tolerance", tolerance);
    }

    try {
      const url = editingQuestionId
        ? `http://localhost:3001/api/questions/${editingQuestionId}`
        : "http://localhost:3001/api/questions";
      const method = editingQuestionId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert(editingQuestionId ? "Question mise à jour !" : "Question ajoutée !");
        renderForm(type);
        loadQuestions();
        editingQuestionId = null;
      } else {
        alert("Erreur : " + result.error);
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
      alert("Erreur réseau.");
    }
  });

  finishExamBtn.addEventListener("click", () => {
    alert("✅ Examen créé avec succès !");
    const exam = JSON.parse(localStorage.getItem("currentExam"));
    if (exam) {
      localStorage.setItem("newlyCreatedExam", JSON.stringify(exam));
    }
    window.location.href = "dashboard.html";
  });
});
