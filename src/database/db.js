import sqlite3 from 'sqlite3';
sqlite3.verbose();

export function setTempCookie(res, message, maxAge = 5000) {
    if (res.locals && res.locals.session) {
        res.locals.session.tempMessage = message;
    }
}

// Fonction utilitaire pour exécuter une requête SQL avec db.run et retourner une promesse
export function runQuery(sql, params) {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        } else {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        }
    });
}


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
        session_expires_at DATETIME, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS cocktails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        alcohol TEXT CHECK(alcohol IN('alcohol', 'no_alcohol')),
        ingredients TEXT,
        recipe TEXT,
        image TEXT
    );`);

     // Ajout conditionnel des colonnes api_skin_name et api_skin_url
    db.all(`PRAGMA table_info(cocktails);`, (err, columns) => {
        if (err) {
            console.error("Erreur lors de la lecture de la table cocktails :", err.message);
            return;
        }

        const columnNames = columns.map(col => col.name);
        if (!columnNames.includes("api_skin_name")) {
            db.run(`ALTER TABLE cocktails ADD COLUMN api_skin_name TEXT;`);
        }
        if (!columnNames.includes("api_skin_url")) {
            db.run(`ALTER TABLE cocktails ADD COLUMN api_skin_url TEXT;`);
        }
    });
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


