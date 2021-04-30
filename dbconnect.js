const mysql= require('mysql')
const dotenv = require('dotenv')
dotenv.config('./.env')
const db= mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})
db.connect((err)=>{
    if(err){
        console.log(err)
    }
    else
     console.log("MYSQL connected")
})

module.exports=db;