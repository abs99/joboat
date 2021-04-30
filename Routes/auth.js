const express = require('express');
const router = express.Router();
const db=require('../dbconnect')
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config('./.env')
router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register',(req,res)=>{
    const{type,firstname,lastname,email,Phone,password,cnfpassword}=req.body
    console.log(req.body)
    if(type=='Candidate'){
        db.query('SELECT email from candidate where email=?',[email], async (err,results)=>{
            if(err){
                console.log(err)
            }
            else if (results.length>0){
                console.log('email exists')
             return res.render('index')
            }
            else if(cnfpassword!=password){
                console.log('Passoword do not match')
                return res.render('index')
               }
            else{
                let hashedPassword = await bcrypt.hash(password,8);
                console.log(hashedPassword)
                const tuple={
                        firstname:firstname,
                        lastname:lastname,
                        email:email,
                        phone:Phone,
                        password:hashedPassword
                    }
                db.query('insert into candidate set ?',tuple,(err,results)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("Inserted succesfully")
                        console.log(results)
                    }
                })
                return res.render('index')
    
            }
        })
    }
    else{
        db.query('SELECT email from recruiter where email=?',[email], async (err,results)=>{
            if(err){
                console.log(err)
            }
            else if (results.length>0){
                console.log('email exists')
             return res.render('index')
            }
            else if(cnfpassword!=password){
                console.log('Passoword do not match')
                return res.render('index')
               }
            else{
                let hashedPassword = await bcrypt.hash(password,8);
                console.log(hashedPassword)
                const tuple={
                        firstname:firstname,
                        lastname:lastname,
                        email:email,
                        phone:Phone,
                        password:hashedPassword
                    }
                db.query('insert into recruiter set ?',tuple,(err,results)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("Inserted succesfully")
                        console.log(results)
                    }
                })
                return res.render('index')
    
            }
        })
    }
    
   
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',(req,res)=>{
    const {type,email,password}=req.body
   
    if(type==='Candidate'){
        db.query('select * from candidate where email =?',[email], (err,result)=>{
            if(err){
                console.log(err)
            }
            else if(!result){
                res.redirect('/login')
            }
            else{
                bcrypt.compare(password,result[0].password)
                .then((match)=>{
                    if(match){
                        const {id,firstname,lastname}=result[0];
                        const token=jwt.sign({id,firstname,lastname,type:"Candidate"},process.env.JWT_SECRET_KEY,{
                            expiresIn:process.env.JWT_EXPIRES_IN
                        });
                        const cookieOptions={
                            expires:new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
                            httpOnly:true
                        }
                        //console.log(token)
                        res.cookie('jwt',token,cookieOptions);
                        user=result[0].firstname
                        let obj={user,id,type}
                        req.session.obj=obj
                        res.redirect('/profile');
                    }
                    else{
                        return res.json({message:"wrong password"})
                    }
                })
                .catch(err=>{
                    console.log(err)
                    res.redirect('/login')
                })
               
            }
        })
    }
    else{
        db.query('select * from recruiter where email =?',[email], (err,result)=>{
            if(err){
                console.log(err)
            }
            else if(!result){
                res.redirect('/login')
            }
            else{
                bcrypt.compare(password,result[0].password)
                .then((match)=>{
                    if(match){
                        
                        const {id,firstname,lastname}=result[0];
                        const token=jwt.sign({id,firstname,lastname,type:"Recruiter"},process.env.JWT_SECRET_KEY,{
                            expiresIn:process.env.JWT_EXPIRES_IN
                        });
                        const cookieOptions={
                            expires:new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
                            httpOnly:true
                        }
                        //console.log(token)
                        res.cookie('jwt',token,cookieOptions);
                        let user=firstname+" "+lastname
                        let obj={user,id,type:"Recruiter"}
                        req.session.obj=obj
                        res.redirect('/profile');
                    }
                    else{
                        return res.json({message:"wrong password"})
                    }
                })
                .catch(err=>{
                    console.log(err)
                    res.redirect('/login')
                })
               
            }
        })
    }
    
   
})


router.get('/logout',(req,res,next)=>{
    console.log("out")
    res.clearCookie('jwt')
    res.session={}
    res.redirect('/login')
    next()
    
})

module.exports = router