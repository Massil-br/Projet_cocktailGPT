import { db, setTempCookie, runQuery } from '../database/db.js';
import bcrypt from 'bcrypt';

// Fonction pour récupérer tous les utilisateurs
export async function getAllUsers(req, res) {
    try {
        const rows = await runQuery('SELECT id, username, email, role, created_at FROM users WHERE deleted_at IS NULL', []);
        res.status(200).json(rows);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la récupération des utilisateurs');
        console.log('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour récupérer un utilisateur par ID
export async function getUserById(req, res) {
    const id = parseInt(req.params.id);

    try {
        const rows = await runQuery('SELECT id, username, email, role, created_at FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
        if (!rows || rows.length === 0) {
            setTempCookie(res, 'Utilisateur non trouvé');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la récupération de l\'utilisateur');
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour créer un nouvel utilisateur
export async function createUser(req, res) {
    const { username, email, password, role } = req.body;
    const currentUserRole = req.user.role; // Récupérer le rôle de l'utilisateur connecté

    if (!username || !email || !password || !role) {
        setTempCookie(res, 'Tous les champs sont requis');
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si le rôle est valide
    if (!['user', 'admin', 'owner'].includes(role)) {
        setTempCookie(res, 'Rôle invalide');
        return res.status(400).json({ message: 'Rôle invalide' });
    }

    // Restreindre les droits des administrateurs
    if (currentUserRole === 'admin' && role !== 'user') {
        setTempCookie(res, 'Vous ne pouvez créer que des utilisateurs normaux');
        return res.status(403).json({ message: 'Vous ne pouvez créer que des utilisateurs normaux' });
    }

    try {
        // Vérifier si l'email existe déjà
        const existingUser = await runQuery('SELECT id FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
        if (existingUser && existingUser.length > 0) {
            setTempCookie(res, 'Cet email est déjà utilisé');
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        const result = await runQuery(sql, [username, email, hashedPassword, role]);
        
        const newUser = { 
            id: result.lastID, 
            username, 
            email, 
            role,
            created_at: new Date().toISOString()
        };
        
        res.status(201).json(newUser);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la création de l\'utilisateur');
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour mettre à jour un utilisateur
export async function updateUser(req, res) {
    const id = parseInt(req.params.id);
    const { username, email, password, role } = req.body;
    const currentUserRole = req.user.role; // Récupérer le rôle de l'utilisateur connecté

    if (!username || !email || !role) {
        setTempCookie(res, 'Username, email et role sont requis');
        return res.status(400).json({ message: 'Username, email et role sont requis' });
    }

    // Vérifier si le rôle est valide
    if (!['user', 'admin', 'owner'].includes(role)) {
        setTempCookie(res, 'Rôle invalide');
        return res.status(400).json({ message: 'Rôle invalide' });
    }

    try {
        // Vérifier si l'utilisateur existe et récupérer son rôle
        const existingUser = await runQuery('SELECT id, role FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
        if (!existingUser || existingUser.length === 0) {
            setTempCookie(res, 'Utilisateur non trouvé');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Empêcher un admin de modifier un owner
        if (currentUserRole === 'admin' && existingUser[0].role === 'owner') {
            setTempCookie(res, 'Vous n\'avez pas les droits pour modifier un propriétaire');
            return res.status(403).json({ message: 'Vous n\'avez pas les droits pour modifier un propriétaire' });
        }

        // Restreindre les droits des administrateurs
        if (currentUserRole === 'admin' && role !== 'user') {
            setTempCookie(res, 'Vous ne pouvez promouvoir que des utilisateurs normaux');
            return res.status(403).json({ message: 'Vous ne pouvez promouvoir que des utilisateurs normaux' });
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        const emailCheck = await runQuery('SELECT id FROM users WHERE id != ? AND email = ? AND deleted_at IS NULL', [id, email]);
        if (emailCheck && emailCheck.length > 0) {
            setTempCookie(res, 'Cet email est déjà utilisé');
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        let sql, params;

        // Si un nouveau mot de passe est fourni, le mettre à jour
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            sql = 'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?';
            params = [username, email, hashedPassword, role, id];
        } else {
            sql = 'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?';
            params = [username, email, role, id];
        }

        const result = await runQuery(sql, params);

        if (result.changes === 0) {
            setTempCookie(res, 'Aucune modification effectuée');
            return res.status(400).json({ message: 'Aucune modification effectuée' });
        }

        const updatedUser = { 
            id, 
            username, 
            email, 
            role
        };
        
        res.status(200).json(updatedUser);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la mise à jour de l\'utilisateur');
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour supprimer un utilisateur (soft delete)
export async function deleteUser(req, res) {
    const id = parseInt(req.params.id);
    const currentUserId = req.user.id; // Récupérer l'ID de l'utilisateur connecté
    const currentUserRole = req.user.role; // Récupérer le rôle de l'utilisateur connecté

    // Empêcher un utilisateur de se supprimer lui-même
    if (id === currentUserId) {
        setTempCookie(res, 'Vous ne pouvez pas supprimer votre propre compte');
        return res.status(403).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    try {
        // Vérifier si l'utilisateur existe
        const existingUser = await runQuery('SELECT id, role FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
        if (!existingUser || existingUser.length === 0) {
            setTempCookie(res, 'Utilisateur non trouvé');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Empêcher un admin de supprimer un owner
        if (currentUserRole === 'admin' && existingUser[0].role === 'owner') {
            setTempCookie(res, 'Vous ne pouvez pas supprimer un propriétaire');
            return res.status(403).json({ message: 'Vous ne pouvez pas supprimer un propriétaire' });
        }

        // Soft delete - marquer comme supprimé au lieu de supprimer physiquement
        const sql = 'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await runQuery(sql, [id]);

        if (result.changes === 0) {
            setTempCookie(res, 'Erreur lors de la suppression de l\'utilisateur');
            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
        }

        res.status(204).send();
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la suppression de l\'utilisateur');
        res.status(500).json({ error: err.message });
    }
} 