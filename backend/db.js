const mysql = require('mysql2');

//configuration de la base de donnees
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'examlink'
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
        return;
    }
    console.log('Connecté à la base de données MySQL !');
});

module.exports = connection;

