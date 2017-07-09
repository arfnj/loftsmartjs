/*jshint esversion: 6*/
const contacts = require('./contacts');
const utilities = require('./utilities');

(tester = () => {
  let originalSize = Object.keys(contacts).length;
  console.log('TESTING ADDING TO CONTACT LIST');
  console.log('******************************');
  console.log('Current number of contacts =', originalSize);
  console.log('Adding test contact: "TestingContact, phone number: 9995551234, country: US"');
  contacts.TestingContact = {
                              name: "testingContact",
                              phone: '9995551234',
                              image: true,
                              country: 'US',
                              cleanPhone: utilities.phoneBuilder('9995551234','US')
                            };
  let newSize = Object.keys(contacts).length;
  console.log('Current number of contacts =', newSize);
  console.log('Contact list has one additional contact:', newSize-originalSize === 1);
  console.log('Contact "TestingContact" exists:', contacts.hasOwnProperty("TestingContact"));
  console.log('Contact "TestingContact" has properly formatted E.164 number "+19995551234":', contacts.TestingContact.cleanPhone === "+19995551234");
  console.log('\n');
  console.log('\n');
  console.log('TESTING REMOVING FROM CONTACT LIST');
  console.log('**********************************');
  let current = newSize;
  console.log('Current number of contacts =', current);
  console.log('Deleting test contact: "TestingContact"');
  delete contacts.TestingContact;
  newSize = Object.keys(contacts).length;
  console.log('Current number of contacts =', newSize);
  console.log('Contact list has one fewer contact:', newSize-current === -1);
  console.log('Contact "TestingContact" does not exist:', !contacts.hasOwnProperty("TestingContact"));
  console.log('\n');
  console.log('\n');
})();
