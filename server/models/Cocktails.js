module.exports = (sequelize, DataTypes)=> {
    const Cocktails = sequelize.define("Cocktails",{
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.STRING,
            allowNull : false,
        },
      
 
    });

    return Cocktails;
};