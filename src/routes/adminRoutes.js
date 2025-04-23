import express from 'express';
import { renderTemplate } from '../helpers/renderTemplate.js'; 
import { authenticateUser, requireAdmin } from '../middlewares/auth.js';


const router = express.Router();

router.get('/users',authenticateUser,requireAdmin, async(req, res) => {
    let data ={};
    renderTemplate(res, 'admin/users', data)
});

router.get('/cocktails',authenticateUser, requireAdmin,async (req,res)=>{
    let data ={};
    renderTemplate(res,'admin/cocktails', data);
});


export default router;