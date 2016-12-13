'use strict';

const app = angular.module('MSP', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial', 'ngFileUpload', 'angular-loading-bar']);

app.config( ($urlRouterProvider, $locationProvider) => {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

 }); 

 app.run(function($state, $rootScope, $window){

   $rootScope.$state = $state;

   $rootScope.goBack = function(){
    $window.history.back();
  }

 })