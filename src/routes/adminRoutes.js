import express from 'express';
import { renderTemplate } from '../helpers/renderTemplate.js'; 
import { authenticateUser, requireAdmin } from '../middlewares/auth.js';


const router = express.Router();
let data ={};
router.get('/users',authenticateUser,requireAdmin, (req, res) => {
    renderTemplate(res, 'admin/users', data)
});

router.get('/cocktails',authenticateUser, requireAdmin, (req,res)=>{
    renderTemplate(res,'admin/cocktails', data);
});


export default router;