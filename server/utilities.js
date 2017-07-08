/*jshint esversion: 6*/
const contacts = require('./contacts');
const countryCodes = require('./countrycodes');
const defaultImg = 'https://vignette1.wikia.nocookie.net/simpsonstappedout/images/3/3a/Baby_Gerald.png/revision/latest?cb=20160112173703';

const validNums = {
                    '0': true,
                    '1': true,
                    '2': true,
                    '3': true,
                    '4': true,
                    '5': true,
                    '6': true,
                    '7': true,
                    '8': true,
                    '9': true
                  };

module.exports = {
  phoneBuilder: function(phone,country) {
    let countryCode = countryCodes[country];
    return countryCode[0] === '+' ? countryCode+phone : `+${countryCode}${phone}`;
  },

  contactBuilder: function(res,info,context) {
    let cleanNumber = info.phone.split('').filter(digit => validNums[digit]).join('');
    contacts[info.name] = {
      name: info.name,
      phone: this.phoneBuilder(cleanNumber,info.country),
      image: info.image || defaultImg,
      country: info.country,
      cleanPhone: cleanNumber
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
