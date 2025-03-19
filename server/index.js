const express = require('express');
const app = express();

app.use(express.json())

const db = require('./models');

//Routers
const cocktailRouter = require("./routes/Cocktails");
app.use("/cocktails", cocktailRouter);

db.sequelize.sync().then(()=>{
    app.listen(3001, () =>{
        console.log("Server running on port 3001 \n http://localhost:3001")
    }); 
});



