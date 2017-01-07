module.exports = function(app) {

(function () {

  'use strict';

  const app = angular.module('auth', []);

  app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  });

  app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    const statusDict = {
      401: AUTH_EVENTS.notAuthenticated,
      403: AUTH_EVENTS.notAuthorized,
      419: AUTH_EVENTS.sessionTimeout,
      440: AUTH_EVENTS.sessionTimeout
    };
    return {
      responseError: (response) => {
        $rootScope.$broadcast(status[response.status]);
        return $q.reject(response);
      }
    }
  })

  app.config(function ($httpProvider){
    $httpProvider.interceptors.push([
      '$injector',
      ($injector) => $injector.get('AuthInterceptor')
    ])
  })

  app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

    const self = this;

    function onSuccessfulLogin(res) {
      let user = res.data.user;
      Session.create(user);
      $rootScope.$broadcast(AUTH_EVENTS.loginSucess);
      return user;
    }

    this.isAuthenticated = () => !!Session.user;

    this.isAdmin = () => !!Session.user.isAdmin;

    this.getLoggedInUser = function (fromServer) {

      if (this.isAuthenticated() && fromServer !== true) {
        return $q.when(Session.user);
      }

      return $http.get('/session').then(onSuccessfulLogin)
      .catch(() => null);

    }

    this.login = credentials => {
      return $http.post('/login', credentials)
      .then( user => onSuccessfulLogin(user))
      .catch( () => {
        return $q.reject({ message: 'Invalid login credentials.'})
      }) 
    }

    this.logOff = () => {
      return $http.get('/logout')
      .then(res => res.data)
      .catch(() => null);
    }

  })

  app.service('Session', function($rootScope, AUTH_EVENTS) {

    const self = this;

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, () => self.destroy());

    $rootScope.$on(AUTH_EVENTS.sessionTimeout, () => self.destroy());

    this.user = null;

    this.create = function(user) {
      this.user = user;
    };

    this.destroy = () => this.user = null;

  })




}())

};