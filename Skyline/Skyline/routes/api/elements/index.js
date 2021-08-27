const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
 let Elements = require('../../../Models/Element');

var multer = require('multer');
var fs = require('fs');
var path = require('path');
const { Code } = require('mongodb');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/element')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
            req.fileValidationError = "Forbidden extension";
            return callback(null, false, req.fileValidationError);
        }
        callback(null, true)
    },
    limits:{
        fileSize: 420 * 150 * 200
    }
});

// Create Element
router.post('/element_add', upload.single('element_image'), (req, res, next) => {
    let errors ;
    if (errors) {
        if(req.file) {
            let filename = './public/uploads/element/'+req.file.filename;
            console.log(filename);
            fs.stat(filename, function (err, stats) {
                console.log(stats);//here we got all information of file in stats variable
            
                if (err) {
                    return console.error(err);
                }
                fs.unlink(filename,function(err){
                    if(err) return console.log(err);
                    console.log('file deleted successfully');
                });  
            });
        }
          res.render('Element_Creation.hbs', {
            title: 'Element',
            errors: errors
        });
    } else {
        if (req.fileValidationError) {
            res.render('Element_Creation.hbs', {
                title: 'Element',
                errors: req.fileValidationError
            });     
        } else {
           
            let Element = new Elements();
           
            Element.name = req.body.name;
            Element.category = req.body.category;
            Element.remarks = req.body.remarks;
           
            if(req.file) {
                Element.filepath = req.file.path;
                Element.filename = req.body.element_image;
            }
            Element.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect('/element/create');
                }
            });
        }
    }
});

// Element List
router.get('/element_list', function(req, res){
  
        Elements.find({}, function (err,element){
             if (err) {
                 console.log(err);
             } else {
                 res.render('Element_List.hbs', {
                 element:element
                 });
             }
         })
     });


// Update Element

     router.post('/element_update/:id', upload.single('element_image'), (req, res, next) => { 
        let errors;
        if (errors) {
            console.log(errors);
            res.json({ 'success': false, 'message': 'validation error', 'errors': errors });
        } else {
            let element = {}; 
            element.name = req.body.name;
            element.category = req.body.category;
            element.remarks= req.body.remarks;
               
            if(req.file) {
                element.filepath = req.file.path;
                element.filename = req.body.element_image;
            }


            Elements.findByIdAndUpdate(req.params.id, element, {new: true}).
            then(data => {
          
                res.redirect('/api/element/element_list');
               
    
            }).catch(error => {
            res.status(400).json({status: false, message:error})
    
            })
        }
    });

    // delete element
    router.get('/delete_element/:id',function(req, res){
        var del = req.params.id;

        let errors ;
        if(errors)
        {
            console.log(errors);
        }
        else
        {
      
            Elements.findByIdAndRemove(del).
            then(data => {
                res.redirect('/api/element/element_list')
              }).catch(error => {
              res.status(200).json({status: false, message:error})
    
            })
        }
    });


module.exports = router;