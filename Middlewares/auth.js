const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config('./.env')

function candidate_auth(req,res,next){
    let token = req.cookies.jwt;
    if(typeof token!== 'undefined'){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,authData)=>{
            if(err){
                console.log(err)
                res.send(err)
            }
            else{
                console.log(authData)
                if(authData.type=='Candidate'){
                    console.log(authData)
                    res.token=token
                    res.locals.id=authData.id
                    res.locals.user=authData.firstname
                    next()
                }
                else {
                   res.redirect('/login')
                }
                  
                
                
            }
        })
    }
    else{
        res.sendStatus(403)
    }
   
    
}
function recruiter_auth(req,res,next){
    let token = req.cookies.jwt;
    if(typeof token!== 'undefined'){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,authData)=>{
            if(err){
                res.send(err)
            }
            else{
                if(authData.type=='Recruiter'){
                    console.log(authData)
                    res.token=token
                    res.locals.id=authData.id
                    res.locals.user=authData.firstname
                    next()
                }
                else 
                  res.sendStatus(403)
                
                
            }
        })
    }
    else{
        res.sendStatus(403)
    }
   
    
}
module.exports={candidate_auth,recruiter_auth}