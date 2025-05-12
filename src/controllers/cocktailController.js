import { db, setTempCookie, runQuery } from '../database/db.js';
import { verifySession } from './authController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';



// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/cocktails';
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Générer un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite à 5MB
    },
    fileFilter: function (req, file, cb) {
        // Accepter uniquement les images
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Seules les images sont autorisées!'), false);
        }
        cb(null, true);
    }
});

// Middleware pour gérer l'upload
export const uploadMiddleware = upload.single('image');

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
    const imagePath = req.file ? req.file.path : null;

    if (!name || !description || !alcohol || !ingredients || !recipe) {
        setTempCookie(res, 'name, description, alcohol, ingredients, recipe required');
        return res.status(400).json({ message: 'name, description, alcohol, ingredients, recipe required' });
    }
    if (alcohol !== 'alcohol' && alcohol !== 'no_alcohol') {
        setTempCookie(res, 'alcohol value must be alcohol or no_alcohol');
        return res.status(400).json({ message: 'alcohol value must be alcohol or no_alcohol' });
    }

    const sql = 'INSERT INTO cocktails (name, description, alcohol, ingredients, recipe, image) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        const result = await runQuery(sql, [name, description, alcohol, ingredients, recipe, imagePath]);
        const newCocktail = { 
            id: result.lastID, 
            name, 
            description, 
            alcohol, 
            ingredients, 
            recipe,
            image: imagePath 
        };
        res.status(201).json(newCocktail);
    } catch (err) {
        // Si une erreur se produit, supprimer l'image uploadée
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        setTempCookie(res, 'Erreur lors de la création du cocktail');
        res.status(500).json({ error: err.message });
    }
}

// Fonction permettant de changer le contenu d'un cocktail
export async function updateCocktail(req, res) {
    const id = parseInt(req.params.id);
    const { name, description, alcohol, ingredients, recipe } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!name || !description || !alcohol || !ingredients || !recipe) {
        setTempCookie(res, 'name, description, alcohol, ingredients, recipe required');
        return res.status(400).json({ message: 'name, description, alcohol, ingredients, recipe required' });
    }
    if (alcohol !== 'alcohol' && alcohol !== 'no_alcohol') {
        setTempCookie(res, 'alcohol value must be alcohol or no_alcohol');
        return res.status(400).json({ message: 'alcohol value must be alcohol or no_alcohol' });
    }

    try {
        // Récupérer l'ancienne image si elle existe
        const oldCocktail = await runQuery('SELECT image FROM cocktails WHERE id = ?', [id]);
        const oldImagePath = oldCocktail[0]?.image;

        // Utiliser l'ancienne image si aucune nouvelle image n'est fournie
        const finalImagePath = imagePath || oldImagePath;

        const sql = 'UPDATE cocktails SET name = ?, description = ?, alcohol = ?, ingredients = ?, recipe = ?, image = ? WHERE id = ?';
        const result = await runQuery(sql, [name, description, alcohol, ingredients, recipe, finalImagePath, id]);

        if (result.changes === 0) {
            setTempCookie(res, 'Cocktail non trouvé');
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }

        // Supprimer l'ancienne image seulement si une nouvelle image a été uploadée
        if (oldImagePath && imagePath && oldImagePath !== imagePath && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        const updatedCocktail = { 
            id, 
            name, 
            description, 
            alcohol, 
            ingredients, 
            recipe,
            image: finalImagePath 
        };
        res.status(200).json(updatedCocktail);
    } catch (err) {
        // Si une erreur se produit, supprimer la nouvelle image uploadée
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        setTempCookie(res, 'Erreur lors de la mise à jour du cocktail');
        res.status(500).json({ error: err.message });
    }
}

// Fonction permettant de supprimer un cocktail
export async function deleteCocktail(req, res) {
    const id = parseInt(req.params.id);

    try {
        // Récupérer l'image avant de supprimer le cocktail
        const cocktail = await runQuery('SELECT image FROM cocktails WHERE id = ?', [id]);
        const imagePath = cocktail[0]?.image;

        const sql = 'DELETE FROM cocktails WHERE id = ?';
        const result = await runQuery(sql, [id]);

        if (result.changes === 0) {
            setTempCookie(res, 'Cocktail non trouvé');
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }

        // Supprimer l'image si elle existe
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.status(204).send();
    } catch (err) {
        setTempCookie(res, 'Erreur lors de la suppression du cocktail');
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour récupérer tous les cocktails pour l'affichage
export async function getCocktailsList(req, res) {
    try {
        const sql = 'SELECT id, name, description, image FROM cocktails ORDER BY name ASC';
        const cocktails = await runQuery(sql, []);
        
        // Si la fonction est appelée comme middleware de route API
        if (res) {
            return res.status(200).json(cocktails);
        }
        
        // Si la fonction est appelée comme helper pour le template
        return cocktails;
    } catch (err) {
        console.error('Erreur lors de la récupération des cocktails:', err);
        
        // Si la fonction est appelée comme middleware de route API
        if (res) {
            setTempCookie(res, 'Erreur lors de la récupération des cocktails');
            return res.status(500).json({ error: err.message });
        }
        
        // Si la fonction est appelée comme helper pour le template
        throw err;
    }
}

export async function researchCocktails(research){
    try{
        const sql = 'SELECT id, name, description, image FROM cocktails WHERE name LIKE ?';
        const cocktails = await runQuery(sql, [`%${research}%`]);
        return cocktails;
    }catch (err){
        console.error('erreur lors de la récupération des détails du cocktail: ', err );$
        throw err;
    }
}



// Fonction pour récupérer les détails d'un cocktail par son ID
export async function getCocktailDetailsById(id) {
    try {
        const cocktail = await runQuery('SELECT * FROM cocktails WHERE id = ?', [id]);
        if (!cocktail || cocktail.length === 0) {
            return null;
        }
        return cocktail[0];
    } catch (err) {
        console.error('Erreur lors de la récupération des détails du cocktail:', err);
        throw err;
    }
}


export async function getRandomCocktailSuggestion() {
    try {
        // Récupère tous les IDs valides
        const rows = await runQuery('SELECT id FROM cocktails');
        const allIds = rows.map(row => row.id);

        // Mélange les IDs
        for (let i = allIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
        }

        // Prend jusqu'à 6 IDs aléatoires
        const selectedIds = allIds.slice(0, Math.min(6, allIds.length));

        // Requête SQL avec tous les IDs d’un coup
        const placeholders = selectedIds.map(() => '?').join(', ');
        const cocktails = await runQuery(`SELECT * FROM cocktails WHERE id IN (${placeholders})`, selectedIds);

        return cocktails;
    } catch (err) {
        console.error('Erreur lors de la récupération des cocktails de suggestion', err);
        throw err;
    }
}
