const jwt = require('jsonwebtoken')
const User = require('../../../Models/user')
const nodemailer = require("nodemailer")
const express = require('express');
const router = express.Router();
var request = require('request');
const passport = require('passport');
const swal = require('sweetalert');
var otpGenerator = require('otp-generator')
const mongoose = require('mongoose');
const session = require('express-session');
const SellVoucher = require('../../../Models/SellVoucher');
const crypto = require('crypto');

const config = require('../../../config')

const Carousel = require('../../../Models/Carousel');
const Element = require('../../../Models/Element');
const e = require('connect-flash');
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

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
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
            req.fileValidationError = "Forbidden extension";
            return callback(null, false, req.fileValidationError);
        }
        callback(null, true)
    },
    limits: {
        fileSize: 420 * 150 * 200
    }
});



var userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'public/uploads/user')
    },
    filename: (req, file, cb) => {
        
      cb(null, Date.now() + '-' + file.originalname)
    }
});


var userUpload = multer({
    storage: userStorage,
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



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ravi.softsolutions@gmail.com',
        pass: 'X_7709912'
    }
});

/*
    POST /api/auth/register
    {
        username,
        password
    }
*/

router.post('/register', upload.single('userPic'),(req, res, next) =>{
    const { password,
        name,
        emailAddress,
        phoneNumber,
        address,
        userPic,
        dateofbirth,
        aniversary,
        interests,
    } = req.body
    let admin = req.body.admin ? true : false


    let newUser = null

    // create a new user if does not exist
    const create = (user) => {
         if (user) {
            throw new Error('Email Address exists')
        } else {
        

            console.log("file",req.file)
            console.log("body",req.body)
            var filepath=req.file.path
            return User.create(password,
                name,
                emailAddress,
                phoneNumber,
                userPic,
                filepath,
                address,
                dateofbirth,
                aniversary,
                interests,
                admin,
            )

        }
    }

    // count the number of the user
    const count = (user) => {

        console.log({ user })



        var url = process.env.clientUrl + '/verified/?token=' + user._id;



        newUser = user


        return User.count({}).exec()
    }

    // assign admin if count is 1
    const assign = (count) => {
        if (count === 1) {
            return newUser.assignAdmin()
        } else {
            // if not, return a promise that returns false
            return Promise.resolve(false)
        }
    }

    // respond to the client
    const respond = (isAdmin) => {

        res.redirect('/login')


    }

    // run when there is an error (username exists)
    const onError = (error) => {
        console.log("erro", error)
        res.status(409).json({
            message: error.message
        })
    }


    // check username duplication
    User.findOneByEmailAddress(emailAddress)
        .then(create)
        .then(count)
        .then(assign)
        .then(respond)
        .catch(onError)

})

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

router.post('/login', function (req, res, next) {
    const { password,
        emailAddress,
    } = req.body

    const secret = req.app.get('jwt-secret')

    // check the user info & generate the jwt
    const check = (user) => {

        if (!user) {
            // user does not exist
            res.send("Wrong Credentitals !! Please Try Again")
            throw new Error('login failed')
        } else {

            // user exists, check the password
            if (user.verify(password)) {

                req.session.user = user;
                localStorage.setItem('user', JSON.stringify(user))
                //  localStorage.removeItem('user')
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        },
                        secret,
                        {
                            expiresIn: '7d',
                            issuer: 'skyline',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        })
                })

            }


            else {
                /*
                  Swal.fire({
                      title: 'Wrong Credentaiks',
                      text: 'Please try with different username or password',
                      icon: 'danger',
                      showCancelButton: true,
                      confirmButtonText: 'Yes, delete it!',
                      cancelButtonText: 'No, keep it'
                    }).then(() => {
                      res.redirect('/login')
                    })
                    
  */
                res.send("Wrong Credentitals !! Please Try Again")


                throw new Error('login failed')
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.send("true")
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    // find the user
    User.findOneByEmailAddress(emailAddress)
        .then(check)
        .then(respond)
        .catch(onError)


})

/*
    GET /api/auth/check
*/
// Get User List 

router.get('/user_list', function (req, res) {

    User.find({}, function (err, user) {

        if (err) {
            console.log(err);
        } else {

            res.render('User_List.hbs', {
                users: user
            });

        }
    })
});

router.get('/user_details/:id', function (req, res) {

    User.findById(req.params.id)
        .then(user => {
            SellVoucher.find({ sellTo: { $eq: req.params.id } }).populate('elementConsumed.element').populate('package')
                .then(voucher => {
                    if (voucher) {
                         var arr = []
                        for (var i = 0; i < voucher.length; i++) {
                            arr.push(voucher[i]._doc)
                        }

                        for (var i = 0; i < arr; i++) {
                            array.push(arr.elementConsumed)
                        }

                           Element.find({}, function (err, element) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.render('User_Details',
                                    {
                                        user: user, package: JSON.stringify(arr),
                                        packageDetails: arr, element: element,
                                        _id: req.params.id
                                    })
                            }
                        })
                    }
                    else
                        res.render('User_List')
                })
        }).catch(err => {
            res.status(400).json({ 'success': false, 'message': err });

        })

})





router.post('/send_otp/:id', (req, res) => {

    const id = req.params.id
    const sellvocuherid = req.body.sellvoucherid
    var quantity = req.body.quantity
    const qu = quantity

    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    var voucherid;

    SellVoucher.findById(sellvocuherid, function (error, vouc) {
        if (error) {
            console.log(error);
        }
        else {
            var vouchers = vouc
            voucherid = sellvocuherid
            if (vouchers != null) {
                var element = vouchers.elementConsumed
                var elementLength = element.length


                for (var i = 0; i < elementLength; i++) {

                    if (!(JSON.stringify(element[i].element).localeCompare(JSON.stringify(id))) && element[i].consumedDate == null) {
                        if (quantity != 0) {
                            quantity--;
                            element[i].otp = otp
                        }
                        else
                            break;
                    }
                    else
                        continue;
                }
            }

            SellVoucher.update({ _id: voucherid }, vouchers, function (err, vouchers) {
                if (err) {
                    console.log(err)
                }
                else {

                }
            })


        }

    })







    const user = JSON.parse(localStorage.getItem('user'))
    console.log("user", user.emailAddress)

    var userEmail = user.emailAddress;
    var emailText = `<p>Hi ${user.name} .Your OTP is ${otp}`



    //   emailText += '<p><a href="'+url+'">click here</a>';
    var mailOptions = {
        from: 'ravi.softsolutions@gmail.com',
        to: userEmail,
        subject: 'SKYLINE | OTP for Consuming',
        html: emailText
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send({ text: "Failed to Deliver OTP . Please Try Again!!" })
            console.log(error);
            //   res.json({ 'success': false, 'message': error });
        }

        Element.findById(id, function (err, ele) {
            if (err)
                console.log(err)
            else {
                ele.quantity = qu
                res.render('Otp_Verification', { element: ele, sellvoucherid: sellvocuherid })
            }
        })


    });

});





router.post('/verify_otp/:id', (req, res) => {
    const otp = req.body.otp
    SellVoucher.findById(req.params.id, function (err, vouc) {
        if (err)
            console.log(err)
        else {
            var vouchers = vouc

            voucherid = vouchers._id
            const elementConsume = vouchers.elementConsumed

            for (var i = 0; i < elementConsume.length; i++) {
                if (elementConsume[i].consumedDate == null && elementConsume[i].otp !== null) {
                    if (elementConsume[i].otp == otp) {
                        elementConsume[i].consumedDate = new Date()
                    }
                    else {
                        console.log("Wrong OTP")
                    }
                }

            }


            SellVoucher.update({ _id: voucherid }, vouchers, function (err, vouchers) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.redirect('/home')

                }
            })


        }
    })


});


router.get('/logout', function (req, res) {
    localStorage.removeItem('user')
    res.redirect('/home')
});


// delete package
router.get('/delete_user/:id', function (req, res) {
    var del = req.params.id;

    let errors;
    if (errors) {
        console.log(errors);
    }
    else {

        User.findByIdAndRemove(del).
            then(data => {
                res.redirect('/api/user/user_list')
            }).catch(error => {
                res.status(200).json({ status: false, message: error })

            })
    }
});



//Show User Package By Id
router.get('/show_user_package/:id', function (req, res) {

    SellVoucher.findById(req.params.id)
        .populate('package').
        exec(async function (err, voucher) {
            if (err) {
                console.log(err);
            } else {
                const user = JSON.parse(localStorage.getItem('user'))
                if (voucher != null && voucher.length != 0 && user != null) {
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
            res.render('User_Package_Show', data)


        })
})


// Carousel 

router.post('/upload_carousel', upload.array('carousel_image'), (req, res, next) => {

    let errors;
    if (errors) {
        if (req.body.carousel_image.length !== 0) {
            for (var i = 0; i < req.body.carousel_image.length; i++) {
                let filename = './public/uploads/carousel/' + req.body.carousel_image[i];
                fs.stat(filename, function (err, stats) {
                    console.log(stats);//here we got all information of file in stats variable

                    if (err) {
                        return console.error(err);
                    }
                    fs.unlink(filename, function (err) {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                });
            }
        }
        res.render('Carousel.hbs', {
            title: 'Carousel',
            errors: errors
        });
    } else {
        if (req.fileValidationError) {
            res.render('Carousel.hbs', {
                title: 'Carousel',
                errors: req.fileValidationError
            });
        } else {
            let carousel = new Carousel()

            if (req.body.carousel_image.length !== 0) {
                var arr = []
                for (var i = 0; i < req.body.carousel_image.length; i++) {
                    arr.push({
                        filepath: `public/uploads/carousel/${req.body.carousel_image[i]}`,
                        filename: req.body.carousel_image[i]
                    })

                    carousel.image = arr
                    Carousel.find({}, function (err, slide) {
                        if (err)
                            console.log(err)
                        else {
                            if (slide.length == 0) {
                                carousel.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    } else {
                                        res.redirect('/');
                                    }
                                });
                            }
                            else {



                                Carousel.update({ _id: slide[0]._id },
                                    { $set: { image: arr } }).
                                    then(data => {
                                        res.redirect('/');
                                    }).catch(error => {
                                        res.status(400).json({ status: false, message: error })
                                    })

                            }
                        }
                    })



                }
            }




        }
    }
});





/*********************************** Mobile API************************************************************/



router.post('/mobile_login', function (req, res, next) {
    let errors;
    
                     
    if (errors) {
        res.json({ 'success': false, 'message': 'Validation Error' });
    } else {
        User.findOne({ emailAddress: req.body.emailAddress }, function (err, user) {
                 
                    if (err) {
                        res.json({ 'success': false, 'message': err });
                    }
                    if (!user) {
                        res.json({ 'success': false, 'message': 'No user found' });

                    } else {
                        console.log(req.body.password + "  " + user.password+" "+ crypto.createHmac('sha1', config.secret)
                        .update(req.body.password)
                        .digest('base64'))

                        if(user.password==crypto.createHmac('sha1', config.secret)
                        .update(req.body.password)
                        .digest('base64'))
                                {
                                res.json({
                                    'success': true,
                                    'id':user._id,
                                    'email': user.emailAddress,
                                 });
                            } else {
                                res.json({ 'success': false, 'message': 'Wrong password' });
                            }
                            // });
           
    }
});
    }
})


router.post('/mobile_send_otp/:id', (req, res) => {

    const id = req.params.id
    const sellvocuherid = req.body.sellvoucherid
    var quantity = req.body.quantity
    const qu = quantity

    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    var voucherid;

    SellVoucher.findById(sellvocuherid, function (error, vouc) {
        if (error) {
            console.log(error);
        }
        else {
            var vouchers = vouc
            voucherid = sellvocuherid
            if (vouchers != null) {
                var element = vouchers.elementConsumed
                var elementLength = element.length


                for (var i = 0; i < elementLength; i++) {

                    if (!(JSON.stringify(element[i].element).localeCompare(JSON.stringify(id))) && element[i].consumedDate == null) {
                        if (quantity != 0) {
                            quantity--;
                            element[i].otp = otp
                        }
                        else
                            break;
                    }
                    else
                        continue;
                }
            }

            SellVoucher.update({ _id: voucherid }, vouchers, function (err, vouchers) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json({message:"OTP Sent"})
                }
            })
        }

    })
})






module.exports = router;