const express = require('express')
const IndexRoutes= require('./Routes/index')
const AuthRoutes= require('./Routes/auth')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
dotenv.config('./.env')
//==========================================================================================================

//===========================================================================================================
const app = express();
app.use(express.static(__dirname +"/public"))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cookieParser())
app.use(require("express-session")({
    secret:"This is is resume project",
    resave:false,
    saveUninitialized:false 
 }));

app.set("view engine","ejs");

app.use(session({
    secret:"We will win",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge: 60000 * 60 
    }

}))
app.use(IndexRoutes)
app.use(AuthRoutes)
const PORT = 3000;
app.listen(PORT,()=>{
    console.log("Server Running")
})