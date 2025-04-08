const express = require('express');
const{getAllCocktails, getCocktailById, createCocktail, updateCocktail, deleteCocktail} = require('../controllers/cocktailController');
const router = express.Router();

// route api pour avoir tous les cocktails
router.get('/cocktails', getAllCocktails);

//route api pour avoir un cocktail par id
router.get('/cocktails/:id', getCocktailById);

//route api pour ajouter un cocktail
router.post('/cocktails', createCocktail);

//route api pour changer le contenu d'un cocktail
router.put('/cocktails/:id', updateCocktail);

//route api pour supprimer un cocktail
router.delete('/cocktails/:id', deleteCocktail);



//export du router pour accéder à l'api
module.exports = router;
