const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/responses - Enregistrer réponses + score + empêcher double passage
router.post("/", (req, res) => {
  const { examId, userId, responses } = req.body;

  if (!examId || !userId || !Array.isArray(responses)) {
    return res.status(400).json({ error: "Données manquantes ou invalides." });
  }

  const checkSql = "SELECT COUNT(*) AS count FROM responses WHERE exam_id = ? AND user_id = ?";
  db.query(checkSql, [examId, userId], (err, checkResult) => {
    if (err) return res.status(500).json({ error: "Erreur vérification passage." });
    if (checkResult[0].count > 0) {
      return res.status(403).json({ error: "Examen déjà passé." });
    }

    const insertSql = "INSERT INTO responses (exam_id, user_id, question_id, answer, timestamp) VALUES ?";
    const values = responses.map(r => [
      examId,
      userId,
      r.questionId,
      JSON.stringify(r.answer),
      new Date()
    ]);

    db.query(insertSql, [values], (errInsert) => {
      if (errInsert) return res.status(500).json({ error: "Erreur enregistrement." });

      const qIds = responses.map(r => r.questionId);
      const placeholders = qIds.map(() => "?").join(",");
      const fetchSql = `SELECT id, type, expected_answer, correct_answers FROM questions WHERE id IN (${placeholders})`;

      db.query(fetchSql, qIds, (errCorrect, correctRows) => {
        if (errCorrect) return res.status(500).json({ error: "Erreur correction." });

        let totalScore = 0;

        correctRows.forEach(q => {
          const userResp = responses.find(r => r.questionId === q.id);
          if (!userResp) return;

          if (q.type === "directe") {
            if ((q.expected_answer || "").trim().toLowerCase() === (userResp.answer || "").trim().toLowerCase()) {
              totalScore += 1;
            }
          } else if (q.type === "qcm") {
            try {
              const correct = JSON.parse(q.correct_answers || "[]");
              const given = Array.isArray(userResp.answer) ? userResp.answer.map(Number).sort() : [];
              const expected = correct.map(Number).sort();
              if (JSON.stringify(given) === JSON.stringify(expected)) {
                totalScore += 1;
              }
            } catch {}
          }
        });

        const finalScore = Math.round((totalScore / correctRows.length) * 100);

        const storeSql = `INSERT INTO results (exam_id, user_id, score, timestamp) VALUES (?, ?, ?, ?)`;
        db.query(storeSql, [examId, userId, finalScore, new Date()], (errSave) => {
          if (errSave) return res.status(500).json({ error: "Erreur stockage résultat." });

          return res.status(201).json({ message: "Réponses enregistrées.", score: finalScore });
        });
      });
    });
  });
});

// GET /api/responses/by-user/:userId — Examens passés + scores
router.get("/by-user/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT e.title, r.score, r.timestamp 
    FROM results r
    JOIN exams e ON r.exam_id = e.id
    WHERE r.user_id = ?
    ORDER BY r.timestamp DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur récupération scores." });
    res.status(200).json(results);
  });
});

module.exports = router;
