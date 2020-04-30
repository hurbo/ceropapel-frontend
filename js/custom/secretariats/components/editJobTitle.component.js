(function () {
  'use strict';

  angular.module('app.secretariats').controller('editJobTitleComponentController', editJobTitleComponentController);

  angular.module('app.secretariats').component('editJobTitleComponent', {
    template: '<div ng-include="edjtcmp.templateUrl">',
    controller: editJobTitleComponentController,
    bindings: {
      data: '=',
      profile: '=',

    },
    controllerAs: 'edjtcmp'

  });


  editJobTitleComponentController.$inject = [
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'secretariatsFactory',
    '$rootScope'
  ];

  function editJobTitleComponentController(
    $uibModal,
    $uibModalStack,
    swalFactory,
    secretariatsFactory,
    $rootScope
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/secretariates/editJobTitle.html';
    vm.open = open;
    vm.ok = ok;
    vm.setData = setData;
    vm.currentJobTitle = null;
    vm.init = init;



    function setData(data) {
      vm.currentJobTitle = data;
      secretariatsFactory.setJobTitle(data);

      open('lg');
    }

    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };


    function open(size) {

      $uibModal.open({
        templateUrl: 'views/secretariates/editJobTitleModal.html',
        controller: editJobTitleComponentController,
        size: size
      });
    }

    function ok(newJobTitle) {


      secretariatsFactory.editJobTitle(newJobTitle, function (err, solve) {
        if(err){
          swalFactory.error(err.message);
          return;
        }
        if (newJobTitle.jobTitleID) {

          $rootScope.$broadcast('refreshSecretariatesView');
          vm.cancel();
          swalFactory.success('Se actualizo puesto');
        } else {

          $rootScope.$broadcast('refreshSecretariatesView');
          vm.cancel();
          swalFactory.success('Se actualizo área');
        }
      });

    }



    // init();

    function init() {

      vm.currentJobTitle = secretariatsFactory.getJobTitle();

    }

  }

}());