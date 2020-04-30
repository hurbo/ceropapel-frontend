(function () {
  'use strict';
  angular.module('app.mailbox').controller('createFolderComponentController', createFolderComponentController);
  angular.module('app.mailbox').component('createFolderComponent', {
    template: '<div ng-include="cfcmp.templateUrl">',
    bindings: {
      folder: '='
    },
    controller: createFolderComponentController,
    controllerAs: 'cfcmp'
  });

  createFolderComponentController.$inject = [
    '$rootScope',
    '$q',
    '$state',
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'folderFactory',
    'externalSelectedFolder',
    'configureFolderFactory',
    'ExternalsFactory',
    'profileFactory'
  ];

  function createFolderComponentController(
    $rootScope,
    $q,
    $state,
    $uibModal,
    $uibModalStack,
    swalFactory,
    Folder,
    externalSelectedFolder,
    configureFolderFactory,
    Externals,
    Profile
  ) {
    var vm = this;
    vm.currentFolder = false;
    vm.templateUrl = 'views/mailbox/components/createFolder.html';
    vm.ok = ok;
    vm.open = open;
    vm.cancel = cancel;
    vm.currentFolder = false;

    function ok() {

      if (vm.folder.name === '') {
        swalFactory.error('Agrega nombre a la carpeta');
        return;
      }

      var data = {
        name: vm.folder.name,
        favorite: 0,
        itsInbox: vm.itsInbox,
        authorID: vm.internal ? vm.profile.id : vm.currentBoss.id,
        jobTitleID: vm.internal ? vm.profile.jobTitleID : vm.currentBoss.jobTitleID,
        folderID: $state.params.folder ? parseInt($state.params.folder) : null
      };


      Folder.createFolder(data, function (err, solve) {
        if (err) {
          swalFactory.error('Ocurrio un error inesperado');
          return;
        } else {

          $state.go($state.current.name, {
            folder: solve
          });

          vm.cancel();
          swalFactory.success('Se agrego carpeta');
        }

      });
    }



    function cancel() {
      $uibModalStack.dismissAll();
    }

    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/createFolderModal.html',
        controller: createFolderComponentController,
        size: size
      });
    }

    _init();

    function _init() {

      let defer = $q.defer();
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        _activate();
        defer.resolve(vm.currentFolder);
      });

      return defer.promise;
    }


    function _activate() {

      if ($state.current.name.indexOf('app.mailbox.internal') !== -1) {
        vm.active = true;
        vm.internal = true;
        if ($state.current.name.indexOf('archivedOut') !== -1) {
          vm.itsInbox = false;
        } else {
          vm.itsInbox = true;
        }
      } else {
        Externals.validatePermision('createFolders').then(function (can) {
          if (can) {
            vm.active = true;
            vm.currentBoss = Externals.getCurrentUser();
            vm.internal = false;
            if ($state.current.name.indexOf('archivedOut') !== -1) {
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
  }

}());