document.addEventListener("DOMContentLoaded", function () {
    const questions = [];
  
    const examForm = document.getElementById("examForm");
    const questionSection = document.getElementById("questionSection");
    const questionForm = document.getElementById("questionForm");
    const typeSelect = document.getElementById("typeQuestion");
    const addQuestionBtn = document.getElementById("addQuestionBtn");
    const finishExamBtn = document.getElementById("finishExamBtn");
    const generatedLink = document.getElementById("generatedLink");
  
    let questionIndex = 1;
  
    examForm.addEventListener("submit", function (e) {
      e.preventDefault();
      examForm.style.display = "none";
      questionSection.style.display = "block";
      renderQuestionForm();
    });
  
    typeSelect.addEventListener("change", renderQuestionForm);
  
    function renderQuestionForm() {
      const type = typeSelect.value;
      questionForm.innerHTML = `
        <div class="form-group">
          <label>Énoncé de la question ${questionIndex} :</label>
          <textarea class="form-control" id="questionText" required></textarea>
        </div>
      `;
      if (type === "qcm") {
        questionForm.innerHTML += `
          <div class="form-group">
            <label>Options (séparer par | et mettre * pour la bonne réponse):</label>
            <input type="text" class="form-control" id="qcmOptions" placeholder="ex: *Paris|Lyon|Marseille">
          </div>
        `;
      } else if (type === "directe") {
        questionForm.innerHTML += `
          <div class="form-group">
            <label>Réponse attendue :</label>
            <input type="text" class="form-control" id="answerText">
          </div>
          <div class="form-group">
            <label>Taux de tolérance (%) :</label>
            <input type="number" class="form-control" id="tolerance" value="0">
          </div>
        `;
      }
    }
  
    addQuestionBtn.addEventListener("click", () => {
      const type = typeSelect.value;
      const text = document.getElementById("questionText").value;
      const question = { type, text };
  
      if (type === "qcm") {
        question.options = document.getElementById("qcmOptions").value;
      } else if (type === "directe") {
        question.answer = document.getElementById("answerText").value;
        question.tolerance = document.getElementById("tolerance").value;
      }
  
      questions.push(question);
      questionIndex++;
      renderQuestionForm();
    });
  
    finishExamBtn.addEventListener("click", () => {
      const examId = Math.random().toString(36).substring(2, 8);
      const link = `https://examlink.com/exam/${examId}`;
  
      generatedLink.style.display = "block";
      generatedLink.innerHTML = `
        <h4>Votre examen a été créé !</h4>
        <p>Nombre de questions : ${questions.length}</p>
        <p><strong>Lien d'accès :</strong> <a href="${link}" target="_blank">${link}</a></p>
      `;
  
      questionSection.style.display = "none";
    });
  });
  
  