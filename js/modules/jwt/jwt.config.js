(function () {
  'use strict';

  angular
    .module('app.jwt')
    .config(function(jwtOptionsProvider, env) {
      // Configure a tokenGetter so that the isAuthenticated
      // method from angular-jwt can be used
      jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem(`${env.STORAGE_PREFIX}:id_token`);
        }
      });
  });
})();
