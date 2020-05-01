(function () {
  'use strict';

  angular.module('app.auth').controller('AuthController', AuthController);
  AuthController.$inject = ['$rootScope', 'authService'];

  function AuthController($rootScope, authService) {
    var vm = this;
    vm.service = authService;

    vm.login = function login() {
      vm.service.login();
    }

    vm.getUser = function() {
      return JSON.stringify(vm.service.user(), null, 4)
    }
  }
})();
