const express = require('express');
const {candidate_auth,recruiter_auth}= require('../Middlewares/auth')
const jwt =require('jsonwebtoken')
const db = require('../dbconnect');
const router = express.Router();


router.get('/',(req,res)=>{
    const obj=req.session.obj
    // res.json({
    //     message:"All well"
    // })
    res.render('landing')
})

router.get('/profile',(req,res)=>{
    const obj=req.session.obj
    // res.json({
    //     message:"All well"
    // })
    res.render('index',{user:obj.user,id:obj.id,type:obj.type})
})
router.get('/jobs',(req,res)=>{
  
  const{id,type,user}=req.session.obj;
  
    db.query('select * from jobs',(err,jobs)=>{
        if(err){
            throw err
        }
        else{
            console.log(user)
            res.render('jobs',{jobs,id,type,user})
          
        }
    })
})
router.get('/applications/:c_id',candidate_auth,(req,res)=>{
    const{id,type,user}=req.session.obj;
  
   let sql = 'select distinct(job_id) from applications where cand_id=?'
        db.query(sql,req.params.c_id,(err,results)=>{
            if(err){
                console.log(err)
            }
            else{
                let jids=[]
                for(let i=0;i<results.length;i++){
                 jids.push(results[i].job_id)
                }
                db.query('select * from jobs where id in (?)',[jids],(err,jobs)=>{
                 if(err)throw err  
                 console.log(jobs)
                 res.render("applications",{jobs,id,type,user})
                })
                  
            }
        })
   
});
router.post('/apply/:jid/:cid',candidate_auth,(req,res)=>{
    const{id,type,user}=req.session.obj;
  const job_id=req.params.jid;
  const cand_id=req.params.cid;
  db.query('insert into applications set ?',{job_id,cand_id},(err,results)=>{
      if(err)throw err;
      else{
          res.send('Applied Successfully')
      }
  })

})
// create job
router.get('/jobs/:rid',(req,res)=>{
    let jid=req.params.rid;
    res.render('newjob',{jid})
})
router.post('/jobs/:rid',(req,res)=>{
     const recruiter_id=req.params.rid
     console.log(recruiter_id)
     const {name,description}=req.body;
     const job = {
         name:name,
         description:description,
         recruiter_id:recruiter_id
     }
     console.log(job)
      db.query('insert into jobs set ?',job,(err,results)=>{
         if(err){
             console.log(err)
         }
         else{
             console.log(results);
            //  return res.json(results)
            res.redirect('/profile')
         }
     })
     //res.json({message:"holasfdadsf"})
 })
 router.get('/applicants/:jid',(req,res)=>{
     const job_id=req.params.jid;
     const{id,type,user}=req.session.obj;
     //console.log(job_id)
     let sql='select distinct(cand_id) from applications where job_id=?';
     db.query(sql,[job_id],(err,results)=>{
         if(err){
             throw err
         }
         else{
             let cids=[]
             for(let i=0;i<results.length;i++){
                    cids.push(results[i].cand_id)
             }
             if(cids.length>0){
                db.query('SELECT firstname,lastname from candidate where id=?',[cids],(err,cands)=>{
                    if(err){
                        throw err
                    }
                    else{
                        console.log(cands)
                        res.render('recruiter',{cands,id,user,type})
                        }
                })
             }
             else{res.send("no Applicant")
            
            }
           
            
             
         }
     })
 });

module.exports = router