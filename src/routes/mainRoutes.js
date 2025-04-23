import express from 'express';
import { renderTemplate } from '../helpers/renderTemplate.js'; 
import { authenticateUser } from '../middlewares/auth.js';
import { getCocktailsList } from '../controllers/cocktailController.js';

const router = express.Router();

router.get('/', (req, res) => {
    let data ={};
    renderTemplate(res, 'index', data)
});

router.get('/contact', (req,res) =>{
    let data ={};
    renderTemplate(res, 'contact', data)
});

router.get('/login', (req,res) =>{
    let data ={};
    renderTemplate(res,'login', data)
});

router.get('/register', (req,res)=>{
    let data ={};
    renderTemplate(res, 'register', data)
});

// Route pour afficher la liste des cocktails
router.get('/cocktailsList', async (req, res) => {
    try {
        const cocktails = await getCocktailsList();
        renderTemplate(res, 'cocktailsList', { cocktails });
    } catch (error) {
        console.error('Erreur lors de la récupération des cocktails:', error);
        renderTemplate(res, 'error', { message: 'Erreur lors de la récupération des cocktails' });
    }
});

export default router;
