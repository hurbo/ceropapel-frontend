(function () {
  'use strict';

  angular
    .module('app.jwt')
    .config(jwtConfig);

    jwtConfig.$inject = ['jwtInterceptorProvider' ];

    function jwtConfig(jwtOptionsProvider, env) {
      // Configure a tokenGetter so that the isAuthenticated
      // method from angular-jwt can be used
      console.log('jwtOptions :>> ', jwtOptionsProvider);
      jwtOptionsProvider.$get().config({
        tokenGetter: function() {
          return localStorage.getItem(`${env.STORAGE_PREFIX}:id_token`);
        }
      });
    };
})();
