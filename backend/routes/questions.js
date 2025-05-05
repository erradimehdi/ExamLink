const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Config stockage fichiers média
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/questions - Ajouter une question
router.post("/", upload.single("media"), (req, res) => {
  const {
    examId,
    type,
    text,
    note,
    duration,
    expectedAnswer,
    tolerance,
  } = req.body;

  const media_path = req.file ? `/uploads/${req.file.filename}` : null;
  const sql = `
    INSERT INTO questions (
      exam_id, type, text, media_path, note, duration,
      expected_answer, tolerance, options, correct_answers
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let options = null;
  let correct_answers = null;

  if (type === "qcm") {
    try {
      options = JSON.stringify(JSON.parse(req.body.options));
      correct_answers = JSON.stringify(JSON.parse(req.body.correct));
    } catch (err) {
      return res.status(400).json({ error: "Options QCM invalides." });
    }
  }

  db.query(
    sql,
    [
      examId,
      type,
      text,
      media_path,
      note,
      duration,
      expectedAnswer || null,
      tolerance || null,
      options,
      correct_answers,
    ],
    (err, result) => {
      if (err) {
        console.error("Erreur insertion question :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
      res.status(201).json({ message: "Question enregistrée." });
    }
  );
});

// GET /api/questions/:examId - Obtenir toutes les questions d’un examen
router.get("/:examId", (req, res) => {
  const examId = req.params.examId;

  const sql = "SELECT id, type, text FROM questions WHERE exam_id = ?";
  db.query(sql, [examId], (err, results) => {
    if (err) {
      console.error("Erreur récupération questions :", err);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération." });
    }

    res.status(200).json(results);
  });
});

// DELETE /api/questions/:questionId - Supprimer une question
router.delete("/:questionId", (req, res) => {
  const questionId = req.params.questionId;

  const sql = "DELETE FROM questions WHERE id = ?";
  db.query(sql, [questionId], (err, result) => {
    if (err) {
      console.error("Erreur suppression question :", err);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression." });
    }

    res.status(200).json({ message: "Question supprimée avec succès." });
  });
});

// GET /api/questions/by-exam/:examId - récupérer questions pour affichage dans le formulaire
router.get("/by-exam/:examId", (req, res) => {
    const examId = req.params.examId;
  
    const sql = "SELECT id, type, text FROM questions WHERE exam_id = ?";
    db.query(sql, [examId], (err, results) => {
      if (err) {
        console.error("Erreur récupération questions by-exam :", err);
        return res.status(500).json({ error: "Erreur serveur lors de la récupération." });
      }
  
      res.status(200).json(results);
    });
  });
  
// PUT /api/questions/:questionId - Modifier une question
router.put("/:questionId", upload.single("media"), (req, res) => {
    const {
      type,
      text,
      note,
      duration,
      expectedAnswer,
      tolerance
    } = req.body;
  
    const media_path = req.file ? `/uploads/${req.file.filename}` : null;
    const questionId = req.params.questionId;
  
    let options = null;
    let correct_answers = null;
  
    if (type === "qcm") {
      try {
        options = JSON.stringify(JSON.parse(req.body.options));
        correct_answers = JSON.stringify(JSON.parse(req.body.correct));
      } catch (err) {
        return res.status(400).json({ error: "Options QCM invalides." });
      }
    }
  
    const sql = `
      UPDATE questions
      SET type = ?, text = ?, media_path = COALESCE(?, media_path),
          note = ?, duration = ?, expected_answer = ?, tolerance = ?,
          options = ?, correct_answers = ?
      WHERE id = ?
    `;
  
    db.query(
      sql,
      [
        type,
        text,
        media_path,
        note,
        duration,
        expectedAnswer || null,
        tolerance || null,
        options,
        correct_answers,
        questionId,
      ],
      (err, result) => {
        if (err) {
          console.error("Erreur modification question :", err);
          return res.status(500).json({ error: "Erreur serveur." });
        }
        res.status(200).json({ message: "Question modifiée avec succès." });
      }
    );
  });
  

module.exports = router;
