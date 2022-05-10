/* =======================
    LOAD THE DEPENDENCIES
==========================*/
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
var cors = require('cors');
const path = require('path')
const hbs = require('hbs') 
const request = require('request');
const session = require('express-session') 
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const User = require('./Models/user')

/* =======================
LOAD THE CONFIG
==========================*/
const config = require('./config')
const Element = require('./Models/Element')
const Package = require('./Models/Package')
const SellVoucher = require('./Models/SellVoucher')
const Terms = require('./Models/Terms')
const Carousel = require('./Models/Carousel')
const router = require('./routes/api/user')
const port = process.env.PORT || 3000

/* =======================
EXPRESS CONFIGURATION
==========================*/
const app = express()
// app.use(cors({
//     origin: 'http://localhost:3000'
//   }));

const corsOptions = {
    origin: true,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  
app.use(cors(corsOptions));

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json());
// print the request log on console
app.use(morgan('dev'))

// set the secret key variable for jwt
app.set('jwt-secret', config.secret)

app.use(session({secret:'skyline', saveUninitialized : true, resave : true}));
hbs.registerPartials(__dirname + '/views/partials');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs')


// index page, just for testing
app.use('*/css', express.static('public/css'));
app.use('*/js', express.static('public/js'));
app.use('*/images', express.static('public/images'));
app.use('*/vendors', express.static('public/vendors'));
app.use('*/fonts', express.static('public/fonts'));
app.use('*/uploads', express.static('public/uploads'));
app.use('*/logo', express.static('public/logo'));
app.use('*/img', express.static('public/img'));
app.use('*/pages', express.static('src/pages'));

app.get('/', function(req, res){
    const user=JSON.parse(localStorage.getItem('user'))
    console.log("hey")
    var totalUser=0
     User.find({}, function (err, user) {
         if (err) {
                console.log(err);
            } else {
                render(user.length)
                
    }       
        })

        function render(length){
        if(user!=null &&  user.admin)
        {
            SellVoucher.find({}).populate('elementConsumed.element').populate('package')
            .populate([{path: 'package',populate:{ path: 'Element',populate:{path:'element'}}}])
            .populate("sellTo")
            .exec(async function (err, voucher){
                 if(err)
                 res.status(400).json({ 'success': false, 'message': err });
                    
                else{
                    const otpArray=[];
                    for(var i=0;i<voucher.length;i++)
                    {
                        for(var j=0;j<voucher[i].elementConsumed.length;j++)
                        {
                            var element=voucher[i].elementConsumed[j]
                            if(element.otp!==""&& element.consumedDate==null)
                            {
                                otpArray.push({voucherId:voucher[i]._id,elementConsumed:element,
                                    client:voucher[i].sellTo.name,sellDate:new Date(voucher[i].sellDate)})
                            }
                        }
                    }
                   res.render('landing',{user:user,userLength:length,voucher:otpArray})
                  }
                
             })

        }
        else
        res.redirect('/home')
        }
               
           
})
  
  
app.get('/login', function(req, res){
    res.render('login')
})
app.get('/register', function(req, res){
    res.render('register')
})

hbs.registerHelper('ifCond', function(v1,v2,options) {

    if(v1 != v2) {
      return options.fn(this);
    }
    return options.inverse(this);
});



app.get('/home', function(req, res){
    Package.
    find({}).
    populate('Element.element').
    exec(function (err, package) {
      if (err)    console.log(err);
      else{
          var arr=[]
          var length=2
          if(package.length<2)
          {
              length=package.length
          }
          for(var i=0;i<length;i++)
          {
               arr.push({id:i+1,package:package[i]})
          }

           SellVoucher.find({})
          .populate('package').
           exec(async function (err, voucher) {
           if (err) {
                console.log(err);
            } else {
 
                   const user=JSON.parse(localStorage.getItem('user'))

                    if(voucher.length!=0 && user!=null)
                    {
                        var arr2=[]
                        var voucherArray=voucher.filter(item=>item.sellTo==user._id)
                        await voucherArray.map(item=>
                        {
                             arr2.push({package:item._doc.package,id:item._id})
                        })
                     }
                        }
                      
                        var ter=[]
                        Terms.find({},function(err,term){
                        
                              if(err)
                              console.log(err)
                              else{
                                  console.log(term[0].terms)
                                const data={package:arr,packages:package,userpackage:arr2,user:getUser(),terms:term[0].terms}
                                res.render('Home',data)
                              }


                        })

                        
                
           
            
        })

      }
      // prints "The author is Ian Fleming"
    });
  

})

app.get('/element/create', function(req, res){
    console.log("user",getUser())
    if(!getUser())
   console.log("login fiorst")
    else
    res.render('Element_Creation')
})

app.get('/notifications', function(req, res){
    res.render('Notification.hbs')
})

app.get('/element/update/:id', function(req, res){
    Element.findById(req.params.id)
    .then(data =>
        {
            var dat=data._doc
            console.log(dat)
            res.render('Element_Update',{
                _id:dat._id,
                name:dat.name,
                category:dat.category,
                remarks:dat.remarks,
                filepath:dat.filepath,
                filename:dat.filename
            })
         
       
 
        }).catch(err =>{
            res.status(400).json({ 'status': false, 'message': err });
             
        })
})
  
app.get('/package/create', function(req, res){

    
    Element.find({}, function (err,element){
        if (err) {
            console.log(err);
        } else {
            res.render('Package_Creation', {
            element:element
            });
        }
    })
   
})


app.get('/termsandconditions', function(req, res){
console.log('jfhn')
     
    Terms.find({}, function (err,term){
         if (err) {
            console.log(err);
        } else {
               if(term[0]!==undefined)
               {
              if(term[0].terms.length==0)
                {
                 res.render('Terms_and_Conditions.hbs',{terms:[]})   
                }
            else{
                 res.render('Terms_and_Conditions.hbs',{terms:JSON.stringify(term[0].terms)})   
                 }
                }
                // res.render('Terms_and_Conditions.hbs')   
 }
    })



})

// Package Update Page
app.get('/package/update/:id', function(req, res){

    Package.findById(req.params.id).populate('Element.element')
    .then(data =>
        {
            var dat=data._doc
            var array=[]
            for(var i=0;i<dat.Element.length;i++)
            {
                array.push(dat.Element[i]._doc)
            }

    Element.find({}, function (err,element){
        if (err) {
            console.log(err);
        } else {
            res.render('Package_Update', {
                _id:dat._id,
                packageName:dat.packageName,
                uniqueSerialId:dat.uniqueSerialId,
                packageNumbers:dat.packageNumbers,
                packageRemarks:dat.packageRemarks,
                Element:array,
                filename:dat.filename?dat.filename:"",
                package:JSON.stringify(dat),
                element:element
            });
        }
    })   
       
 
        }).catch(err =>{
            res.status(400).json({ 'status': false, 'message': err });
             
        })
})

// Carousel

app.get('/home/slider', function(req, res){

    Carousel.find({},function(err,slider){
          if(err)
          console.log(err)
          else{
              var arr=[]
              for(var i=0;i<slider[0]._doc.image.length;i++)
              {
                  arr.push(slider[0]._doc.image[i]._doc)
              }
             res.render('Carousel.hbs',{slider:JSON.stringify(arr)})
          }
    })

})


// configure api router
app.use('/api', require('./routes/api'))

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// open the server
app.listen(port, () => {
    console.log(`Express is running on port ${port}`)
})



/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.mongodbUri,
    {useNewUrlParser: true, 
     useUnifiedTopology: true ,
     useCreateIndex:true ,
     autoIndex: false})
     
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error)
db.once('open', ()=>{
    console.log('connected to mongodb server')
})


function getUser()
{
    return JSON.parse(localStorage.getItem('user'))
}
