const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database/CocktailFortnite.db", (err) => {
    if (err) {
        console.error("Erreur lors de l'ouverture de la base de données:", err.message);
    } else {
        console.log("Connexion réussie à SQLite.");
    }
});


module.exports = (sequelize, DataTypes)=> {
    const Users = sequelize.define("Users",{
        username:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type : DataTypes.STRING,
            allowNull :false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull : false,
        },
        role: {
            type : DataTypes.STRING,
            allowNull: false,
            defaultValue: "user"
        }
    });

    return Users;
};