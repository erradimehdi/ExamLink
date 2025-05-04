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

module.exports = router;
    