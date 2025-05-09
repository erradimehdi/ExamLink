document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const examId = params.get("examId");
  const code = params.get("code");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!examId || !code || !user?.id) {
    document.getElementById("examArea").innerHTML = "<p style='color:red;'>Lien invalide ou utilisateur non connecté.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3001/api/pass/verify?examId=${examId}&code=${code}&userId=${user.id}`);
    const data = await res.json();

    if (res.status === 403 && data.alreadyPassed) {
      document.getElementById("examArea").innerHTML = `
        <div class="question-card">
          <h3>${data.examTitle}</h3>
          <p style="color: red;">⚠️ Vous avez déjà passé cet examen.</p>
          <button class="btn btn-secondary" onclick="window.location.href='dashboard.html'">Retour au dashboard</button>
        </div>
      `;
      return;
    }

    if (res.ok) {
      document.getElementById("examArea").innerHTML = `
        <div class="question-card">
          <h3>${data.title}</h3>
          <p>Bienvenue ${user.name}. Cliquez sur "Démarrer" pour commencer.</p>
          <button class="btn btn-primary" onclick="startExam(${examId}, ${user.id})">Démarrer</button>
        </div>
      `;
    } else {
      document.getElementById("examArea").innerHTML = `<p style='color:red;'>${data.error}</p>`;
    }
  } catch (err) {
    document.getElementById("examArea").innerHTML = "<p style='color:red;'>Erreur réseau.</p>";
  }
});

let countdownInterval;
let collectedResponses = [];
let currentQuestion = null;
let questionsGlobal = [];
let userIdGlobal = null;
let examIdGlobal = null;
let userLocation = { latitude: null, longitude: null };

async function startExam(examId, userId) {
  examIdGlobal = examId;
  userIdGlobal = userId;

  // 🔁 Réinitialiser la position à chaque clic
  userLocation = { latitude: null, longitude: null };

  // Forcer une nouvelle demande de géolocalisation
  if (navigator.permissions) {
    try {
      const status = await navigator.permissions.query({ name: "geolocation" });

      if (status.state === "granted" || status.state === "prompt") {
        getLocationAndStart(examId);
      } else {
        alert("Veuillez activer la géolocalisation dans votre navigateur.");
        getLocationAndStart(examId); // Tente quand même
      }
    } catch (e) {
      getLocationAndStart(examId); // fallback si navigateur ne supporte pas permissions API
    }
  } else {
    getLocationAndStart(examId);
  }
}


async function continueExamStart(examId) {
  const res = await fetch(`http://localhost:3001/api/pass/questions?examId=${examId}`);
  questionsGlobal = await res.json();

  if (questionsGlobal.length === 0) {
    document.getElementById("examArea").innerHTML = "<p>Aucune question trouvée pour cet examen.</p>";
    return;
  }

  document.getElementById("examArea").style.display = "none";
  launchExamFlow(questionsGlobal);
}

function getLocationAndStart(examId) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.latitude = position.coords.latitude;
        userLocation.longitude = position.coords.longitude;
        continueExamStart(examId);
      },
      (error) => {
        alert("Géolocalisation refusée. L'examen commencera sans localisation.");
        continueExamStart(examId);
      }
    );
  } else {
    alert("Géolocalisation non supportée par ce navigateur.");
    continueExamStart(examId);
  }
}


function launchExamFlow(questions) {
  const container = document.getElementById("questionContainer");
  let index = 0;

  function showQuestion(i) {
    clearInterval(countdownInterval);
    const q = questions[i];
    currentQuestion = q;
    const duration = q.duration || 30;

    container.innerHTML = `
      <div class="question-card">
        <h3>Question ${i + 1}/${questions.length}</h3>
        <p>${q.text}</p>
        ${renderMedia(q.media_path)}
        ${q.type === "qcm" ? generateQCM(q) : generateDirectInput()}
        <div id="timer" style="margin-top: 15px;">⏳ Temps restant : <span id="countdown">${duration}</span>s</div>
        <button class="quiz-btn" style="margin-top: 15px;" onclick="nextQuestion()">Suivant</button>
      </div>
    `;

    let timeLeft = duration;
    countdownInterval = setInterval(() => {
      timeLeft--;
      document.getElementById("countdown").innerText = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        nextQuestion();
      }
    }, 1000);
  }

  window.nextQuestion = async function () {
    clearInterval(countdownInterval);
    saveCurrentAnswer();

    index++;
    if (index < questions.length) {
      showQuestion(index);
    } else {
      await submitAnswers();
    }
  };

  showQuestion(index);
}

function saveCurrentAnswer() {
  if (!currentQuestion) return;

  let answer;
  if (currentQuestion.type === "qcm") {
    answer = Array.from(document.querySelectorAll('input[name="qcm"]:checked')).map(el => el.value);
  } else {
    answer = document.getElementById("directAnswer")?.value?.trim() || "";
  }

  collectedResponses.push({
    questionId: currentQuestion.id,
    answer,
  });
}

async function submitAnswers() {
  const res = await fetch("http://localhost:3001/api/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      examId: examIdGlobal,
      userId: userIdGlobal,
      responses: collectedResponses,
      geolocation: {
        lat: userLocation.latitude,
        lng: userLocation.longitude
      }
    }),    
  });

  const result = await res.json();
  document.getElementById("questionContainer").innerHTML = `
    <h3>✅ Examen terminé !</h3>
    <p>Score obtenu : <strong>${result.score}/100</strong></p>
    <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">Retour au dashboard</button>
  `;
}

function generateQCM(q) {
  const options = JSON.parse(q.options || "[]");
  return `<div class="qcm-options">` + options.map((opt, idx) => `
    <label class="option-label">
      <input type="checkbox" name="qcm" value="${idx}" class="checkbox-option"> ${opt}
    </label>
  `).join("") + `</div>`;
}

function generateDirectInput() {
  return `<input type="text" id="directAnswer" placeholder="Votre réponse ici" class="input-text">`;
}

function renderMedia(path) {
  if (!path) return "";
  const fullPath = `http://localhost:3001${path}`;
  const ext = path.split('.').pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return `<img src="${fullPath}" style="max-width:100%; border-radius:8px; margin:10px 0;">`;
  } else if (["mp4", "webm", "ogg"].includes(ext)) {
    return `<video controls style="max-width:100%;"><source src="${fullPath}" type="video/${ext}"></video>`;
  } else if (["mp3", "wav"].includes(ext)) {
    return `<audio controls><source src="${fullPath}" type="audio/${ext}"></audio>`;
  } else {
    return `<p>Média non supporté</p>`;
  }
}
