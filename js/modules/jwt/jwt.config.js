(function () {
  'use strict';

  angular
    .module('app.jwt')
    .config(function(jwtOptionsProvider) {
      // Configure a tokenGetter so that the isAuthenticated
      // method from angular-jwt can be used
      jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        }
      });
  });
})();
