const db = require("../database/db");

class User {
    constructor(id,username,email,role){
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }


    static async getUserById(id){
        return new Promise((resolve, reject)=>{
            db.get("SELECT * FROM users WHERE id = ?", [id], (err,row)=>{
                if (err){
                    reject(err);
                }else if(row){
                    resolve(new User(row.id, row.username, row.email, row.role));
                }else{
                    resolve(null);
                }
            });
        });
    }



}

module.exports = User;
