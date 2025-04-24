//import des modules
const express = require("express");
const cors = require("cors");

//import des routes
const userRoutes = require("./routes/users");

//initialiser l'application express
const app = express();

//middleware globaux
app.use(cors()); //autorise les appels frontend vers backend
app.use(express.json()); //permet de lire les donnees en JSON envoyées par le frontend

//routes
app.use("/api/users", userRoutes); //toutes les requetes vers /api/users seront gérées par userRoutes

//lancer le serveur sur le port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
