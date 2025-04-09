
import express from 'express';
import { renderTemplate } from '../helpers/renderTemplate.js'; 



const router = express.Router();
let data ={};
router.get('/', (req, res) => {
    renderTemplate(res, 'index', data)
});

router.get('/contact', (req,res) =>{
    renderTemplate(res, 'contact', data)
})


router.get('/login', (req,res) =>{
    renderTemplate(res,'login', data)
})

router.get('/register', (req,res)=>{
    renderTemplate(res, 'register', data)
})







export default router;
