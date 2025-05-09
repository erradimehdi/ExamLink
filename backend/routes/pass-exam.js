const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Vérifier si l'examen existe et si l'utilisateur l'a déjà passé
router.get("/verify", (req, res) => {
  const { examId, code, userId } = req.query;

  if (!examId || !code || !userId) {
    return res.status(400).json({ error: "Paramètres manquants." });
  }

  const sql = `
    SELECT e.id, e.title FROM exams e
    WHERE e.id = ? AND e.exam_code = ?
  `;

  db.query(sql, [examId, code], (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    if (results.length === 0) return res.status(404).json({ error: "Examen introuvable ou code invalide." });

    // Vérifier si déjà répondu
    const checkSql = `SELECT * FROM responses WHERE exam_id = ? AND user_id = ? LIMIT 1`;
    db.query(checkSql, [examId, userId], (err2, passed) => {
      if (err2) return res.status(500).json({ error: "Erreur vérification." });

      if (passed.length > 0) {
        return res.status(403).json({
          error: "Vous avez déjà passé cet examen.",
          alreadyPassed: true,
          examTitle: results[0].title
        });
      }
      

      res.status(200).json(results[0]);
    });
  });
});

// ✅ Retourner les questions pour un examen
router.get("/questions", (req, res) => {
  const { examId } = req.query;

  const sql = `SELECT * FROM questions WHERE exam_id = ?`;
  db.query(sql, [examId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur chargement questions" });
    res.json(results);
  });
});

module.exports = router;
