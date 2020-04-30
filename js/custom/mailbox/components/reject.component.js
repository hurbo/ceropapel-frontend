(function () {
  'use strict';
  angular.module('app.mailbox').controller('rejectComponentController', rejectComponentController);
  angular.module('app.mailbox').component('rejectComponent', {
    template: '<div ng-include="rcmp.templateUrl">',
    bindings: {
      document: '='
    },
    controller: rejectComponentController,
    controllerAs: 'rcmp'
  });

  rejectComponentController.$inject = [
    '$rootScope',
    '$q',
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'ViewDocumentFactory',
    'profileFactory',
    'DocumentFactory',
    'ExternalsFactory'
  ];

  function rejectComponentController(
    $rootScope,
    $q,
    $uibModal,
    $uibModalStack,
    swalFactory,
    ViewDocumentFactory,
    Profile,
    DocumentFactory,
    Externals
  ) {
    var vm = this;
    vm.templateUrl = 'views/mailbox/components/reject.html';
    vm.ok = ok;
    vm.open = open;
    vm.cancel = cancel;


    function ok() {
      if (!vm.rejectMessage || vm.rejectMessage === '') {
        swalFactory.error('Agrega razon por la cual rechazas el oficio');
        return;
      }
      vm.loading = true;
      var data;
      if (vm.internal) {
        data = {
          docID: vm.inbox.documentID,
          rejectMessage: vm.rejectMessage,
        };
        DocumentFactory.reject(data, function (err, solve) {
          if (err) {
            console.error(err);
            swalFactory.error(err.message);
          } else {
            ViewDocumentFactory.sendReloadMessageViewInbox(true);
            cancel();
            swalFactory.success('Oficio rechazado');
          }
        });
      } else {
        data = {
          docID: vm.inbox.documentID,
          inboxID: vm.inbox.id,
          boss: vm.currentBoss,
          rejectMessage: vm.rejectMessage,
          clerk: vm.profile
        };


        DocumentFactory.rejectLikeSecretary(data, function (err, solve) {
          if (err) {
            console.error(err);
            swalFactory.error(err.message);
          } else {
            ViewDocumentFactory.sendReloadMessageViewInbox(true);
            cancel();
            swalFactory.success('Oficio rechazado');
          }
        });
      }

    }

    function cancel() {
      $uibModalStack.dismissAll();
    }

    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/rejectModal.html',
        controller: rejectComponentController,
        size: size
      });
    }

    _init();

    function _init() {

      let defer = $q.defer();
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        ViewDocumentFactory.getInbox().then(function (inbox) {
          vm.inbox = inbox;
          ViewDocumentFactory.getBox().then(function (box) {
            vm.currentBox = box;


            if (vm.currentBox === 'internalIn') {
              vm.internal = true;

              if ((!vm.inbox.status || vm.inbox.status === 'Leído') && vm.inbox.signed === 0 && vm.inbox.toJT === vm.profile.jobTitleID) {
                vm.active = true;
                defer.resolve();
              } else {
                vm.active = false;
                defer.resolve();
              }
            } else if (vm.currentBox === 'externalIn') {
              vm.internal = false;
              Externals.validatePermision('turn').then(function (can) {
                if (can) {
                  vm.currentBoss = Externals.getCurrentUser();
                  if ((vm.inbox.status === 'Leído' || !vm.inbox.status) && vm.inbox.signed === 0 && vm.inbox.toJT === vm.currentBoss.jobTitleID) {
                    vm.active = true;
                    defer.resolve();
                  } else {
                    vm.active = false;
                    defer.resolve();
                  }
                } else {
                  vm.active = false;
                  defer.resolve();
                }
              });

            }
          });
        });
      });


      return defer.promise;
    }
  }

}());