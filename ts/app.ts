/// <reference path="defs/angular.d.ts" />
/// <reference path="defs/typescriptServices.d.ts" />

'use strict';

module App {

    var worker = new Worker("js/worker.js");
    worker.postMessage("Start"); // Start the worker.

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


    // 
    // Actions
    //
    var LIST_FILES  = 0;
    var FETCH_FILE  = 1;
    var VERIFY_FILE = 2;


    function MainCtrl($scope, $http) {

        $scope.url = 'server.php';

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
                var _scope = $scope;
                $http.post($scope.url, { action: LIST_FILES, program: "" }).
                    success(function(response) { 
                        _scope.allTests = response.filter(function(s) { return typeof s === "string"; })      // KEEP THIS
                        .map(function(a) { return { "name": a, "id": "0" }; }); 
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

        // 
        // Verify
        //
        $scope.verify = function() {

            var src = $scope.editor.getSession().getValue();

            var _scope = $scope;
            $http.post($scope.url, { action: VERIFY_FILE, program: src }).
                success(function(response) {

                    console.log(response);

                }).
            error(function(response){
                console.log("ERROR IN VERIFY RESPONSE");
            });

        }

    }

}
