const sqlite3 = require("sqlite3").verbose();

// Connexion à la base de données SQLite
const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.error("Erreur lors de l'ouverture de la base de données:", err.message);
    } else {
        console.log("Connexion réussie à SQLite.");
    }
});

// Création des tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
});

// Fonction pour ajouter un utilisateur
function addUser(username, email, password, role = "user") {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
        );
        stmt.run(username, email, password, role, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, username, email, role });
            }
        });
        stmt.finalize();
    });
}

// Fonction pour récupérer un utilisateur par email
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Fonction pour récupérer tous les utilisateurs
function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, username, email, role FROM users", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Export des fonctions et de la connexion à SQLite
module.exports = { db, addUser, getUserByEmail, getAllUsers };
