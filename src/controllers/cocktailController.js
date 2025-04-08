
import  {db}    from '../database/db.js' 



//fonction permettant d'avoir toues les cocktails
export function getAllCocktails(req,res){
    db.all('SELECT * FROM cocktails', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(rows);
    });
}


// fonction permettant d'avoir un cocktail en fonction de l'id
export function getCocktailById(req, res){
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM cocktails WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }
        res.status(200).json(row);
    });
}


// fonction permettant d'ajouter un nouveau cocktail
export function createCocktail(req,res){
    const { name, description } = req.body;

    // Assurez-vous que les champs nécessaires sont présents
    if (!name || !description) {
        return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    const sql = 'INSERT INTO cocktails (name, description) VALUES (?, ?)';
    db.run(sql, [name, description], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // L'ID est automatiquement généré grâce à AUTOINCREMENT dans la table
        const newCocktail = { id: this.lastID, name, description };
        res.status(201).json(newCocktail);
    });
}


//fonction permettant de changer le contenu d'un cocktail
export function updateCocktail(req,res){
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    // Vérification si les données nécessaires sont fournies
    if (!name || !description) {
        return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    // Requête UPDATE
    const sql = 'UPDATE cocktails SET name = ?, description = ? WHERE id = ?';
    db.run(sql, [name, description, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }

        // Renvoyer le cocktail mis à jour
        const updatedCocktail = { id, name, description };
        res.status(200).json(updatedCocktail);
    });
    
}

//fonction permettant de supprimer un cocktail
export function deleteCocktail(req, res) {
    const id = parseInt(req.params.id);

    // Requête DELETE pour supprimer le cocktail par son ID
    const sql = 'DELETE FROM cocktails WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Vérifier si un cocktail a été supprimé
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }

        // Succès, pas de contenu dans la réponse (204 No Content)
        res.status(204).send();  // Utilisez .send() pour une réponse vide
    });
}