import db from '../database/db.js';
import { runQuery } from '../database/db.js';

export async function authenticateUser(req, res, next) {
    const sessionToken = req.session.sessionToken;

    if (!sessionToken) {
        return res.status(401).json({ message: 'Session invalide ou expirée' });
    }

    try {
        const rows = await runQuery(
            "SELECT id, username, email, role FROM users WHERE session_token = ?",
            [sessionToken]
        );

        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Session invalide' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Erreur lors de l\'authentification :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
}

export function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (req.user.role !== 'admin' && req.user.role !=='owner') {
        return res.status(403).json({ message: 'Accès refusé : droits insuffisants' });
    }

    next(); 
}