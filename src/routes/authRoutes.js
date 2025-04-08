
import express from 'express';
import { loginTraitment, registerTratment } from '../controllers/authController.js';
const router = express.Router();

router.post('/loginTraitment', loginTraitment);
router.post('/registerTraitment', registerTratment);

export default router;