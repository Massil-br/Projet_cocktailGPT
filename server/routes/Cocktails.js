const express = require('express');
const router = express.Router();
const { Cocktails } = require("../models");


router.get("/", async(req,res)=>{
    const listOfCocktails = await Cocktails.findAll();
    res.json(listOfCocktails);
});

router.post("/", async(req,res)=>{
    const cocktail = req.body;
    await Cocktails.create(cocktail);
    res.json(cocktail);
});



module.exports = router;