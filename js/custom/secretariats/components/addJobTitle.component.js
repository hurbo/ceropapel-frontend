(function () {
  'use strict';

  angular.module('app.secretariats').controller('addJobTitleComponentController', addJobTitleComponentController);

  angular.module('app.secretariats').component('addJobTitleComponent', {
    template: '<div ng-include="adjtcmp.templateUrl">',
    controller: addJobTitleComponentController,
    bindings: {
      data: '=',
      profile: '=',

    },
    controllerAs: 'adjtcmp'

  });


  addJobTitleComponentController.$inject = [
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'secretariatsFactory',
    '$rootScope'
  ];

  function addJobTitleComponentController(
    $uibModal,
    $uibModalStack,
    swalFactory,
    secretariatsFactory,
    $rootScope
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/secretariates/addJobTitle.html';
    vm.open = open;
    vm.ok = ok;
    vm.setData = setData;
    vm.currentJobTitle = null;



    function setData(data) {
      secretariatsFactory.setJobTitle(data);
    }

    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };


    function open(size) {

      $uibModal.open({
        templateUrl: 'views/secretariates/addJobTitleModal.html',
        controller: addJobTitleComponentController,
        size: size
      });
    }

    function ok(newJobTitle) {

      vm.currentJobTitle = secretariatsFactory.getJobTitle();

      var newData = {
        name: newJobTitle.name,
        acronym: newJobTitle.acronym,
        jobTitleID: vm.currentJobTitle && vm.currentJobTitle.id ? vm.currentJobTitle.id : null
      };





      secretariatsFactory.createJobTitle(newData, function (err, solve) {



        if (vm.currentJobTitle) {

          $rootScope.$broadcast('refreshSecretariatesView');
          vm.cancel();
          swalFactory.success('Se agregó nuevo puesto');
        } else {

          $rootScope.$broadcast('refreshSecretariatesView');
          vm.cancel();
          swalFactory.success('Se agregó nueva área');
        }
      });

    }




  }

}());