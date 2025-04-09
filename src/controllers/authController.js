import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db, getUserByEmail, getAllUsers, addUser, setTempCookie, runQuery } from '../database/db.js';

// Utilitaire pour formater les dates en YYYY-MM-DD HH:MM:SS
function formatDateToSQL(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// --- Login ---
export async function loginTraitment(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        setTempCookie(res, 'Email and password are required');
        return res.status(400).redirect('/login');
    }

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            setTempCookie(res, "Invalid email or password");
            return res.status(401).redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            setTempCookie(res, "Invalid email or password");
            return res.status(401).redirect('/login');
        }

        const sessionToken = uuidv4();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h
        const formattedDate = formatDateToSQL(expiresAt);

        await runQuery(`UPDATE users SET session_token = ?, session_expires_at = ? WHERE id = ?`, [sessionToken, formattedDate, user.id]);

        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: false, // mettre true si tu utilises HTTPS en prod
            maxAge: 3600000, // 1h
            sameSite: 'Strict'
        });

        setTempCookie(res, 'Login successful');
        return res.status(200).redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        setTempCookie(res, 'Server error');
        return res.status(500).redirect('/login');
    }
}

// --- Register ---
export async function registerTraitment(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    if (!email || !password || !username || !confirmPassword) {
        setTempCookie(res, 'Please fill in all fields');
        return res.status(400).redirect('/register');
    }

    if (password !== confirmPassword) {
        setTempCookie(res, 'Passwords do not match');
        return res.status(400).redirect('/register');
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            setTempCookie(res, 'Email is already in use');
            return res.status(400).redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await addUser(username, email, hashedPassword);

        setTempCookie(res, 'Registration successful');
        return res.status(201).redirect('/login');
    } catch (error) {
        console.error(error);
        setTempCookie(res, 'Internal server error');
        return res.status(500).redirect('/register');
    }
}

// --- Logout ---
export async function logoutTraitment(req, res) {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
        setTempCookie(res, 'Aucun token de session fourni');
        return res.status(400).redirect('/');
    }

    try {
        const result = await runQuery(`UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE session_token = ?`, [sessionToken]);

        res.clearCookie('session_token');

        if (result.changes === 0) {
            setTempCookie(res, 'Session introuvable ou déjà expirée');
            return res.status(404).redirect('/');
        }

        setTempCookie(res, 'Déconnexion réussie');
        return res.status(200).redirect('/');
    } catch (error) {
        console.error("Erreur lors du logout:", error);
        setTempCookie(res, 'Erreur lors du logout');
        return res.status(500).redirect('/');
    }
}

// --- Vérification session (middleware) ---
export async function verifySession(req, res, next) {
    const token = req.cookies.session_token;

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const user = await db.get(`SELECT * FROM users WHERE session_token = ?`, [token]);

        if (!user) {
            return res.status(401).json({ message: 'Session invalide' });
        }

        const now = new Date();
        const expiresAt = new Date(user.session_expires_at);

        if (expiresAt < now) {
            return res.status(401).json({ message: 'Session expirée' });
        }

        const newExpiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h
        const formatted = formatDateToSQL(newExpiresAt);
        await runQuery(`UPDATE users SET session_expires_at = ? WHERE id = ?`, [formatted, user.id]);

        req.user = user;
        next();
    } catch (error) {
        console.error("Erreur renouvellement session :", error);
        return res.status(500).json({ message: 'Erreur serveur lors du renouvellement de la session' });
    }
}
