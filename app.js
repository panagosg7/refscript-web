
'use strict';


//
// Dirs
//


//
// Getting the test files
// 


//
// Global state
//


// 
// Main app
//

var app = angular.module('mgcrea.ngStrapDocs', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap', 'ui.ace', 'ui.bootstrap', 'acute.select']);

app.controller('MainCtrl', MainCtrl);

app.controller('NavbarDemoCtrl', function($scope, $location) {
  $scope.$location = $location;
});


//
// Drop-down controller
//

app.config(function($dropdownProvider) {
  angular.extend($dropdownProvider.defaults, {
    html: true
  });
});

app.controller('DropdownDemoCtrl', function($scope, $alert) {

  $scope.$alert = function(title) {
    $alert({title: title, 
      content: 'Best check yo self, you\'re not looking too good.', 
      placement: 'top', 
      type: 'info', 
      keyboard: true, 
      show: true
    });
  };

});

// TEST

app.controller('AlertDemoCtrl', function ($scope) {
  $scope.alerts = [
    //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    //{ type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});


// 
// Actions
//
var LIST_FILES  = 0;
var FETCH_FILE  = 1;
var VERIFY_FILE = 2;


function MainCtrl($scope, $http) {

  $scope.url = 'server.php';
 
  $scope.listFiles = function() {
    $http.post($scope.url, { "action": LIST_FILES }).
      success(function(data, status) {
        if (data instanceof Array) {
          var c = 0;
          var o = data.map(function(a) { return { "name": a, "id": c++ }; });
        }
        else {
          console.log("ERROR: " + data);        
        }
        //$scope.alerts.push({msg: data });
      }).
      error(function(data, status, headers, config) {
        console.log("ERROR: " + status);
      });
  };
  
  $scope.postTest = function() {
    var pgm = $scope.editor.getSession().getValue();
    $http.post($scope.url, { "action": VERIFY_FILE }).
      success(function(data, status) {
        console.log(data);
        //$scope.alerts.push({msg: data });
      }).
      error(function(data, status, headers, config) {
        console.log("ERROR: " + status);
      });
  };

  $scope.printTest = function() {
    console.log($scope.editor.getSession().getValue());
  };


  //
  // Editor
  //
  $scope.aceLoaded = function(_editor) {
    $scope.editor = _editor;
  }

  //
  // Code select
  //
  $scope.getAllTests = function (callback) {
    if ($scope.allTests.length === 0) {
      console.log("No files -- uninitialized?");
      var _scope = $scope;
      $http.post($scope.url, { "action": LIST_FILES }).
        success(function(response) { 
          _scope.allTests = response.slice(1,400).map(function(a) { return { "name": a, "id": "0" }; }); 
          console.log("initializing now");
          callback(_scope.allTests);
        });
    }
    callback($scope.allTests);
  };

  $scope.testSelected = function (test) {
    $scope.testInfo = test; // ???
    $http.post($scope.url, { action: FETCH_FILE, rel_path: test.name }).
      success(function(response) { 
        $scope.editor.getSession().setValue(response);
      }).
      error(function(response){
        $scope.editor.getSession().setValue("// could not load source");
      });
  };
  
  $scope.allTests = [ ];
  var _scope = $scope;
  $http.post($scope.url, { "action": LIST_FILES }).
    success(function(response) { 
      _scope.allTests = response.slice(1,100).map(function(a) { return { "name": a, "id": "0" }; }); 
    }).
    error(function(response){
      _scope.allTests = [ { "name": "ERROR", "id": "0" } ];
    });

}


