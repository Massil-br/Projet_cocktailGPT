const express = require('express');
const router = express.Router();
const db = require("../database/db");
const bcrypt = require('bcrypt');

router.post('/registerTraitment', async(req , res)=>{
    const {username,email,password,confirmPassword} = req.body;
    if(!email || !password || username || confirmPassword){
        return res.status(400).json({message: 'Veillez remplir tous les champs'});
    }

    if(password !== confirmPassword){
        return res.status(400).json({message: 'Veuillez mettre le même mot de passe pour les deux champs dédiés aux mots de passes'});
    }

   

    try{

        const existingUser = await db.getUserByEmail("email");
        if(existingUser){
            return res.status(4000).json({message : 'cet email est déja utilisé'});
        }

        const hashedPassword = bcrypt.hash(password, 10);
        const newUser = await db.addUser(username,email,hashedPassword);
        
        

        res.status(201).json({ message: 'Inscription réussie', user: newUser });
    }catch(error){
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});


module.exports = router;
