import { db, setTempCookie, runQuery } from '../database/db.js';

// Fonction permettant d'avoir tous les cocktails
export async function getAllCocktails(req, res) {
    try {
        const rows = await runQuery('SELECT * FROM cocktails', []);
        res.status(200).json(rows);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la récupération des cocktails');
        console.log('Erreur lors de la récupération des cocktails')
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
    const { name, description, alcohol, ingredients, recipe } = req.body;

    if (!name || !description || !alcohol || !ingredients || !recipe) {
        setTempCookie(res, 'name, description, alcohol, ingredients, recipe required');
        return res.status(400).json({ message: 'name, description, alcohol, ingredients, recipe required' });
    }
    if (alcohol  !== 'alcohol' && alcohol !== 'no_alcohol'){
        setTempCookie(res, 'alcohol value must be alcohol or no_alcohol');
        return res.status(400).json({message:'alcohol value must be alcolhol or no_alcohol'})
    }

    const sql = 'INSERT INTO cocktails (name, description , alcohol, ingredients, recipe) VALUES (?, ?, ?, ?, ?)';
    try {
        const result = await runQuery(sql, [name, description, alcohol, ingredients, recipe]);
        const newCocktail = { id: result.lastID, name, description, alcohol, ingredients, recipe};
        res.status(201).json(newCocktail);
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la création du cocktail');
        res.status(500).json({ error: err.message });
    }
}

// Fonction permettant de changer le contenu d'un cocktail
export async function updateCocktail(req, res) {
    const id = parseInt(req.params.id);
    const { name, description, alcohol, ingredients, recipe } = req.body;

    if (!name || !description || !alcohol || !ingredients || !recipe) {
        setTempCookie(res, 'name, description, alcohol, ingredients, recipe required');
        return res.status(400).json({ message: 'name, description, alcohol, ingredients, recipe required' });
    }
    if (alcohol  !== 'alcohol' && alcohol !== 'no_alcohol'){
        setTempCookie(res, 'alcohol value must be alcohol or no_alcohol');
        return res.status(400).json({message:'alcohol value must be alcolhol or no_alcohol'})
    }


    const sql = 'UPDATE cocktails SET name = ?, description = ?, alcohol = ?, ingredients = ?, recipe = ? WHERE id = ?';
    try {
        const result = await runQuery(sql, [name, description, alcohol, ingredients, recipe, id]);
        if (result.changes === 0) {
            setTempCookie(res, 'Cocktail non trouvé');
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }

        const updatedCocktail = { id, name, description,alcohol, ingredients, recipe };
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
