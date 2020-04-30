(function () {
  'use strict';

  angular.module('app.mailbox').controller('requestCancelComponentController', requestCancelComponentController);

  angular.module('app.mailbox').component('requestCancelComponent', {
    template: '<div ng-include="rcacmp.templateUrl">',
    bindings: {
      document: '='
    },
    controller: requestCancelComponentController,
    controllerAs: 'rcacmp'

  });


  requestCancelComponentController.$inject = [
    '$state',

    '$q',
    'ViewDocumentFactory',
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'inboxFactory',
    'profileFactory'
  ];

  function requestCancelComponentController(
    $state,
    $q,
    ViewDocumentFactory,
    $uibModal,
    $uibModalStack,
    swalFactory,
    inboxFactory,
    Profile
  ) {
    var vm = this;
    vm.folderToEdit = false;
    vm.templateUrl = 'views/mailbox/components/requestCancel.html';
    vm.ok = ok;
    vm.open = open;
    vm.cancel = cancel;
    vm.currentFolder = false;




    function ok() {
      var data = {
        password: vm.password
      };
      vm.loading = true;
      inboxFactory.validatePassword(data, function (err, solve) {
        if (err) {
          vm.loading = false;
          swalFactory.error(err.message);
          return;
        } else {

          if (vm.simpleCancel) {
            var data = {
              id: vm.currentDocument.id,
              password: vm.password,
              docID: vm.currentDocument.id,
              cancelMessage: vm.message,
              uuid: vm.currentDocument.uuid || vm.currentDocument.UUID,
            };




            inboxFactory.cancelDocument(data, function (err, solve) {
              if (err) {

                vm.loading = false;
                swalFactory.error(err.message);
              } else {

                vm.loading = false;
                vm.cancel();
                swalFactory.success('Oficio cancelado');
                $state.go('app.mailbox.internal.out');
              }
            });
          } else {
            var data = {
              docID: vm.currentDocument.id,
              cancelMessage: vm.message,
              uuid: vm.currentDocument.uuid || vm.currentDocument.UUID,
            };
            inboxFactory.requestCancelDocument(data, function (error, data) {


              if (error) {
                vm.loading = false;
                swalFactory.error(error.message);
              } else {
                vm.cancel();
                swalFactory.success('Solicitud enviada');
                vm.loading = false;

              }

            });
          }
        }
      });
    }



    function cancel() {
      $uibModalStack.dismissAll();
    }


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/requestCancelModal.html',
        controller: requestCancelComponentController,
        size: size
      });
    }

    function _validateCancelType() {

      vm.simpleCancel = true;
      vm.wait = [];

      for (let i = 0; i < vm.involveds.length; i++) {
        var element = vm.involveds[i];
        if (element.signed) {
          if (element.agreeCancel !== 1) {
            vm.wait.push(element);
            vm.simpleCancel = false;
          }
        }
      }



    }

    _init();

    function _init() {

      let defer = $q.defer();
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        ViewDocumentFactory.getCurrentDocumentASYNC().then(function (doc) {
          vm.currentDocument = doc;
          if (doc.jobTitleID === profile.jobTitleID) {
            vm.active = true;
            ViewDocumentFactory.getInvolveds().then(function (involveds) {
              vm.involveds = involveds;
              _validateCancelType();
              defer.resolve();
            }, function (err) {
              console.error('Error al obtener el inbox en requestCancelComponent');
              console.error(err);
              defer.reject();
            });
          } else {
            vm.active = false;
            defer.resolve();
          }
        }, function (error) {
          console.error(error);
        });

      });
      return defer.promise;
    }









  }

}());