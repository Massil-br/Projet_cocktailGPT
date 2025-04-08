import db from '../database/db.js';

export function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Vérifie le header Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];

    // Recherche de l'utilisateur avec ce token
    db.get("SELECT id, username, email, role FROM users WHERE session_token = ?", [token], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Token invalide' });
        }

        // Ajout des infos utilisateur à la requête
        req.user = user;
        next(); // Passe à la suite
    });
}