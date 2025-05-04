const express = require("express");
const cors = require("cors");
const path = require("path");

// Import des routes
const userRoutes = require("./routes/users");
const examRoutes = require("./routes/exams");
const questionRoutes = require("./routes/questions"); // ✅ Ajouté

// Initialiser express
const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());

// Servir les fichiers médias (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ Important

// Routes API
app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes); // ✅ Ajouté

// Lancer serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
