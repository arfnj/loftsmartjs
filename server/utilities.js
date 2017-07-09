/*jshint esversion: 6*/
const contacts = require('./contacts');
const countryCodes = require('./countrycodes');

// default avatar image assigned to contact when none provided by user
const defaultImg = 'https://vignette1.wikia.nocookie.net/simpsonstappedout/images/3/3a/Baby_Gerald.png/revision/latest?cb=20160112173703';

// valid characters for phone numbers
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

  // marries dialing prefix from countryCodes object with phone number provided by user
  phoneBuilder: function(phone,country) {
    let countryCode = countryCodes[country];
    return countryCode[0] === '+' ? countryCode+phone : `+${countryCode}${phone}`;
  },

  // cleans up phone number and creates record in contacts object with the contact's name as the key; captures info provided by user to allow for better editing on front end; sends response to front end when done
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

  // creates response object to be returned to front end
  responseBuilder: function(res,message,person,data) {
    res.send({
      status: message,
      name: person,
      contact: data
    });
  },

  // deletes record from contact object and sends response to front end
  deleter: function(res,person) {
    let temp = contacts[person];
    delete contacts[person];
    this.responseBuilder(res,"Deleted",person,temp);
  },

  // edits record in contact object and sends response to front end
  editor: function(res,person,data) {
    if (data.name !== person) {
      delete contacts[person];
    }
    this.contactBuilder(res,data,"Edited");
  }

};
