var express = require('express');
var mongoose = require('mongoose');
var pug = require('pug');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

//models
var User = require('./models/User');

//app
var app = express();

var db = mongoose.connect('mongodb://localhost:27017/noderest');

//setup
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ useNewUrlParser:true }));
app.use(bodyParser.json());

//routes
app.get('/', function(request, response){
    response.render('index', {title:'Welcome'});
});

app.get('/login', function(request, response){
    response.render('login',{title:'Login'});    
});
app.post('/login', function(request, response){
    response.send(request.body);
})
app.post('/register', function (request, response) {
   // console.log(request.body);
   if(request.body.username && request.body.password){
    User.create({
        username:request.body.username,
        password:request.body.password
    }, function(error, user){
        if(error){
            response.render('error',{
                title:'error',
                error:'user not created'
            });
        }else{
            response.send(user);
        }
    });

   }else{
       response.render('error',{
        title:'error',
        error:'username and password required'
    });
   }
});
app.get('/register', function (request, response) {
    response.render('register', { title: 'Register' });
});

app.listen(9292);