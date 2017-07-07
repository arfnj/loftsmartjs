/*jshint esversion: 6*/
const contacts = require('./contacts');
const utilities = require('./utilities');


module.exports = function(app, express) {

  app.get('/getall', function(req,res){
    res.send(contacts);
  });

  app.post('/add', function(req,res) {
    if (contacts[req.body.name]) {
      utilities.responseBuilder(res,"That contact already exists",req.body.name,contacts[req.body.name]);
    } else {
      utilities.contactBuilder(res,req.body,"Added");
    }
  });

  app.delete('/delete', function(req,res) {
    if (!contacts[req.body.name]) {
      utilities.responseBuilder(res,"There is no record with that name",req.body.name,null);
    } else {
      utilities.deleter(res,req.body.name);
    }
  });

  app.put('/edit', function(req,res) {
    if (!contacts[req.body.name]) {
      utilities.responseBuilder(res,"There is no record with that name",req.body.name,null);
    } else if (!Object.keys(req.body.data).length) {
      utilities.responseBuilder(res,"You didn't change any information",req.body.name,contacts[req.body.name]);
    } else {
      utilities.editor(res,req.body.name,req.body.data);
    }
  });

};