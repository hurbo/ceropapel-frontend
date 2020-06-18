(function () {
  'use strict';

  angular.module('app.auth').controller('AuthController', AuthController);
  AuthController.$inject = ['$rootScope', '$state', '$location', 'authService'];

  function AuthController($rootScope, $state, $location, authService) {
    var vm = this;
    vm.service = authService;
    vm.error = null;

    function parseHash() {
      let parsedParams = {}

      $location.hash().split('&').map((p) => {
        const part = p.replace('#', '')
        const parts = part.split('=')
        parsedParams[parts[0]] = decodeURI(parts[1])
      });

      return parsedParams;
    };

    vm.login = function login() {
      vm.service.login();
    }

    vm.onCallbackInit = function() {
      const parsedParams = parseHash();
      if (parsedParams.error) {
        vm.error = {
          message: parsedParams.error,
          desc: parsedParams.error_description,
        }
      } else {
        setTimeout(() => {
          $state.go('app');
        }, 1500);
      }
    }


    vm.goToRoot = function() {
      window.location = window.location.origin;
    }

    vm.getUser = function() {
      return JSON.stringify(vm.service.user(), null, 4)
    }
  }
})();
