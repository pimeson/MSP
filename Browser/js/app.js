'use strict';

const app = angular.module('MSP', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial', 'ngFileUpload', 'angular-loading-bar', 'auth']);

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

 app.run(function ($rootScope, AuthService, $state) {

   const stateRequiresAuth = (state) => {
     return state.data && state.data.authenticate;
   }

   $rootScope.$on('$stateChangeStart', function (event, toState, toParams){

   if(!stateRequiresAuth(toState)){
     return;
   }

   if(AuthService.isAuthenticated()) {
     return;
   }

   event.preventDefault();

   AuthService.getLoggedInUser()
   .then( user => {
     if(user) $state.go(toState.name, toParams) 
     else $state.go('login');
   })
   });


 })