(function () {
  'use strict';

  angular
    .module('app.auth', ['app.environment'])
    .config(function(angularAuth0Provider, env) {

      angularAuth0Provider.init({
        clientID: env.AUTH0_CLIENT_ID,
        domain: env.AUTH0_DOMAIN,
        redirectUri: env.AUTH0_CALLBACK_URL,
        audience: env.AUTH0_AUDIENCE,
        responseType: 'token id_token',
      });
  });
})();
