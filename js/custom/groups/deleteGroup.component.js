(function () {
  'use strict';

  angular.module('app.groups').controller('deleteGroupComponentController', deleteGroupComponentController);

  angular.module('app.groups').component('deleteGroupComponent', {
    template: '<div ng-include="dgcmp.templateUrl">',
    bindings: {
      group: '='
    },
    controller: deleteGroupComponentController,
    controllerAs: 'dgcmp'

  });


  deleteGroupComponentController.$inject = [
    'Groups',

    '$uibModal',
    '$uibModalStack',

    '$rootScope',
    'swalFactory'
  ];

  function deleteGroupComponentController(
    Groups,

    $uibModal,
    $uibModalStack,
    $rootScope,
    swalFactory
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/groups/deleteGroup.html';
    vm.open = open;
    vm.ok = ok;
    vm.setCurrentGroup = setCurrentGroup;




    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };



    function open(size) {
      $uibModal.open({
        templateUrl: 'views/groups/deleteGroupModal.html',

        controller: deleteGroupComponentController,
        size: size
      });
    }

    function ok() {

      Groups.deleteGroup(vm.currentGroup.id, function (err, data) {

        if (err) {
          swalFactory.error(err.message);
        } else {
          $rootScope.$broadcast('reloadGroups');
          Groups.getReloadOwn({}, function (err, groups) {
            swalFactory.success('Grupo eliminado');
            vm.cancel();
          });

        }
      });

    }

    function setCurrentGroup(group) {

      Groups.setCurrentGroup(group);
    }



    init();

    function init() {

      vm.currentGroup = Groups.getCurrentGroup();

    }


  }

}());