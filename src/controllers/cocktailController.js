import { db, setTempCookie, runQuery } from '../database/db.js';

// Fonction permettant d'avoir tous les cocktails
export async function getAllCocktails(req, res) {
    try {
        const rows = await runQuery('SELECT * FROM cocktails', []);
        res.status(200).json(rows);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la récupération des cocktails');
        res.status(500).json({ error: err.message });
    }
}

// Fonction permettant d'avoir un cocktail en fonction de l'ID
export async function getCocktailById(req, res) {
    const id = parseInt(req.params.id);

    try {
        const row = await runQuery('SELECT * FROM cocktails WHERE id = ?', [id]);
        if (!row) {
            setTempCookie(res, 'Cocktail non trouvé');
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }
        res.status(200).json(row);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la récupération du cocktail');
        res.status(500).json({ error: err.message });
    }
}

// Fonction permettant d'ajouter un nouveau cocktail
export async function createCocktail(req, res) {
    const { name, description } = req.body;

    if (!name || !description) {
        setTempCookie(res, 'Le nom et la description sont requis');
        return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    const sql = 'INSERT INTO cocktails (name, description) VALUES (?, ?)';
    try {
        const result = await runQuery(sql, [name, description]);
        const newCocktail = { id: result.lastID, name, description };
        res.status(201).json(newCocktail);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la création du cocktail');
        res.status(500).json({ error: err.message });
    }
}

// Fonction permettant de changer le contenu d'un cocktail
export async function updateCocktail(req, res) {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    if (!name || !description) {
        setTempCookie(res, 'Le nom et la description sont requis');
        return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    const sql = 'UPDATE cocktails SET name = ?, description = ? WHERE id = ?';
    try {
        const result = await runQuery(sql, [name, description, id]);
        if (result.changes === 0) {
            setTempCookie(res, 'Cocktail non trouvé');
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }

        const updatedCocktail = { id, name, description };
        res.status(200).json(updatedCocktail);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la mise à jour du cocktail');
        res.status(500).json({ error: err.message });
    }
}

// Fonction permettant de supprimer un cocktail
export async function deleteCocktail(req, res) {
    const id = parseInt(req.params.id);

    const sql = 'DELETE FROM cocktails WHERE id = ?';
    try {
        const result = await runQuery(sql, [id]);
        if (result.changes === 0) {
            setTempCookie(res, 'Cocktail non trouvé');
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }

        res.status(204).send();  // Utilise .send() pour une réponse vide
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la suppression du cocktail');
        res.status(500).json({ error: err.message });
    }
}
