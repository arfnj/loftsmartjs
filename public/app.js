/*jshint esversion: 6*/

angular.module('loftsmart',['countryCodes'])

.controller('loftsmartController', ['$scope', '$http', 'countries', function ($scope,$http,countries) {

  // controls functionality of form at top of page - add or edit contact
  $scope.editMode = false;
  // fields in form
  $scope.name = '';
  $scope.phone = '';
  $scope.country = 'US';
  $scope.image = '';
  //populates pull-down menu in form
  $scope.countries = [...countries.list];
  //contacts to be displayed
  $scope.contacts = [];
  //captures index in contacts array to ease in updating the view after edits or deletions
  $scope.contactIndex = undefined;
  //controls appearance of filter box
  $scope.filterable = false;
  //controls usage of the space to the right of the form
  $scope.companion = {
                        welcome: true,
                        avatar: false,
                        feedback: false
                      };
  //holds error messages from server
  $scope.result = '';

  //clears fields in form - used often in other functions
  resetForm = function() {
    $scope.name = '';
    $scope.phone = '';
    $scope.country = 'US';
    $scope.image = '';
  };

  //turns "companion" space next to form into a space for user feedback - used often in other functions
  renderFeedback = function(message) {
    $scope.result = message;
    $scope.companion = {
                          avatar: false,
                          welcome: false,
                          feedback: true
                        };
  };

  //makes GET request to server for all contacts
  $scope.getContacts = function() {
    $http({
      method: 'GET',
      url: '/getall',
    })
    .then (function(results) {
      //Check to see if contact list is empty
      if (!Object.keys(results.data).length) {
        renderFeedback("You've got no contacts, buddy");
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

  //makes POST request to server to add contact
  $scope.addContact = function() {
    //Ensure user puts in required contact info
    if ($scope.name === '' || $scope.phone === '') {
      renderFeedback("Please provide a name and number");
    } else {
      let payload = $scope.image === '' ? {name: $scope.name, phone: $scope.phone, country: $scope.country} : {name: $scope.name, phone: $scope.phone, country: $scope.country, image: $scope.image};
      $http({
        method: 'POST',
        url: '/add',
        headers: { 'Content-Type': 'application/json' },
        data: payload
      })
      .then (function(result) {
        //Server returns "Added" when contact successfully added, so screen for that
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
    }
  };

  //makes DELETE request to server to remove contact
  $scope.deleteContact = function(person,index) {
    $http({
      method: 'DELETE',
      url: '/delete',
      headers: { 'Content-Type': 'application/json' },
      data: {name: person}
    })
    .then (function(result) {
      //Server returns "Deleted" when contact successfully added, so screen for that
      if (result.data.status === "Deleted") {
        //Remove deleted contact without re-rendering the whole contact list
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

  //Grabs individual contact info, changes form from add mode to edit mode, and populates fields with current contact info
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

  //Makes PUT request to server once editing is completed
  $scope.processEdit = function() {
    let payload = $scope.image === '' ? {name: $scope.name, phone: $scope.phone, country: $scope.country} : {name: $scope.name, phone: $scope.phone, country: $scope.country, image: $scope.image};
    $http({
      method: 'PUT',
      url: '/edit',
      headers: { 'Content-Type': 'application/json' },
      data: {name: $scope.name, data: payload}
    })
    .then (function(result) {
      //Server returns "Edited" when contact successfully added, so screen for that
      if (result.data.status === "Edited") {
        resetForm();
        $scope.editMode = false;
        $scope.companion = {
                              avatar: false,
                              feedback: false,
                              welcome: true
                            };
        //Replace display info for contact with new information without re-rendering the whole contact list
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
