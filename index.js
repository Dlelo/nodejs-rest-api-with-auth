var express = require('express');
var mongoose = require('mongoose');
var pug = require('pug');
var bodyParser = require('body-parser');

//app
var app = express();

//setup
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//routes
app.get('/', function(request, response){
    response.render('index', {title:'Welcome to getit'});
});

app.get('/login', function(request, response){
    response.render('login',{title:'Login'});    
});
app.post('/login', function(request, response){
    response.send(request.body);
})
app.get('/register', function (request, response) {
    response.render('register', { title: 'Register' });
});

app.listen(9292);