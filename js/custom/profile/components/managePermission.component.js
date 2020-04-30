(function () {
  'use strict';

  angular.module('app.profile').controller('managePermissionComponentController', managePermissionComponentController);

  angular.module('app.profile').component('managePermissionComponent', {
    template: '<div ng-include="mpcmp.templateUrl">',
    bindings: {
      user: '='
    },
    controller: managePermissionComponentController,
    controllerAs: 'mpcmp'

  });


  managePermissionComponentController.$inject = [
    '$rootScope',
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'permissionFactory',
    'profileFactory'
  ];

  function managePermissionComponentController(
    $rootScope,
    $uibModal,
    $uibModalStack,
    swalFactory,
    permissionFactory,
    profileFactory

  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/profile/components/managePermission.html';
    vm.open = open;
    vm.setUser = setUser;
    vm.getUser = getUser;
    vm.ok = ok;
    vm.deletePermissions = deletePermissions;
    vm.havePermissions = havePermissions;
    vm.isLoading = false;




    function havePermissions(user) {

      if (vm.profile && vm.profile.jobTitleID) {
        if (user.permissions && user.permissions.bossJobTitleID && user.permissions.bossJobTitleID === vm.profile.jobTitleID) {
          return true;
        }
        for (let i = 0; i < user.permissions.length; i++) {
          var element = user.permissions[i];
          if (vm.profile.jobTitleID === element.bossJobTitleID) {
            return true;
          }
        }

      }

      return false;
    }

    function ok(user) {
      vm.isLoading = true;
      var secretary = {
        user: user,
        permissions: user.permissions
      };
      profileFactory.managePermissions(secretary, function (err, data) {

        $rootScope.$broadcast('updateProfile');
        vm.cancel();
        swalFactory.success('Se modificaron los permisos');


      });
    }


    function deletePermissions(user) {
      vm.isLoading = true;
      var secretary = {
        user: user,
        permissions: user.permissions
      };
      profileFactory.deletePermissions(secretary, function (err, data) {
        if (err) {
          swalFactory.error(err.message);
        } else {
          $rootScope.$broadcast('updateProfile');
          vm.cancel();
          swalFactory.success('Se modificaron los permisos');
        }

      });
    }

    function setUser(data) {
      vm.currentUser = data;
      permissionFactory.setUser(data);
    }

    function getUser() {

      var aux = permissionFactory.getUser();
      if (aux) {
        vm.currentUser = aux;
      }
    }



    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/profile/components/managePermissionModal.html',
        controller: managePermissionComponentController,
        size: size
      });
    }


    init();

    function init() {

      profileFactory.getProfile().then(function (profile) {
        vm.profile = profile;
        if (vm.profile.jobTitleID) {
          getUser();
        }
      });
    }




  }

}());