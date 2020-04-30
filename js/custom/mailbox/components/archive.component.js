(function () {
  'use strict';

  angular.module('app.mailbox').controller('archiveComponentController', archiveComponentController);

  angular.module('app.mailbox').component('archiveComponent', {
    template: '<div ng-include="acmp.templateUrl">',
    bindings: {
      document: '=',
      needReload: '='
    },
    controller: archiveComponentController,
    controllerAs: 'acmp'
  });


  archiveComponentController.$inject = [
    '$q',
    'ViewDocumentFactory',
    '$uibModal',
    '$uibModalStack',
    'SweetAlert',
    'folderFactory'
  ];

  function archiveComponentController(
    $q,
    ViewDocumentFactory,
    $uibModal,
    $uibModalStack,
    SweetAlert,
    Folder
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/mailbox/components/archive.html';
    vm.open = open;
    vm.openArchive = openArchive;
    vm.openUnarchive = openUnarchive;
    vm.unarchive = unarchive;
    vm.archive = archive;

    function unarchive() {
      var data = {
        inbox: vm.inbox.id,
      };
      if (vm.itsOutbox) {

        Folder.unarchiveOut(data, function (err, solve) {
          if (err) {
            console.error(err);
            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });
          } else {
            vm.ViewFactory.sendReloadMessageViewInbox(true);
            vm.ViewFactory.toggleViewArchive(true);
            SweetAlert.swal({
              title: 'Hecho!',
              text: 'Oficio desarchivado',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#253846',
              confirmButtonText: 'Aceptar',
              timer: 1000
            });
            $uibModalStack.dismissAll();
          }
        });
      } else {
        Folder.unarchive(data, function (err, solve) {
          if (err) {
            console.error(err);
            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });
          } else {
            vm.ViewFactory.sendReloadMessageViewInbox(true);
            vm.ViewFactory.toggleViewArchive(true);
            SweetAlert.swal({
              title: 'Hecho!',
              text: 'Oficio desarchivado',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#253846',
              confirmButtonText: 'Aceptar',
              timer: 1000
            });
            $uibModalStack.dismissAll();
          }
        });
      }
    }

    function archive() {
      var currentFolder = vm.ViewFactory.getSelectedFolder();
      var data = {
        inbox: vm.inbox.id,
        folder: currentFolder.id
      };
      if (vm.itsOutbox) {
        Folder.archiveOut(data, function (err, solve) {
          if (err) {
            console.error(err);
            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });
          } else {
            vm.ViewFactory.sendReloadMessageViewInbox(true);
            vm.ViewFactory.toggleViewArchive(false);
            SweetAlert.swal({
              title: 'Hecho!',
              text: 'Oficio archivado',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#253846',
              confirmButtonText: 'Aceptar',
              timer: 1000
            });
            $uibModalStack.dismissAll();
          }
        });
      } else {
        Folder.archive(data, function (err, solve) {
          if (err) {
            console.error(err);
            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });
          } else {
            console.error();
            vm.ViewFactory.toggleViewArchive(false);
            vm.ViewFactory.sendReloadMessageViewInbox(true);
            SweetAlert.swal({
              title: 'Hecho!',
              text: 'Oficio archivado',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#253846',
              confirmButtonText: 'Aceptar',
              timer: 1000
            });
            $uibModalStack.dismissAll();
          }
        });
      }
    }

    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };


    function openArchive(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/archiveModal.html',
        controller: archiveComponentController,
        size: size
      });
    }

    function openUnarchive(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/unarchiveModal.html',
        controller: archiveComponentController,
        size: size
      });
    }



    _init();

    function _init() {

      let defer = $q.defer();

      vm.ViewFactory = ViewDocumentFactory;

      vm.profile = vm.ViewFactory.getProfile();
      vm.currentDocument = vm.ViewFactory.getDocument();
      vm.ViewFactory.getInbox().then(function (inbox) {
        vm.ViewFactory.getBox().then(function (box) {
          vm.currentBox = box;
          vm.itsOutbox = vm.currentBox === 'externalOut' || vm.currentBox === 'internalOut';

          vm.inbox = inbox;
          vm.fallUpon = vm.ViewFactory.fallUpon;
          defer.resolve();
        }, function (err) {
          console.error('Error al obtener el box en archiveComponent');
          console.error(err);
        });

      }, function (err) {
        console.error('Error al obtener el inbox en archiveComponent');
        console.error(err);
      });


      return defer.promise;
    }
  }

}());