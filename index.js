var express = require('express');
var mongoose = require('mongoose');
var pug = require('pug');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//models
var User = require('./models/User');
var Publication = require('./models/Publication');

//app
var app = express();

var db = mongoose.connect('mongodb://localhost:27017/noderest');

//setup
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ useNewUrlParser:true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'sfhjfhghghchgchggc', saveUninitialized: true, resave:true}));

//functon to ensure user is authenticated - express middleware
var authenticated = function (request, response, next) {
    if(request.session && request.session.user) return next(); 
      
    return response.redirect('/login');
}
//routes
app.get('/me', authenticated, function (request, response) {
    response.render('me', {username: request.session.user.username});
});
app.get('/publication',authenticated, function(request, response){
    response.render('publication',{title:'Publish something!'})
});
app.post('/publication',authenticated, function(request, response){
  //response.send(request.body.publication);
  if(!request.body || !request.body.publication){
      return response.render('error', { error: 'no publication found', title: 'Error' })
  } 
  //if a publication exists
  Publication.create({
      publication: request.body.publication,
      author: request.session.user._id
  }, function(err, publication){
     if(err) return response.render('error', {error: 'error creating publication', title:'error'});

     console.log('Publication created successfully!')
     response.redirect('/status/' + publication._id);
  });

});
app.get('/status/:id', function(request, response){
 Publication.findOne({_id: request.params.id}, function(err, publication){
    User.findOne({_id:publication.author}, function(e, user){
        response.render('status', { username: user.username, content: publication.publication });
    });
    
 });
});



app.get('/', function(request, response){
    if (request.session && request.session.user){
      Publication.find({}, null, {sort:{created_at:-1}}, function(err, publications){
          response.render('index', {title: 'Home', publications:publications})
      });
    }else{
        response.render('welcome', {title: 'Welcome'});
      //Publication.find({}, function (err, publications){
          //response.render('welcome', { title: 'Welcome', publications: publications });
      //});
        
    }
    
});


app.get('/login', function(request, response){
    response.render('login',{title:'Login'});    
});

app.post('/login', function(request, response){
    User.findOne({username:request.body.username}, function(err,user){
       if(err) return response.render('error',{error: err, title:'error'});
        if(!user) return response.render('error', { error: 'user does not exist'});
       
       if(user.compare(request.body.password)) {
         request.session.user = user;
         request.session.save();

         console.log('logged in: '+ user.username);

         return response.redirect('/');
       }else{
           return response.render('error', { error: 'incorrect credentials', title: 'error' });
       }    
    });
    //response.send(request.body);
});
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
        } else {
            return response.redirect('/');        
        }
    });

   }else{
       response.render('error',{
        title:'error',
        error:'username and password required'
    });
   }
});
app.get('/user/@:username', function(request, response){
  User.findOne({username: request.params.username}, function(err, user){
    Publication.find({author:user._id}, function(e, publications){
      response.render('user', {
        user: user, 
        title: user.username,
        publications: publications
      });
    });  
  });
});

app.get('/users.json', function(request, response){
    User.find({}, function(err, users){
        if (err) throw err;

        response.send(users);
    });
});
app.get('/register', function (request, response) {
    response.render('register', { title: 'Register' });
});

app.listen(9292);