/*jshint esversion: 6*/

angular.module('loftsmart',['countryCodes'])

.controller('loftsmartController', ['$scope', '$http', 'countries', function ($scope,$http,countries) {

  $scope.name = '';
  $scope.phone = '';
  $scope.country = 'US';
  $scope.image = '';
  $scope.countries = [...countries.list];
  $scope.contacts = [];
  $scope.result = ''; // To be used to capture error messages from server

  $scope.getContacts = function() {
    $http({
      method: 'GET',
      url: '/getall',
    })
    .then (function(results) {
      if (!Object.keys(results.data).length) {
        console.log('No contacts, buddy');
      } else {
        $scope.contacts = [];
        for (var key in results.data) {
          $scope.contacts.push(results.data[key]);
        }
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  };


  $scope.addContact = function() {
    let payload = $scope.image === '' ? {name: $scope.name, phone: $scope.phone, country: $scope.country} : {name: $scope.name, phone: $scope.phone, country: $scope.country, image: $scope.image};
    $http({
      method: 'POST',
      url: '/add',
      headers: { 'Content-Type': 'application/json' },
      data: payload
    })
    .then (function(result) {
      if (result.data.status === "Added") {
          $scope.name = '';
          $scope.phone = '';
          $scope.country = 'US';
          $scope.image = '';
        console.log('You did it!');
        console.log(result.data);
      } else {
        console.log(result.data.status);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  $scope.deleteContact = function(person) {
    $http({
      method: 'DELETE',
      url: '/delete',
      headers: { 'Content-Type': 'application/json' },
      data: {name: person}
    })
    .then (function(result) {
      if (result.data.status === "Deleted") {
        $scope.contacts = $scope.contacts.filter(contact => contact.name !== person);
      } else {
        console.log(result.data.status);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  };


  $scope.processEdit = function(person) {
    let payload = $scope.image === '' ? {name: $scope.name, phone: $scope.phone, country: $scope.country} : {name: $scope.name, phone: $scope.phone, country: $scope.country, image: $scope.image};
    $http({
      method: 'PUT',
      url: '/edit',
      headers: { 'Content-Type': 'application/json' },
      data: {name: person, data: payload}
    })
    .then (function(results) {
      // TBD
    })
    .catch(function(error) {
      // TBD
    });
  };

}]);


