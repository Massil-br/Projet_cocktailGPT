import sqlite3 from 'sqlite3';
sqlite3.verbose();

// Connexion à la base de données SQLite
export const db = new sqlite3.Database("database.db", (err) => {
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
        role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin', 'owner')),
        session_token TEXT,
        csrf_token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS cocktails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    );`);
});

// Fonction pour ajouter un utilisateur
export function addUser(username, email, password, role = "user") {
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
export function getUserByEmail(email) {
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
export function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, username, email, role, session_token, csrf_token, created_at, deleted_at FROM users", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}




export default {db, addUser, getUserByEmail, getAllUsers};
// Export des fonctions et de la connexion à SQLite

