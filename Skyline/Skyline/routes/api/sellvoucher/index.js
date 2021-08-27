const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
 let SellVoucher = require('../../../Models/SellVoucher');
let Element=require('../../../Models/Element')
 const swal = require('sweetalert');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const Package = require('../../../Models/Package');


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


function findBalanceexe1(voucher) {
    var elementArr = []
    var packageArray=[]
    return new Promise(async function (fullfill) {
        for(var i=0;i<voucher.length;i++)
        {
            var result=voucher[i].package.Element
         for(var j=0;j<result.length;j++)
        {
           var elementId=result[j].element
           await Element.findById(elementId).
           then(element=>{
                  elementArr.push({element:element})
           })
           .catch(err =>{
               console.log("err",err)
              })  
        }
        console.log("eke",elementArr.length)
        
        packageArray.push(elementArr)
    }
        fullfill(packageArray);
    });
}


router.post('/sell_voucher_add/:id',(req, res, next) => {
  
if(JSON.parse(localStorage.getItem('user'))==null)
{
    res.send("Please Login to avail Package")
}
else{

          var packageId=req.params.id
        
          Package.findById(packageId).populate('Element.element')
          .then(package =>
              {
               SellVoucher.find({ package : { $in :packageId} })
               .then(voucher=>{
                 if(voucher)
                 {
                if(voucher.length==package.packageNumbers)
                {
                    res.send('Package is no more in stock')
                }
                else{
                    let sellvoucher = new SellVoucher();
                    sellvoucher.package=packageId;
                    sellvoucher.sellDate=new Date();
                    sellvoucher.packageNumber=voucher.length+1+package.uniqueSerialId;
                    sellvoucher.sellTo=JSON.parse(localStorage.getItem('user'))._id
                   
                    var arr=[]
                    for(var i=0;i<package.Element.length;i++)
                    {
                        for(var j=0;j<package.Element[i].quantity;j++)
                        {
                         arr.push({element:package.Element[i].element._id,consumedDate:"",otp:""})
                        }
                    }
                    sellvoucher.elementConsumed=arr
                    sellvoucher.save(function (err,data) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log("complete selling data")
                            res.send('Package Buyed')
                        }
                    });
                }

            }
                 })

            
            
            }).catch(err =>{
               res.status(400).json({ 'success': false, 'message': err });
                   
              })  
            }
});

router.get('/sell_voucher_list', function(req, res){
  
    SellVoucher.find({}, function (err,voucher){
         if (err) {
             console.log(err);
         } else {
           
     res.send(voucher)
        
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
  router.post('/delete_package/:id',function(req, res){
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
            res.status(200).json({status: true, message:"Package Removed", data})
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

// Sell Voucher Update

router.post('/sell_voucher_update/:id', (req, res, next) => { 
    let errors;
    if (errors) {
        console.log(errors);
        res.json({ 'success': false, 'message': 'validation error', 'errors': errors });
    } else {
          var id; 
          var arr=[]
          SellVoucher.find({},function(err,vouc){
              var sell=vouc[0]
              if(err)
              console.log(err)
              else{
                for(var i=0;i<vouc[0].elementConsumed.length;i++)
                {
                    arr.push(vouc[0].elementConsumed[i]._doc)
                }

                var result;
                (vouc[0].elementConsumed).reduce(function(countMap, item) {
                    countMap[item.element] = ++countMap[item.element] || 1;
                    result=Object.entries(countMap).map(([key, value]) => ({key,value}));
                    return countMap;
                  }, {});
     
                sellLength=vouc[0].elementConsumed.length
                id=vouc[0]._id
                console.log(typeof req.body.element.length,typeof result.length,"lenght")
                for(var i=result.length;i<req.body.element.length;i++)
                 {
                  for(var j=0;j<req.body.quantity[i];j++)
               {
                  arr.push({element:req.body.element[i],consumedDate:"",otp:""})
               }
            }
         sell.elementConsumed=arr
         SellVoucher.findByIdAndUpdate(id, sell, {new: true}).
         then(data => {
            res.redirect('/api/user/user_list');
          }).catch(error => {
         res.status(400).json({status: false, message:error})
           })
              }
     
           })
        }
});


              /*****Mobile API's */

              router.post('/mobile_sell_voucher_add/:id',(req, res, next) => {
              var userId=req.body.userId
              var packageId=req.params.id
              Package.findById(packageId).populate('Element.element')
              .then(package =>
                  {
                   SellVoucher.find({ package : { $in :packageId} })
                   .then(voucher=>{
                     if(voucher)
                    {
                    if(voucher.length==package.packageNumbers)
                    {
                        res.json({message:'Package is no more in stock'})
                    }
                    else{
                        let sellvoucher = new SellVoucher();
                        sellvoucher.package=packageId;
                        sellvoucher.sellDate=new Date();
                        sellvoucher.packageNumber=voucher.length+1+package.uniqueSerialId;
                        sellvoucher.sellTo=userId
                       
                        var arr=[]
                        for(var i=0;i<package.Element.length;i++)
                        {
                            for(var j=0;j<package.Element[i].quantity;j++)
                            {
                             arr.push({element:package.Element[i].element._id,consumedDate:"",otp:""})
                            }
                        }
                        sellvoucher.elementConsumed=arr
                        sellvoucher.save(function (err,data) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                res.json({message:'Package Buyed'})
                            }
                        });
                    }
                }
                     })
    
                }).catch(err =>{
                   res.status(400).json({ 'success': false, 'message': err });
                       
                  })  
                
    });


    
router.get('/sell_voucher_mobile_list/:id', function(req, res){
  
    SellVoucher.find({ sellTo: { $eq: req.params.id } }).populate('elementConsumed.element').populate('package')
    .populate([{path: 'package',populate:{ path: 'Element',populate:{path:'element'}}}])
    .exec(async function (err, voucher){
         if(err)
         res.status(400).json({ 'success': false, 'message': err });
            
      else{
             res.json({voucher:voucher})
          }
        
     })
    
     
 });

 router.get('/mobile_user_sellvoucher/:id',function(req, res){
        
     SellVoucher.findById(req.params.id)
    .populate('package').
    exec(async function (err, voucher) {
        if (err) {
            console.log(err);
        } else {
            if (voucher != null && voucher.length != 0) {
                var arr2 = []
                arr2.push({ package: voucher.package, id: voucher._id })

                var result;
                const elementArray = voucher.elementConsumed
                for (var i = 0; i < elementArray.length; i++) {
                    (elementArray).reduce(function (countMap, item) {
                        if (item.consumedDate == null) {
                            countMap[item.element] = ++countMap[item.element] || 1;
                            result = Object.entries(countMap).map(([key, value]) => ({ key, value }));
                        }
                        return countMap;
                    }, {});

                    var coupons = await findBalanceexe(result, voucher._id);

                    if (arr2 != undefined) {
                        arr2[0].coupon = coupons
                    }
                    else
                        arr2 = []
                }
            }
        }

        const data = { userpackage: arr2 }
        res.json({package:data})


    })

  })


module.exports = router;