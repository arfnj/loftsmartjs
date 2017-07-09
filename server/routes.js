/*jshint esversion: 6*/
const contacts = require('./contacts');
const utilities = require('./utilities');


module.exports = function(app, express) {

  // endpoint for returning entire list of contacts
  app.get('/getall', function(req,res){
    res.send(contacts);
  });

  // endpoint for adding add'l contacts; route checks for existence of name before proceeding
  app.post('/add', function(req,res) {
    if (contacts[req.body.name]) {
      utilities.responseBuilder(res,"That contact already exists",req.body.name,contacts[req.body.name]);
    } else {
      utilities.contactBuilder(res,req.body,"Added");
    }
  });

  // endpoint for removing contacts from database; route checks for existence of name before proceeding
  app.delete('/delete', function(req,res) {
    if (!contacts[req.body.name]) {
      utilities.responseBuilder(res,"There is no record with that name",req.body.name,null);
    } else {
      utilities.deleter(res,req.body.name);
    }
  });

  // endpoint for making changes to contacts; route checks for existence of name before proceeding
  app.put('/edit', function(req,res) {
    /*if (!contacts[req.body.name]) {
      utilities.responseBuilder(res,"There is no record with that name",req.body.name,null);
    } else */ if (!Object.keys(req.body.data).length) {
      utilities.responseBuilder(res,"You didn't change any information",req.body.name,contacts[req.body.name]);
    } else {
      utilities.editor(res,req.body.name,req.body.data);
    }
  });

};