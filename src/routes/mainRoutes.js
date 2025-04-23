import express from 'express';
import { renderTemplate } from '../helpers/renderTemplate.js'; 
import { authenticateUser } from '../middlewares/auth.js';

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

export default router;
