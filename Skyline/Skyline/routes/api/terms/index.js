const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
 let Terms = require('../../../Models/Terms');

var multer = require('multer');
var fs = require('fs');
var path = require('path');



 
// Update Package

router.post('/terms_and_conditions_add', (req, res) => { 
   
    let errors;
    if (errors) {
        console.log(errors);
        res.json({ 'success': false, 'message': 'validation error', 'errors': errors });
    } else {
        let terms=new Terms()
        var arr=[]


        if(req.body.terms)
        {
            var arr=[]
            if(typeof req.body.terms=='string')
            {
                arr.push({terms:req.body.terms,index:1})
        }
           else{
          for(var i=0;i<req.body.terms.length;i++){
            arr.push({terms:req.body.terms[i],index:i+1})

          }
        }
 
        terms.terms=arr;
    }
       

   
     
    Terms.find({}, function (err,term){
        if (err) {
            console.log(err);
        } else {
              if(term.length==0)
                {
                    terms.save(function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            res.redirect('/');
                        }
                    });
                }
           else{
               
        Terms.update({_id: term[0]._id}, 
            {$set: {terms : arr}}).
        then(data => {
            res.redirect('/');
              }).catch(error => {
                  res.status(400).json({status: false, message:error})
                       })
           }


        
       
        
    }
    })
    
    }
});



module.exports = router;