(function () {
    'use strict';
  
    angular.module('app.secretariats').controller('editDocumentTypeComponentController', editDocumentTypeComponentController);
  
    angular.module('app.secretariats').component('editDocumentTypeComponent', {
      template: '<div ng-include="eddtcmp.templateUrl">',
      controller: editDocumentTypeComponentController,
      bindings: {
        data: '=',
        profile: '=',
  
      },
      controllerAs: 'eddtcmp'
  
    });
  
  
    editDocumentTypeComponentController.$inject = [
      '$uibModal',
      '$uibModalStack',
      'swalFactory',
      'secretariatsFactory',
      '$rootScope'
    ];
  
    function editDocumentTypeComponentController(
      $uibModal,
      $uibModalStack,
      swalFactory,
      secretariatsFactory,
      $rootScope
    ) {
      var vm = this;
      vm.inbox = null;
      vm.templateUrl = 'views/documentTypes/editDocumentType.html';
      vm.open = open;
      vm.ok = ok;
      vm.setData = setData;
      vm.currentDocumentType = null;
      vm.init = init;
  
  
  
      function setData(data) {
        vm.currentDocumentType = data;
        secretariatsFactory.setDocumentType(data);
  
        open('lg');
      }
  
      vm.cancel = function () {
        $uibModalStack.dismissAll();
      };
  
  
      function open(size) {
  
        $uibModal.open({
          templateUrl: 'views/documentTypes/editDocumentTypeModal.html',
          controller: editDocumentTypeComponentController,
          size: size
        });
      }
  
      function ok(newDocumentType) {
  
  
        secretariatsFactory.editDocumentType(newDocumentType, function (err, solve) {
          if(err){
            swalFactory.error(err.message);
            return;
          }
          if (newDocumentType.jobTitleID) {
  
            $rootScope.$broadcast('refreshDocumentTypesView');
            vm.cancel();
            swalFactory.success('Se actualizo puesto');
          } else {
  
            $rootScope.$broadcast('refreshDocumentTypesView');
            vm.cancel();
            swalFactory.success('Se actualizo área');
          }
        });
  
      }
  
  
  
      // init();
  
      function init() {
  
        vm.currentDocumentType = secretariatsFactory.getDocumentType();
  
      }
  
    }
  
  }());