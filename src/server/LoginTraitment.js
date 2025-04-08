const express = require('express');
const router = express.Router();
const db = require("../database/db");
const bcrypt = require('bcrypt');

router.post('/loginTraitment', async(req , res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Email et mot de passe requis'});
    }

    try{
        const user = await db.getUserByEmail("email");
        if(!user){
            return res.status(401).json({message : 'email ou mot de passe incorrect'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({message: 'Email ou mot de passe incorrect'});
        }

        res.status(200).json({ message: 'Connexion réussie', user: {id: user.id, username: user.username, email: user.email, role : user.role }});
    }catch{
        express.status(500).json({message: 'erreur interne du serveur'});
    }
})

module.exports = router;

