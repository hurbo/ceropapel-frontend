(function () {
  'use strict';

  angular.module('app.auth').controller('AuthController', AuthController);
  AuthController.$inject = ['$rootScope', '$location', 'authService'];

  function AuthController($rootScope, $location, authService) {
    var vm = this;
    vm.service = authService;
    vm.error = null;

    const parsedParams = parseHash();
    if (parsedParams.error) {
      vm.error = {
        message: parsedParams.error,
        desc: parsedParams.error_description,
      }
    }

    function parseHash() {
      let parsedParams = {}

      $location.hash().split('&').map((p) => {
        const part = p.replace('#', '')
        const parts = part.split('=')
        parsedParams[parts[0]] = decodeURI(parts[1])
      });

      return parsedParams;
    }

    vm.login = function login() {
      vm.service.login();
    }

    vm.getUser = function() {
      return JSON.stringify(vm.service.user(), null, 4)
    }
  }
})();
