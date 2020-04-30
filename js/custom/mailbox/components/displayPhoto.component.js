(function () {
  'use strict';

  angular.module('app.mailbox').controller('displayPhotoComponentController', displayPhotoComponentController);

  angular.module('app.mailbox').component('displayPhotoComponent', {
    template: '<div ng-include="dpcmp.templateUrl">',
    bindings: {
      file: '=',
    },
    controller: displayPhotoComponentController,
    controllerAs: 'dpcmp'

  });


  displayPhotoComponentController.$inject = [
    '$q',
    'ViewDocumentFactory',
    '$uibModal',
    '$uibModalStack'
  ];

  function displayPhotoComponentController(
    $q,
    ViewDocumentFactory,
    $uibModal,
    $uibModalStack
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/mailbox/components/displayPhoto.html';
    vm.open = open;
    vm.cancel = cancel;
    vm.setImage = setImage;






    function setImage(image) {

      ViewDocumentFactory.setCurrentImage(image);
      vm.currentImage = image;
    }



    function cancel() {
      $uibModalStack.dismissAll();
    }


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/displayPhotoModal.html',
        controller: displayPhotoComponentController,
        size: size
      });
    }



    _init();

    function _init() {

      let defer = $q.defer();
      ViewDocumentFactory.getCurrentImage().then(function (image) {
        vm.currentImage = image;
      });
      return defer.promise;
    }
  }

}());