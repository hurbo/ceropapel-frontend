(function () {
  'use strict';

  angular
    .module('app.auth', ['auth0.auth0', 'angular-jwt', 'app.environment'])
    .config(function($httpProvider, angularAuth0Provider, jwtOptionsProvider, env) {
      // Configure a tokenGetter so that the isAuthenticated method from angular-jwt can be used
      jwtOptionsProvider.config({
        tokenGetter: [function(store) {
          return localStorage.getItem(`${env.STORAGE_PREFIX}:id_token`);
        }]
      });

      // Setup auth0 client
      angularAuth0Provider.init({
        clientID: env.AUTH0_CLIENT_ID,
        domain: env.AUTH0_DOMAIN,
        redirectUri: env.AUTH0_CALLBACK_URL,
        audience: env.AUTH0_AUDIENCE,
        responseType: 'token id_token',
      });
  });
})();
