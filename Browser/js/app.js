const angular = require('angular');
const $ = require('jquery');
const lodash = require('lodash');
const bluebird = require('bluebird');
const angular_animate = require('angular-animate');
const angular_material = require('angular-material')
const angular_aria = require('angular-aria');
const angular_ui_router = require('angular-ui-router');
const angular_loading_bar = require('angular-loading-bar');
const ngFileUpload = require('ng-file-upload');
const ngInfiniteScroll = require('ng-infinite-scroll');

const app = angular.module('MSP', ['ui.router', 'ngAnimate', 'ngMaterial', 'ngFileUpload', 'angular-loading-bar', 'auth', 'infinite-scroll']);


app.config( function($urlRouterProvider, $locationProvider) {

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

require('./about')(app);
require('./admin')(app);
require('./auth')(app);
require('./common')(app);
require('./details')(app);
require('./gallery')(app);
require('./home')(app);
require('./login')(app);
require('./navbar')(app);
require('./exhibitManagement')(app);
require('./projectManagement')(app);
require('./allExhibits')(app);