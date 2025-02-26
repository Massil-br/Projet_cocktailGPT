

// liste temporaire des cocktails
let cocktails = [
    {id:1, name : 'Mojito'},
    {id: 2, name : 'Virgin Mojito'},
    {id: 3, name: 'tequila'},
    {id: 4, name: 'Kraa'},
    {id: 5, name: 'Test'},
    {id: 6, name: 'MAOAOAO'},
    {id: 7, name: 'testNodemon'},
];

//fonction permettant d'avoir toues les cocktails
export function getAllCocktails(req,res){
    res.status(200).json(cocktails);
}


// fonction permettant d'avoir un cocktail en fonction de l'id
export function getCocktailById(req, res){
    const cocktail = cocktails.find(c => c.id === parseInt(req.params.id));
    if (!cocktail)return res.status(404).json({message: 'Cocktail non trouvé'});
    res.status(200).json(cocktail);
}


// fonction permettant d'ajouter un nouveau cocktail
export function createCocktail(req,res){
    const newCocktail = {id: cocktails.length +1 , ...req.body};
    cocktails.push(newCocktail);
    res.status(201).json(newCocktail);
}


//fonction permettant de changer le contenu d'un cocktail
export function updateCocktail(req,res){
    let tempID = parseInt(req.params.id);
    const cocktail = cocktails.find(c => c.id === parseInt(req.params.id));
    if (!cocktail) return res.status(404).json({message: 'Cocktail non trouvé'});
    Object.assign(cocktail, req.body);
    cocktail.id = tempID;
    res.status(200).json(cocktail);
    
}

//fonction permettant de supprimer un cocktail
export function deleteCocktail(req, res) {
    const id = parseInt(req.params.id);

    // Supprimer le cocktail
    const initialLength = cocktails.length;
    cocktails = cocktails.filter(c => c.id !== id);

    // Vérifier si l'élément a été trouvé
    if (cocktails.length === initialLength) {
        return res.status(404).json({ message: 'Cocktail non trouvé' });
    }

    // Succès
    res.status(204).json(cocktails); // Réponse vide pour signaler la suppression
}