const express = require("express");
const router = express.Router();
const db = require("../db");

// Générateur de code unique
function generateRandomCode(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/exams - créer un examen
router.post("/", (req, res) => {
  const { titre, description, filiere, createdBy } = req.body;

  if (!titre || !description || !filiere || !createdBy) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const exam_code = generateRandomCode(8);

  const sql = `
    INSERT INTO exams (title, description, target, created_by, created_at, exam_code)
    VALUES (?, ?, ?, ?, NOW(), ?)
  `;

  db.query(sql, [titre, description, filiere, createdBy, exam_code], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion de l'examen :", err);
      return res.status(500).json({ error: "Erreur lors de la création de l'examen." });
    }

    res.status(201).json({
      message: "Examen créé avec succès.",
      examId: result.insertId,
      examCode: exam_code
    });
  });
});

// GET /api/exams/by-user/:userId
router.get("/by-user/:userId", (req, res) => {
    const userId = req.params.userId;
  
    const sql = "SELECT id, title, exam_code FROM exams WHERE created_by = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des examens :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
  
        res.status(200).json(results);
    });
});

router.delete("/:examId", (req, res) => {
  const examId = req.params.examId;

  const sql = "DELETE FROM exams WHERE id = ?";
  db.query(sql, [examId], (err, result) => {
    if (err) {
      console.error("Erreur suppression examen:", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    res.status(200).json({ message: "Examen supprimé avec succès." });
  });
});

  

module.exports = router;
