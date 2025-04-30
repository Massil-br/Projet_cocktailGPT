import express from 'express';
import { renderTemplate } from '../helpers/renderTemplate.js'; 
import { authenticateUser } from '../middlewares/auth.js';
import { getCocktailsList, getCocktailDetailsById, researchCocktails } from '../controllers/cocktailController.js';

const router = express.Router();

router.get('/',async (req, res) => {
    let data ={};
    renderTemplate(res, 'index', data)
});

router.get('/contact',async (req,res) =>{
    let data ={};
    renderTemplate(res, 'contact', data)
});

router.get('/login',async (req,res) =>{
    let data ={};
    renderTemplate(res,'login', data)
});

router.get('/register',async (req,res)=>{
    let data ={};
    renderTemplate(res, 'register', data)
});


router.get('/cocktailsList', async (req, res) => {
    try {
        let cocktails;
        let research;
        if (req.query.research) {
            cocktails = await researchCocktails(req.query.research);
            research = req.query.research;
        } else {
            cocktails = await getCocktailsList();
            research = null;
        }
        renderTemplate(res, 'cocktailsList', { cocktails, research });
    } catch (error) {
        console.error('Erreur lors de la récupération des cocktails:', error);
        renderTemplate(res, 'error', { message: 'Erreur lors de la récupération des cocktails' });
    }
});

router.get('/cocktailDetail', async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const research = req.query.research || null;
        if (!id) {
            return renderTemplate(res, 'error', { message: 'ID du cocktail non spécifié' });
        }
        
        const cocktail = await getCocktailDetailsById(id);
        if (!cocktail) {
            return renderTemplate(res, 'error', { message: 'Cocktail non trouvé' });
        }
        
        renderTemplate(res, 'cocktailDetail', { cocktail, research });
    } catch (error) {
        console.error('Erreur lors de la récupération du détail du cocktail:', error);
        renderTemplate(res, 'error', { message: 'Erreur lors de la récupération du détail du cocktail' });
    }
});

export default router;
