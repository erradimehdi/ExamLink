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

module.exports = router;
    