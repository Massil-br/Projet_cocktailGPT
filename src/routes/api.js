import express from 'express';
import { getAllCocktails, getCocktailById, createCocktail, updateCocktail, deleteCocktail, uploadMiddleware } from '../controllers/cocktailController.js';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateUser, requireAdmin } from '../middlewares/auth.js';
const router = express.Router();

// route api pour avoir tous les cocktails
router.get('/cocktails', getAllCocktails);

//route api pour avoir un cocktail par id
router.get('/cocktails/:id', getCocktailById);

//route api pour ajouter un cocktail
router.post('/cocktails', authenticateUser, requireAdmin, uploadMiddleware, createCocktail);

//route api pour changer le contenu d'un cocktail
router.put('/cocktails/:id', authenticateUser, requireAdmin, uploadMiddleware, updateCocktail);

//route api pour supprimer un cocktail
router.delete('/cocktails/:id', authenticateUser, requireAdmin, deleteCocktail);

// Routes pour les utilisateurs
// Route pour récupérer tous les utilisateurs
router.get('/users', authenticateUser, requireAdmin, getAllUsers);

// Route pour récupérer un utilisateur par ID
router.get('/users/:id', authenticateUser, requireAdmin, getUserById);

// Route pour créer un nouvel utilisateur
router.post('/users', authenticateUser, requireAdmin, createUser);

// Route pour mettre à jour un utilisateur
router.put('/users/:id', authenticateUser, requireAdmin, updateUser);

// Route pour supprimer un utilisateur
router.delete('/users/:id', authenticateUser, requireAdmin, deleteUser);

//export du router pour accéder à l'api
export default router;
