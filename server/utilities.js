/*jshint esversion: 6*/
const contacts = require('./contacts');
const countryCodes = require('./countrycodes');
const defaultImg = ''; // Pick a default image!

module.exports = {
  phoneBuilder: function(phone,country) {
    let countryCode = countryCodes[country];
    return countryCode[0] === '+' ? countryCode+phone : `+${countryCode}${phone}`;
  },

  contactBuilder: function(res,info,context) {
    contacts[info.name] = {
      phone: this.phoneBuilder(info.phone,info.country),
      image: info.image || defaultImg
    };
    this.responseBuilder(res,context,info.name,contacts[info.name]);
  },

  responseBuilder: function(res,message,person,data) {
    res.send({
      status: message,
      name: person,
      contact: data
    });
  },

  deleter: function(res,person) {
    let temp = contacts[person];
    delete contacts[person];
    this.responseBuilder(res,"Deleted",person,temp);
  },

  editor: function(res,person,data) {
    if (data.name !== person) {
      delete contacts[person];
    }
    this.contactBuilder(res,data,"Edited");
  }

};
