const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "ma_cle_secrete";

// Vérifie si l'email existe déjà (utilisé par signup.js)
router.get("/", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error(" Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    return res.status(200).json(results);
  });
});

// Inscription d'un nouvel utilisateur
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

  //  Vérifie que tous les champs sont fournis
  if (
    !type || !email || !password || !nom || !prenom ||
    !dob || !sexe || !etablissement || !filiere
  ) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format d'email invalide." });
  }


  //  Vérifie que l'email n'est pas déjà utilisé
  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error(" Erreur de vérification :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Email déjà utilisé." });
    }

    //  Insère l'utilisateur
    const insertQuery = `
      INSERT INTO users (type, email, password, nom, prenom, dob, sexe, etablissement, filiere)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [type, email, password, nom, prenom, dob, sexe, etablissement, filiere];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error(" Erreur d'insertion :", err);
        return res.status(500).json({ error: "Erreur d'enregistrement." });
      }

      console.log(" Utilisateur enregistré !");
      return res.status(201).json({ message: "Inscription réussie." });
    });
  });
});

//  Connexion d’un utilisateur
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(" Erreur login :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    const user = results[0];

    //  Génère un token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: user.type
      },
      SECRET_KEY,
      { expiresIn: "1d" } // Expiration 1 jour
    );

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        type: user.type,
        prenom: user.prenom
      }
    });
  });
});

module.exports = router;
