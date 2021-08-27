const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const Token = require('../../../Models/Token');
const fetch =require('cross-fetch');

// Save Token
router.post('/token_add',(req, res, next)  => {
    var Tokens=new Token()
    Tokens.token=req.body.token
    Tokens.save(function(err, res) {
        if (err) throw err;
        console.log("Token inserted");
      });
});


     router.post('/send_notification', function(req, res){
  
        Token.find({}, function (err,token){
             if (err) {
                 console.log(err);
             } else {

                 var tokenArray=[]
                 for(var i=0;i<token.length;i++)
                 {
                     tokenArray.push(token[i].token)
                 }
                 send(req.body.title,req.body.body,tokenArray)
                  res.redirect('/')
                }
         })
     });

    async function send(title,body,array){
   
       const message={
           to:array,
           sound:"default",
           title:title || "Skyline",
           body:body || "Hope You are weel",
           data:{
               data:"goes here"
           }
       }

        await fetch("https://exp.host/--/api/v2/push/send",{
          method:"POST",
          header:{
              "Accept":"application/json"
          },
          body:JSON.stringify(message)
          })
     }


module.exports = router;