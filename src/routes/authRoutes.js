
import express from 'express';
import { loginTraitment, registerTraitment , logoutTraitment} from '../controllers/authController.js';
const router = express.Router();

router.post('/loginTraitment', loginTraitment);
router.post('/registerTraitment', registerTraitment);
router.get('/logout', logoutTraitment)
export default router;