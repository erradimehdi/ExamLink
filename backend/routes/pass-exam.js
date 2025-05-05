const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/verify", (req, res) => {
  const { examId, code } = req.query;

  const sql = "SELECT id, title FROM exams WHERE id = ? AND exam_code = ?";
  db.query(sql, [examId, code], (err, results) => {
    if (err) {
      console.error("Erreur DB :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Examen non trouvé ou lien invalide" });
    }

    res.status(200).json(results[0]);
  });
});


router.get("/questions", (req, res) => {
    const { examId } = req.query;
  
    const sql = "SELECT * FROM questions WHERE exam_id = ? ORDER BY id ASC";
    db.query(sql, [examId], (err, results) => {
      if (err) {
        console.error("Erreur récupération questions :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
  
      res.status(200).json(results);
    });
  });
  

module.exports = router;
