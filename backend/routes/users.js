const express = require("express");
const router = express.Router();
const db = require("../db");

// ➤ GET /api/users?email=xxx → pour vérification avant inscription
router.get("/", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    return res.status(200).json(results);
  });
});

// ➤ POST /api/users : inscription
router.post("/", (req, res) => {
  const {
    type,
    email,
    password,
    nom,
    prenom,
    dob,
    sexe,
    etablissement,
    filiere
  } = req.body;

  // ✅ Vérifier que TOUS les champs sont remplis
  if (
    !type ||
    !email ||
    !password ||
    !nom ||
    !prenom ||
    !dob ||
    !sexe ||
    !etablissement ||
    !filiere
  ) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  // 🔍 Vérifier si l'utilisateur existe déjà
  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error("❌ Erreur de vérification :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Email déjà utilisé." });
    }

    // 📝 Insertion dans la base
    const insertQuery = `
      INSERT INTO users (type, email, password, nom, prenom, dob, sexe, etablissement, filiere)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [type, email, password, nom, prenom, dob, sexe, etablissement, filiere];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("❌ Erreur d'insertion :", err);
        return res.status(500).json({ error: "Erreur d'enregistrement." });
      }

      console.log("✅ Utilisateur enregistré !");
      return res.status(201).json({ message: "Inscription réussie." });
    });
  });
});

module.exports = router;
