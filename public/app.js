/*jshint esversion: 6*/

angular.module('loftsmart',['countryCodes'])

.controller('loftsmartController', ['$scope', '$http', 'countries', function ($scope,$http,countries) {

  $scope.name = '';
  $scope.phone = '';
  $scope.country = '';
  $scope.image = '';
  $scope.countries = [...countries.list];

  $scope.getContacts = function() {
    $http({
      method: 'GET',
      url: '/getall',
    })
    .then (function(results) {
      // TBD
    })
    .catch(function(error) {
      // TBD
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
      // TBD
    })
    .catch(function(error) {
      // TBD
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
      // TBD
    })
    .catch(function(error) {
      // TBD
    });
  };


  $scope.editContact = function(person) {
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


