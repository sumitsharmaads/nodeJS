const express = require('express');
const app = express();
const jwt =require('jsonwebtoken');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


var mongoose =require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Signupdata");

var path = require('path');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

let transporter = nodemailer.createTransport({
	service:'gmail',
	secure:'false',
	port:25,
	auth: {
		user: 'sumit.sdadhich@gmail.com',
		pass:  'sumit@1997'
	},
	tls: {
		rejectUnauthorized:false
	}
});

let HelperOption = {
	from: '"Sumit Sharma" <sumit.sdadhich@gmail.com>',
	to: 'sumitdadhich310@gmail.com',
	subject: 'Hello, world!',
	text: 'Wow this tutorial is amazing'
};

transporter.sendMail(HelperOption, (error,info) => {
	if(error){
		return console.log('error');
	}
	console.log('The message was sent');
	console.log(info);
});


var UserdataSchema = mongoose.Schema({
  firstname : String,
  lastname: String,
  emailId : String,
  gender:String,
  contact:Number,
  accountType:String,
  roles: [{ type: 'String' }],
  newToken:String,
  AccountNumber:Number,
  password:String,
  Balance:Number
})

var User = mongoose.model('Data',UserdataSchema);
module.export = User;

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
    res.header('Access-Control-Max-Age', 1728000);
   	res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Content-Length', 0);
      
    if ('OPTIONS' == req.method) {
     	res.send(200);
    }
    else {
    	next();
  	}
	};

  app.use(allowCrossDomain);  
  app.disable('etag');

app.post('/database',function(req,res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var password = req.body.password;
  var emailId = req.body.emailId;
  var gender = req.body.gender;
  var contact = req.body.contact;
  var accountType = req.body.accountType;
  var Balance = req.body.Balance

  var user = new User({
    firstname:firstname,
    lastname:lastname,
    password:password,
    emailId:emailId,
    gender:gender,
    contact:contact,
    accountType:accountType,
    Balance:Balance
  })


  user.save(user,function(err,isMatch){
    if(err){
      res.json({"status":false});
    'user match data :'+isMatch}
    else{
      console.log('user match data :'+isMatch);
      res.json({"status":true});
    }
   let HelperOption = {
	from: '"Sumit Sharma" <sumit.sdadhich@gmail.com>',
	to: req.body.emailId,
	subject: 'Hello, world!',
	text: 'Wow this tutorial is amazing'
};

transporter.sendMail(HelperOption, (error,info) => {
	if(error){
		return console.log('error');
	}
	console.log('The message was sent');
	console.log(info);
});

let HelperOptionin = {
	from: '"Sumit Sharma" <sumit.sdadhich@gmail.com>',
	to: req.body.emailId,
	subject: 'second mail',
	text: 'Wow this tutorial is amazing'
};

transporter.sendMail(HelperOptionin, (error,info) => {
	if(error){
		return console.log('error');
	}
	console.log('The message was sent');
	console.log(info);
});

  })
})

app.post('/verification',function(req,res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var password = req.body.password;
  var emailId = req.body.emailId;
  var gender = req.body.gender;
  var contact = req.body.contact;
  var accountType = req.body.accountType;

  var user = new User({
    firstname:firstname,
    lastname:lastname,
    password:password,
    emailId:emailId,
    gender:gender,
    contact:contact,
    accountType:accountType
  })

  jwt.sign({user}, 'secretkey', (err,token) => {
  	if (err) { return res.status(500).send({ msg: err.message }); }
  	let HelperOption = {
		from: '"Sumit Sharma" <sumit.sdadhich@gmail.com>',
		to: req.body.emailId,
		subject: 'verify your Email address',
		text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
	};
	transporter.sendMail(HelperOption, (error,info) => {
		if(error){
			return console.log('error');
		}
		console.log('The message was sent');
		console.log(info);
	});

  })


  user.save(user,function(err,isMatch){
    if(err){
      res.json({"status":false});
    'user match data :'+isMatch}
    else{
      console.log('user match data :'+isMatch);
      res.json({"status":true});
    }   
  })
})
  // When user login then check status

  app.post('/login', function(req, res) {
      console.log('Req body in login ', req.body)
      var uemail = req.body.email;
      var upassword = req.body.password;
      var cursor = User.find();
      User.findOne({ emailId: uemail, password: upassword }, function(err, doc){
           if(err) {
             console.log('THIS IS ERROR RESPONSE')
              res.json(err)}
            else {
               console.log("Found: " + uemail + ", pass=" + upassword);
                 res.json(doc);
                 console.log(doc);
                } 
     });
 })

  //When user signup at that time:-
  app.post('/register', function(req, res, next) {
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var emailId = req.body.emailId;
      var gender = req.body.gender;
      var accountType = req.body.account;
      var Balance = req.body.balance;
      console.log(req.body);

     User.findOne({emailId:emailId}, function(err, isMatch) {
          console.log('match is '+isMatch);
          console.log('err is '+err);
          if(isMatch !=null) {
            console.log('Username Already exist')
             res.json("null");
            console.log("null");
          } 
        else {

        var newToken = jwt.sign({
            data: 'user'
            }, 'secret', { expiresIn: '1h' });
        console.log(newToken);
        console.log(req.body);
        var randPassword = Array(10).fill("0123456789ABCDEFGHIJKUVWXYZabcdjklmnopqrstuvwxyz@$&").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        var AccountNumber = 54325+Array(7).fill("0123456789").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        console.log(randPassword);
        var user = new User({
        firstname : firstname ,
        lastname : lastname ,
        emailId : emailId ,
        newToken:newToken,
        password:randPassword,
        AccountNumber:AccountNumber,
        gender:gender,
        accountType:accountType,
        Balance:Balance
      });
      var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          service: 'gmail',
           auth: {
                user: 'sumit.sdadhich@gmail.com',
                pass: 'sumit@1997'
            }
      });
      link="http://192.168.0.100:1000/verify/"+newToken;

    var mailOptions = {
        from: 'sumit.sdadhich@gmail.com',
        to: req.body.emailId,
        subject: 'Verify your account',
        html:'<p>Thanks for registering with us!Please verify using below link</p><a href='+link+'>'+link+'</a>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } 
       else {
         console.log('Email sent: ' + info.response);
        }
    });

    var mailOptionsat = {
        from: 'sumit.sdadhich@gmail.com',
        to: req.body.emailId,
        subject: 'Your Randompassword',
        html:'<p>This is your default password</p>'+randPassword+' '+
        '<p>This is your Account Number</p>'+AccountNumber+''
    };

    transporter.sendMail(mailOptionsat, function(error, info){
        if (error) {
          console.log(error);
        } 
       else {
         console.log('Email sent: ' + info.response);
        }
    });
 
    user.save(user, function(err, isMatch) {
        console.log('ISMATCH IS: ' + isMatch)
        if(err) {
          console.log('THIS IS ERROR RESPONSE')
           res.json({"status": false})
        } 
        else {
          console.log('THIS IS ISMATCH RESPONSE')
          res.json({"status": true}) 
        }
      })
    }
  })
});

// Verify the link in tarsem system
app.post('/verify',function(req,res){
    var newToken = req.body.token;
    User.findOne({newToken:newToken}, function(err, isMatch) {
      console.log('ISMATCH IS: ' + isMatch)
      if(err) {
      console.log('THIS IS ERROR RESPONSE')
      res.json(err)
      } 
      else {
      console.log('THIS IS ISMATCH RESPONSE');
      res.json(isMatch);
      }
    })
 });

// Update password
app.post('/update', function(req,res){
    console.log('Req body in update ', req.body);
    var oldpassword = req.body.old;
    var Newpassword = req.body.newpass;
     User.updateOne({password:oldpassword}, { $set: {password:Newpassword } },{upsert:false,multi:true}, function(err, isMatch) {
          console.log('ISMATCH IS: ' + isMatch)
          if(err) {
            console.log('THIS IS ERROR RESPONSE')
            res.json(err)
          } 
          else {
            console.log('THIS IS ISMATCH RESPONSE');
            res.json(isMatch);
        }
    });
})
// Credit balance in account
app.post('/Credit', function(req,res){
    console.log('Req body in update ', req.body);
    var  AccountNumber = req.body.anumber;
    var newBalance = req.body.amount;
     User.updateOne({AccountNumber:AccountNumber}, { $set: {Balance:{$sum: newBalance} },{upsert:false,multi:true}, function(err, isMatch) {
          console.log('ISMATCH IS: ' + isMatch)
          if(err) {
            console.log('THIS IS ERROR RESPONSE')
            res.json(err)
          } 
          else {
            console.log('THIS IS ISMATCH RESPONSE');
            res.json(isMatch);
        }
    });
})

// Verify the link
app.post('/verifys',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
else
{
    res.end("<h1>Request is from unknown source");
}
});

// data for assignment1 
app.post('/datafromdatabase',function(req,res) {
  console.log('i am in product details');
  var details = [{image:"https://www.staples-3p.com/s7/is/image/Staples/s0045503_sc7?$std$", name:"File Folder", price:"4$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/s1110366_sc7?$std$", name:"Duty Storage Box", price:"7$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/sp38714709_sc7?$std$", name:"Desk pad calender", price:"5$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/s0263364_sc7?$std$", name:"Metal Blinder Clips", price:"6$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/s1102000_sc7?$std$", name:"Security Tints", price:"8$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/sp40797619_sc7?$std$", name:"Leg Length", price:"9$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/s1126805_sc7?$std$", name:"Hammermil Copy", price:"36$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/sp41812200_sc7?$std$", name:"Fine Point Black", price:"11$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/s1012201_sc7?$std$", name:"Black Ink", price:"110$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/sp43814291_sc7?$std$", name:"Facial Tissue", price:"10$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/s0726854_sc7?$std$", name:"Insulated Hot Cup", price:"6$"},
      {image:"https://www.staples-3p.com/s7/is/image/Staples/m007047915_sc7?$std$", name:"Trash Bags", price:"15$"}
      ];
  res.send(details)
})

//23467890
app.listen(4000, function (){
	console.log("Example app listening");
})