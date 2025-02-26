const db = require("../database/db");

class User {
    // Ajouter un utilisateur
    static addUser(username, email, password, role = "user") {
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

    // Récupérer un utilisateur par email
    static getUserByEmail(email) {
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

    // Récupérer tous les utilisateurs
    static getAllUsers() {
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
}

module.exports = User;
