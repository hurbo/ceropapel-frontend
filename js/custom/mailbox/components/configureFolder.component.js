(function () {
  'use strict';

  angular.module('app.mailbox').controller('configureFolderComponentController', configureFolderComponentController);

  angular.module('app.mailbox').component('configureFolderComponent', {
    template: '<div ng-include="cfcmp.templateUrl">',
    bindings: {
      folder: '='
    },
    controller: configureFolderComponentController,
    controllerAs: 'cfcmp'

  });


  configureFolderComponentController.$inject = [
    '$rootScope',
    '$q',
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'folderFactory',
    'externalSelectedFolder',
    'configureFolderFactory'
  ];

  function configureFolderComponentController(
    $rootScope,
    $q,
    $uibModal,
    $uibModalStack,
    swalFactory,
    Folder,
    externalSelectedFolder,
    configureFolderFactory
  ) {
    var vm = this;
    vm.folderToEdit = false;
    vm.templateUrl = 'views/mailbox/components/configureFolder.html';
    vm.ok = ok;
    vm.home = home;
    vm.open = open;
    vm.cancel = cancel;
    vm.selectedFolder = selectedFolder;
    vm.currentFolder = false;
    vm.setCurrentFolderToEdit = setCurrentFolderToEdit;

    function setCurrentFolderToEdit(folder) {
      configureFolderFactory.setSelectedFolder(folder);
    }

    function validateError() {


      let defer = $q.defer();

      Folder.getFolderPath(vm.folderToEdit.id, function (err, pathUno) {
        Folder.getFolderPath(vm.currentFolder.id, function (err, pathDos) {
          if (vm.currentFolder.id === vm.folderToEdit.id) {

            defer.resolve(false);
            return defer.promise;
          }
          if (vm.currentFolder.folderID === vm.folderToEdit.id) {

            defer.resolve(false);
            return defer.promise;
          }
          if (vm.currentFolder.level === 1) {
            vm.folderToEdit.folderID = vm.currentFolder.id;
            defer.resolve(true);
            return defer.promise;
          }
          // var inChindrenOf = findInChildrens(vm.folderToEdit.id, vm.currentFolder.children);
          // if (inChindrenOf) {
          //   defer.resolve(false);
          //   return defer.promise;
          // }
          if (!pathDos || !pathDos.pathFolderIDs) {
            defer.resolve(true);
            return defer.promise;
          }
          var values = pathDos.pathFolderIDs.split('/');
          for (let i = 0; i < values.length; i++) {
            if (parseInt(values[i]) === pathUno.id) {
              defer.resolve(false);
              return defer.promise;
            }
          }
          vm.folderToEdit.folderID = vm.currentFolder.id;
          defer.resolve(true);
          return defer.promise;

        });
      });

      return defer.promise;

    }




    function ok() {
      if (vm.folderToEdit.name === '') {
        swalFactory.error('Agrega nombre a la carpeta');
        return;
      }
      validateError().then(function (itsOkay) {
        if (itsOkay) {
          Folder.editFolder(vm.folderToEdit, function (err, solve) {
            if (err) {
              swalFactory.error('Ocurrio un error inesperado');
              return;
            }
            vm.cancel();
            swalFactory.success('Se actualizo la carpeta');
          });
        } else {
          swalFactory.error('No puede ser movido a esta carpeta');
        }
      });
    }

    function home() {

      if (vm.folderToEdit.name === '') {
        swalFactory.error('Agrega nombre a la carpeta');
        return;
      }
      vm.folderToEdit.folderID = null;



      Folder.editFolder(vm.folderToEdit, function (err, solve) {
        if (err) {
          swalFactory.error('Ocurrio un error inesperado');
          return;
        }
        swalFactory.success('Se actualizo la carpeta');
      });

    }


    function cancel() {
      $uibModalStack.dismissAll();
    }


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/configureFolderModal.html',
        controller: configureFolderComponentController,
        size: size
      });
    }

    function selectedFolder() {
      vm.currentFolder = externalSelectedFolder.getSelectedFolder() || false;
      return vm.currentFolder;
    }



    _init();

    function _init() {

      let defer = $q.defer();

      externalSelectedFolder.setSelectedFolder(null);
      vm.folderToEdit = configureFolderFactory.getSelectedFolder();

      defer.resolve(vm.selectedFolder);
      return defer.promise;
    }









  }

}());