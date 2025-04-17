# 🎓 ExamLink – Plateforme d'examens en ligne

**ExamLink** est une plateforme web intuitive permettant aux utilisateurs de créer et passer des examens en ligne de manière sécurisée et fluide.

---

## 🔧 Technologies utilisées

- **Frontend :** HTML, CSS, JavaScript
- **Backend (à venir) :** Node.js, Express.js
- **Base de données :** MySQL
- **Versionnement :** Git + GitHub

---

## 📁 Structure du projet 

exam_platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── exams.routes.js
│   │   └── users.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── exams.controller.js
│   │   └── users.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── exam.model.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   ├── create_exam.js
│   │   │   └── exams.js
│   │   └── images/
│   │       └── logo.png
│   └── views/
│       ├── index.html
│       ├── login.html
│       ├── signup.html
│       ├── dashboard.html
│       ├── create_exam.html
│       ├── take_exam.html
│       └── exams.html
│
├── database.sql
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

## ✨ Fonctionnalités actuelles

- 🎨 Interface responsive et moderne
- 🧑‍🏫 Interfae Inscriptionet Connexion
- 📌 Indicateur de page (dots)
- 🚀 Redirection logique 

---

## 📦 En cours de développement

- [ ] Connexion avec backend Node.js + Express
- [ ] Stockage sécurisé en base de données
- [ ] Création et gestion des examens (enseignants)
- [ ] Système de notation et tableau de bord étudiant

---

## 🤝 Contributeurs

- Mehdi Erradi

---
