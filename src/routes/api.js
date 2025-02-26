const express = require('express');
const{getAllCocktails, getCocktailById, createCocktail, updateCocktail, deleteCocktail} = require('../controllers/cocktailController');
const router = express.Router();

router.get('/cocktails', getAllCocktails);


router.get('/cocktails/:id', getCocktailById);


router.post('/cocktails', createCocktail);


router.put('/cocktails/:id', updateCocktail);


router.delete('/cocktails/:id', deleteCocktail);

module.exports = router;
