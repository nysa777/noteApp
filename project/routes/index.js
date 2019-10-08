var express = require('express');
var router = express.Router();

var Users = require('../models/users');
var Notes = require('../models/notes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wlit' });
});



router.get('/login',function(req,res){
  res.render('login');
})

router.get('/signup',function(req,res){
  res.render('signup');
})

router.post('/signup',function(req,res){
  var user = new Users({
    username: req.body.username,
    password: req.body.password
    // repassword: req.body.repassword
  });
  var promise = user.save()
  promise.then((user)=> {
    console.log('user signed up with values:', user);
  })
});

router.post('/login',function(req, res){
  // console.log('req.......',req.body);
  if (req.body.username && req.body.password){
    Users.find({username: req.body.username, password: req.body.password},function(err, user){
      console.log('logged in user is ...',user);
      res.redirect('/');
    })
  }else {
    console.log("Re-enter username and password");

   }


});



router.get('/addnote',function(req,res){
  res.render('addnote');
});

router.post('/addnote',function(req,res){
  console.log('req.......',req.body);

  var note = new Notes({
    title: req.body.title,
    note: req.body.note
  });
  var promise = note.save()
  promise.then((note)=> {
    console.log('added note is:', note);
    Notes.find().exec(function(err, notes){
      res.render('viewnote',{notes})
    });
  });
});

router.get('/viewnote',function(req,res){
  Notes.find().exec(function(err, notes){
    res.render('viewnote', {notes});
  })
});

router.get('/deletenote/:id', function(req, res) {
  Notes.findOneAndRemove({_id: req.params.id}, function(err, note) {
    console.log('deleted note is', note);
    res.redirect('/viewnote')
  });
});

router.get('/editnote/:id', function(req, res) {
  Notes.findOne({_id: req.params.id}, function(err, note) {
    console.log('edited note is', note);
    res.render('editnote',{note});
  });
});

router.post('/editnote', function(req, res) {
  Notes.findOneAndUpdate({_id: req.body._id}, {$set: req.body},(err,note)=>{
    console.log('note updated', note);
    if(!err) res.redirect('/viewnote')
  });
});

// router.put('/editnote/:id',function(req,res){
//   Notes.find({_id: req.params.id}),edit();
//
// })


// app.get('/'.function (req,res){
//   res.send('Hello World@')
// })

module.exports = router;
