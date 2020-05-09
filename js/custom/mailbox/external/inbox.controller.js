/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

(function () {
  'use strict';

  angular.module('app.mailbox').controller('externalInboxController', externalInboxController);

  externalInboxController.$inject = [
    'socket',
    '$rootScope',
    'paginatorFactory',
    'filterFactory',
    'profileFactory',
    'ExternalsFactory',
    'swangular'
  ];

  function externalInboxController(
    socket,
    $rootScope,
    paginatorFactory,
    filterFactory,
    Profile,
    ExternalsFactory,
    SweetAlert
  ) {
    var vm = this;

    vm.clickCheckboxMaster = clickCheckboxMaster;
    vm.allSelectedClass = allSelectedClass;
    vm.selectedAll = selectedAll;
    vm.haveInboxesMarked = haveInboxesMarked;
    vm.filter = filterFactory;
    vm.areSelectedAll = false;
    vm.isLoading = false;


    function haveInboxesMarked() {
      for (let i = 0; i < vm.paginator.items.length; i++) {
        var element = vm.paginator.items[i];
        if (element.selected === true) {
          return true;
        }
      }
      return false;
    }



    function selectedAll() {
      if (vm.areSelectedAll) {
        for (let i = 0; i < vm.paginator.items.length; i++) {
          vm.paginator.items[i].selected = false;
          vm.areSelectedAll = false;
        }
      } else {
        for (let i = 0; i < vm.paginator.items.length; i++) {
          vm.paginator.items[i].selected = true;
          vm.areSelectedAll = true;
        }
      }
    }

    function allSelectedClass() {
      var selectedCount = 0;
      for (let i = 0; i < vm.paginator.items.length; i++) {
        var element = vm.paginator.items[i];
        if (element.selected === true) {
          selectedCount++;
        }
      }
      if (vm.paginator.items.length === selectedCount) {
        return 'selected';
      } else {
        return '';
      }

    }




    function clickCheckboxMaster() {
      var selectedCount = 0;
      for (let i = 0; i < vm.paginator.items.length; i++) {
        var element = vm.paginator.items[i];
        if (element.selected === true) {
          selectedCount++;
        }
      }
      if (selectedCount === vm.paginator.items.length) {
        _deselectAll();
      } else {
        _selectAll();
      }
    }


    function _deselectAll() {
      for (let i = 0; i < vm.paginator.items.length; i++) {
        vm.paginator.items[i].selected = false;
      }
    }

    function _selectAll() {
      for (let i = 0; i < vm.paginator.items.length; i++) {
        vm.paginator.items[i].selected = true;
      }
    }

    activate();

    function activate() {

      ExternalsFactory.validatePermision('readIn').then(function (can) {
        vm.currentBoss = ExternalsFactory.getCurrentUser();
        if (can) {
          vm.havePermission = true;
          Profile.getProfile().then(function (profile) {
            vm.profile = profile;
            socket.on('mailbox-in-' + profile.email, function (nuevo) {
              vm.paginator.items.unshift(nuevo);
            });
            socket.on('refresh-inbox-' + profile.email, function (nuevo) {
              vm.paginator.show();
            });
            vm.paginator = paginatorFactory;
            vm.paginator.init('external');
          }, function (err) {
            console.error('Error addMember on getProfile', err);
          });
        } else {
          vm.havePermission = false;
          SweetAlert.swal({
            title: '¡Error!',
            text: 'No puedes acceder al contenido',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
          });
        }
      });

      $rootScope.app.layout.isCollapsed = true;
    }

  }
})();
