# ExamLink - Plateforme d'examens en ligne

ExamLink est une application web permettant aux enseignants de créer des examens en ligne et aux étudiants de les passer via un lien unique. Le projet a été développé en HTML, CSS, JavaScript (frontend) et Node.js avec Express et MySQL (backend).

## Fonctionnalités principales :

✅ Inscription et connexion des utilisateurs (avec session JWT)  
✅ Création d'examens avec titre, description et lien d'accès  
✅ Ajout de questions de type QCM ou directe avec média (image, audio, vidéo)  
✅ Passage d'examen avec affichage question par question + minuterie  
✅ Correction automatique avec calcul du score final sur 100  
✅ Empêche un utilisateur de repasser le même examen  
✅ Enregistrement de la géolocalisation de l'utilisateur au moment du passage  
✅ Affichage dans le dashboard :
   - Examens créés (avec lien copiable)
   - Examens passés (avec score et date)

## Technologies utilisées :

Frontend :
- HTML / CSS / JS Vanilla

Backend :
- Node.js + Express
- MySQL
- Multer (pour l’upload de fichiers)
- JWT (authentification sécurisée)
- Levenshtein (tolérance aux erreurs sur réponses directes)

## Structure des dossiers :

- `/views/` : pages HTML (dashboard, inscription, passage examen)
- `/public/` : fichiers statiques (CSS, JS)
- `/routes/` : routes Express (users, exams, questions, responses)
- `/uploads/` : stockage des fichiers média (images, vidéos, etc.)
- `/db.js` : connexion MySQL

## Pour démarrer :

1. Cloner le projet  
2. Lancer `npm install`  
3. Configurer la base de données MySQL  
4. Lancer le serveur avec `node server.js`  
5. Accéder à l’interface via `http://localhost:3001`

---

Projet réalisé dans le cadre d’un travail universitaire sur la gestion d’examens en ligne.


## 🤝 Contributeur

- Mehdi Erradi

...