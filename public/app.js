/*jshint esversion: 6*/

angular.module('loftsmart',['countryCodes'])

.controller('loftsmartController', ['$scope', '$http', 'countries', function ($scope,$http,countries) {

  $scope.editMode = false;
  $scope.name = '';
  $scope.phone = '';
  $scope.country = 'US';
  $scope.image = '';
  $scope.countries = [...countries.list];
  $scope.contacts = [];
  $scope.contactIndex = undefined;
  $scope.filterable = false;
  $scope.companion = {
                        welcome: true,
                        avatar: false,
                        feedback: false
                      };
  $scope.result = ''; // To be used to capture error messages from server

  resetForm = function() {
    $scope.name = '';
    $scope.phone = '';
    $scope.country = 'US';
    $scope.image = '';
  };

  renderFeedback = function(message) {
    $scope.result = message;
    $scope.companion = {
                          avatar: false,
                          welcome: false,
                          feedback: true
                        };
  };

  $scope.getContacts = function() {
    $http({
      method: 'GET',
      url: '/getall',
    })
    .then (function(results) {
      if (!Object.keys(results.data).length) {
        $scope.result = "You've got no contacts, buddy";
        $scope.companion = {
                              welcome: false,
                              avatar: false,
                              feedback: true
                            };
      } else {
        $scope.filterable = true;
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
        resetForm();
        $scope.filterable = true;
        $scope.companion = {
                              avatar: false,
                              feedback: false,
                              welcome: true
                            };
        $scope.contacts.push(result.data.contact);
      } else {
        renderFeedback(result.data.status);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  $scope.deleteContact = function(person,index) {
    $http({
      method: 'DELETE',
      url: '/delete',
      headers: { 'Content-Type': 'application/json' },
      data: {name: person}
    })
    .then (function(result) {
      if (result.data.status === "Deleted") {
        $scope.contacts.splice(index,1);
        if (!$scope.contacts.length) {
          $scope.filterable = false;
          resetForm();
          $scope.editMode = false;
        }
      } else {
        renderFeedback(result.data.status);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  $scope.editContact = function(person,index) {
    $scope.contactIndex = index;
    $scope.name = person;
    $scope.phone = $scope.contacts[index].cleanPhone;
    $scope.country = $scope.contacts[index].country;
    $scope.image = $scope.contacts[index].image;
    $scope.companion = {
                          welcome: false,
                          feedback: false,
                          avatar: true
                        };
    $scope.editMode = true;
  };

  $scope.processEdit = function() {
    let payload = $scope.image === '' ? {name: $scope.name, phone: $scope.phone, country: $scope.country} : {name: $scope.name, phone: $scope.phone, country: $scope.country, image: $scope.image};
    $http({
      method: 'PUT',
      url: '/edit',
      headers: { 'Content-Type': 'application/json' },
      data: {name: $scope.name, data: payload}
    })
    .then (function(result) {
      if (result.data.status === "Edited") {
        resetForm();
        $scope.editMode = false;
        $scope.companion = {
                              avatar: false,
                              feedback: false,
                              welcome: true
                            };
        $scope.contacts[$scope.contactIndex] = result.data.contact;
      } else {
        renderFeedback(result.data.status);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  };

}]);
