const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
 let Packages = require('../../../Models/Package');

var multer = require('multer');
var fs = require('fs');
var path = require('path');
const SellVoucher = require('../../../Models/SellVoucher');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/package')
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


function findBalanceexe(result, voucherid) {
    var coupon = []
    return new Promise(async function (fullfill) {

        for (var i = 0; i < result.length; i++) {
            const id = result[i].key
            const quantity = result[i].value
            await Element.findById(id)
                .then(element => {
                    coupon.push({ element: element, quantity: quantity, voucherid: voucherid })
                })
                .catch(error => {
                    console.log("error", error)
                })
        }

        fullfill(coupon);
    });
}


router.post('/package_add', upload.single('package_image'), (req, res, next) => {
    let errors ;

    if (errors) {
        if(req.file) {
            let filename = './public/uploads/package/'+req.file.filename;
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
        res.render('Package_Creation.hbs', {
            title: 'Package',
            errors: errors
        });
    } else {
        if (req.fileValidationError) {
            res.render('Package_Creation.hbs', {
                title: 'Package',
                errors: req.fileValidationError
            });     
        } else {
             let package=new Packages()
             package.packageName=req.body.packageName,
             package.uniqueSerialId=req.body.uniqueSerialId,
             package.packageNumbers=req.body.packageNumbers
             package.packageRemarks=req.body.packageRemarks
        
            if(req.file) {
                package.filepath = req.file.path;
                package.filename = req.body.package_image;
            }
           
            if(req.body.element)
            {
                var arr=[]
                if(typeof req.body.element=='string')
                {
                    arr.push({element: mongoose.Types.ObjectId(req.body.element),validity:req.body.validity,quantity:req.body.quantity,period:req.body.period,remarks:req.body.remarks})
        
                }
   else{
              for(var i=0;i<req.body.element.length;i++){
                arr.push({element: mongoose.Types.ObjectId(req.body.element[i]),validity:req.body.validity[i],quantity:req.body.quantity[i],period:req.body.period[i],remarks:req.body.remarks[i]})
              }
            }
    
     package.Element=arr
        }
            package.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect('/package/create');
                }
            });
        }
    }
});

router.get('/package_list', function(req, res){
  
    Packages.find({}, function (err,package){
         if (err) {
             console.log(err);
         } else {
           
             res.render('Package_List.hbs', {
             package:package
             });
        
         }
     })
 });


 
// Update Package

router.post('/package_update/:id', upload.single('package_image'), (req, res, next) => { 
    let errors;
    if (errors) {
        console.log(errors);
        res.json({ 'success': false, 'message': 'validation error', 'errors': errors });
    } else {
        let package={}
        package.packageName=req.body.packageName,
        package.uniqueSerialId=req.body.uniqueSerialId,
        package.packageNumbers=req.body.packageNumbers
        package.packageRemarks=req.body.packageRemarks
   
       if(req.file) {
           package.filepath = req.file.path;
           package.filename = req.body.package_image;
       }
      
       if(req.body.element)
       {
           var arr=[]
           if(typeof req.body.element=='string')
           {
               arr.push({element: mongoose.Types.ObjectId(req.body.element),validity:req.body.validity,quantity:req.body.quantity,period:req.body.period,remarks:req.body.remarks})
   
           }
else{
         for(var i=0;i<req.body.element.length;i++){
           arr.push({element: mongoose.Types.ObjectId(req.body.element[i]),validity:req.body.validity[i],quantity:req.body.quantity[i],period:req.body.period[i],remarks:req.body.remarks[i]})
         }
       }

package.Element=arr
   }
      


        Packages.findByIdAndUpdate(req.params.id, package, {new: true}).
        then(data => {
      
            res.redirect('/api/package/package_list');
           

        }).catch(error => {
        res.status(400).json({status: false, message:error})

        })
    }
});



  // delete package
  router.get('/delete_package/:id',function(req, res){
    var del = req.params.id;

    let errors ;
    if(errors)
    {
        console.log(errors);
    }
    else
    {
  
        Packages.findByIdAndRemove(del).
        then(data => {
            res.redirect('/api/package/package_list')
          }).catch(error => {
        res.status(200).json({status: false, message:error})

        })
    }
});

//View Package By Id
router.get('/package/:id',function(req, res){
    
    Packages.findById(req.params.id).populate('Element.element')
    .then(data =>
        {
           
        res.render('Package_Detail',{package:data})
        }).catch(err =>{
         res.status(400).json({ 'success': false, 'message': err });
             
        })
         
      })

      //Show Package By Id
    router.get('/show_package/:id',function(req, res){
    Packages.findById(req.params.id).populate('Element.element')
    .then(data =>
        {
        res.render('Package_Show',{package:data,id:data._id})
        }).catch(err =>{
         res.status(400).json({ 'success': false, 'message': err });
             
        })
         
      })



/***************Mobile API'S************/
router.get('/mobile_package_list', function(req, res){
     Packages.find().populate('Element.element'). exec(function (err, package)
     {
         if (err) {
             console.log(err);
         } else {
           res.json({package:package})
        
         }
     })
 });



 router.get('/mobile_package/:id',function(req, res){
    
    Packages.findById(req.params.id).populate('Element.element')
    .then(data =>
        {
           res.json({package:data})
        }).catch(err =>{
         res.status(400).json({ 'success': false, 'message': err });
        })
         
      })

      
   

module.exports = router;