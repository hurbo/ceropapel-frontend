(function () {
  'use strict';

  angular.module('app.mailbox').controller('multipleArchiveComponentController', multipleArchiveComponentController);

  angular
    .module('app.mailbox')
    .component('multipleArchiveComponent', {
      template: '<div ng-include="macmp.templateUrl">',
      bindings: {
        document: '=',
      },
      controller: multipleArchiveComponentController,
      controllerAs: 'macmp'

    });



  multipleArchiveComponentController.$inject = [
    '$state',
    'SweetAlert',
    '$uibModal',
    '$uibModalStack',
    'paginatorFactory',
    'externalSelectedFolder',
    'folderFactory',
    'ExternalsFactory'
  ];



  function multipleArchiveComponentController(
    $state,

    SweetAlert,
    $uibModal,
    $uibModalStack,
    paginatorFactory,
    externalSelectedFolder,
    Folder,
    Externals
  ) {
    var vm = this;
    vm.templateUrl = 'views/mailbox/components/multipleArchive.html';
    vm.externalSelectedFolder = externalSelectedFolder;
    vm.haveInboxesMarked = haveInboxesMarked;

    vm.itsOutbox = null;
    vm.prossesing = false;
    vm.loading = false;
    vm.cancel = cancel;
    vm.open = open;
    vm.ok = ok;

    function cancel() {
      $uibModalStack.dismissAll();
    }


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/multipleArchiveModal.html',
        controller: multipleArchiveComponentController,
        size: size,
        backdrop: 'static',
        keyboard: false
      });
    }


    _activate();

    function _activate() {

      if ($state.current.name.indexOf('app.mailbox.internal') !== -1) {
        vm.active = true;
        vm.internal = true;
        if ($state.current.name.indexOf('.out.') !== -1) {
          vm.itsInbox = false;
        } else {
          vm.itsInbox = true;
        }
      } else {
        Externals.validatePermision('archiveInboxes').then(function (can) {
          if (can) {
            vm.active = true;
            vm.currentBoss = Externals.getCurrentUser();
            vm.internal = false;
            if ($state.current.name.indexOf('external.out') !== -1) {
              vm.itsInbox = false;
            } else {
              vm.itsInbox = true;
            }
          } else {
            vm.active = false;
          }
        });
      }
    }

    function haveInboxesMarked() {
      for (let i = 0; i < paginatorFactory.items.length; i++) {
        var element = paginatorFactory.items[i];
        if (element.selected === true) {
          return true;
        }
      }
      return false;
    }






    function _getInboxMarked() {
      var inboxes = [];
      for (let i = 0; i < paginatorFactory.items.length; i++) {
        var element = paginatorFactory.items[i];
        if (element.selected === true) {
          element['itsInbox'] = vm.itsInbox;
          inboxes.push(element);
        }
      }
      return inboxes;
    }






    function ok() {
      vm.loading = true;

      var data = {
        channel: new Date().getTime(),
        inboxes: _getInboxMarked(),
        folder: vm.externalSelectedFolder.getSelectedFolder().id
      };

      Folder.archiveInboxes(data, function (err, solve) {
        if (err) {
          vm.loading = false;
          SweetAlert.swal({
            title: '¡Error!',
            text: err.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar'
          });
        } else {
          paginatorFactory.refreshPage();
          vm.loading = false;
          cancel();
          SweetAlert.swal({
            title: '¡Hecho!',
            text: 'Se archivaron los oficios',
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });
        }
      });
    }
  }

}());