/*jshint esversion: 6*/
const contacts = require('./contacts');
const countryCodes = require('./countrycodes');
const defaultImg = '';

module.exports = {
  phoneBuilder: function(info) {
    let countryCode = countryCodes[info.country];
    return countryCode[0] === '+' ? countryCode+info.phone : `+${countryCode}${info.phone}`;
  },

  contactBuilder: function(res,info) {
    contacts[info.name] = {
      phone: this.phoneBuilder(info),
      image: info.image || defaultImg
    };
    this.responseBuilder(res,"Success",info.name,contacts[info.name]);
  },

  responseBuilder: function(res,message,person,data) {
    res.send({
      response: message,
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
    if (data.name) {
      contacts[data.name] = contacts[person];
      delete contacts[person];
    }
    let record = data.name || person;
    for (var key in data) {
      contacts[record][key] = data[key];
    }
    this.responseBuilder(res,"Edited",record,contacts[record]);
  }

};
