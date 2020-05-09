/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('externalArchivedController', externalArchivedController);

  externalArchivedController.$inject = ['$rootScope', '$state', '$stateParams', 'ExternalsFactory', 'filterFactory', 'paginatorFactory', 'folderFactory', 'profileFactory', 'swangular'];

  function externalArchivedController($rootScope, $state, $stateParams, Externals, filterFactory, paginatorFactory, Folder, Profile, SweetAlert) {
    var vm = this;
    vm.currentUserID = null;
    vm.folder = {
      name: '',
      folderID: null,
      favorite: false
    };
    vm.onRoot = true;
    vm.currentFolder = null;
    vm.filter = filterFactory;
    vm.createFolder = createFolder;

    vm.setCurrentFolder = setCurrentFolder;
    vm.goToRoot = goToRoot;
    vm.changeFavoriteOption = changeFavoriteOption;
    vm.setCurrentFolderByID = setCurrentFolderByID;
    vm.favoriteFolders = [];
    vm.internalFolders = false;
    vm.breadcrumb = [];
    vm.inboxMarked = [];
    vm.folderSelected = null;

    vm.actions = ['Cambiar de lugar', 'Desarchivar'];
    // vm.actions = MAIL_ACTIONS_LIST;






    vm.archiveIn = false;


    vm.getClassCheckMaster = getClassCheckMaster;
    vm.clickCheckboxMaster = clickCheckboxMaster;
    vm.archiveInboxes = archiveInboxes;
    vm.unarchiveInboxes = unarchiveInboxes;

    vm.clickCheckbox = clickCheckbox;
    vm.getClassCheck = getClassCheck;
    vm.changeAction = onChangeAction;

    vm.acceptAction = acceptAction;

    vm.deleteFolder = deleteFolder;
    vm.editFolder = editFolder;
    vm.hasChanged = hasChanged;
    vm.selected = null;

    vm.folderToEdit = null;




    vm.repeatedDocuments = {};
    vm.inboxesIds = [];
    vm.inboxMarked = [];
    vm.canTurnDocs = [];
    vm.selectedTo = [];
    vm.recipients = [];
    vm.documents = [];
    vm.repeateds = [];
    vm.validDocs = [];
    vm.confirmFlags = [];
    vm.inbox = [];
    vm.turnConfirmed = false;
    vm.trackingReason = '';
    vm.turnMessage = '';


    activate();

    function activate() {

      vm.isInbox = null;
      if ($state.current.name.indexOf('app.mailbox.external.archivedOut') !== -1) {
        vm.currentBoss = Externals.getCurrentUser();

        vm.isInbox = false;

        Externals.validatePermision('showOut').then(function (can) {
          vm.havePermissions = can;
          if (can) {

            Profile.getProfile().then(function (profile) {
              vm.profile = profile;
              vm.currentUserID = $state.params.jobTitle;
              $rootScope.app.layout.isCollapsed = true;
              vm.paginator = paginatorFactory;
              _getFavoriteOutFoldersOfBoss();
              _getAllOutFoldersOfBoss();
              if ($stateParams && $stateParams.folder) {

                vm.paginator.init('archivedExternalOutFolder');
                setCurrentFolderByID($stateParams.folder);
              } else {

                vm.paginator.init('externalArchived');
                goToRoot();
                getBreadcrumb();
              }
            }, function (err) {
              console.error('Error addMember on getProfile', err);
            });
          } else {
            SweetAlert.swal({
              title: '¡Error!',
              text: 'No puedes acceder al contenido',
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
            });
          }
        });
      } else {
        vm.currentBoss = Externals.getCurrentUser();

        vm.isInbox = true;

        Externals.validatePermision('showIn').then(function (can) {
          vm.havePermissions = can;
          if (can) {
            Profile.getProfile().then(function (profile) {
              vm.profile = profile;
              vm.currentUserID = $state.params.jobTitle;
              $rootScope.app.layout.isCollapsed = true;
              vm.paginator = paginatorFactory;
              _getFavoriteFoldersOfBoss();
              _getAllFoldersOfBoss();
              if ($stateParams && $stateParams.folder) {

                vm.paginator.init('archivedExternalInFolder');
                setCurrentFolderByID($stateParams.folder);
              } else {

                vm.paginator.init('externalArchived');
                goToRoot();
                getBreadcrumb();
              }
            }, function (err) {
              console.error('Error addMember on getProfile', err);
            });

          } else {
            SweetAlert.swal({
              title: '¡Error!',
              text: 'No puedes acceder al contenido',
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
            });
          }
        });

      }





    }


    function _getFavoriteFoldersOfBoss() {
      Folder.getFavoriteFoldersOfBoss(vm.currentUserID, function (err, solve) {
        vm.favoriteFolders = solve;
      });
    }


    function _getAllFoldersOfBoss() {
      Folder.getAllFoldersOfBoss(vm.currentUserID, function (err, solve) {
        vm.allFolders = solve;
      });
    }





    function _getFavoriteOutFoldersOfBoss() {

      Folder.getFavoriteOutFoldersOfBoss(vm.currentUserID, function (err, solve) {
        vm.favoriteFolders = solve;
      });
    }


    function _getAllOutFoldersOfBoss() {

      Folder.getAllOutFoldersOfBoss(vm.currentUserID, function (err, solve) {
        vm.allFolders = solve;
      });
    }





    function hasChanged() {

      $state.go('app.mailbox.external.archived.folder', {
        jobTitleID: vm.currentUserID,
        folder: vm.selected.id
      });
    }



    function getBreadcrumb() {

      vm.breadcrumb = [{
        name: 'Inicio',
        id: null
      }];
      if (vm.onRoot) return;

      var ids = vm.currentFolder.pathFolderIDs.split('/');
      var names = vm.currentFolder.pathNames.split('/');
      for (let i = 0; i < ids.length; i++) {
        vm.breadcrumb.push({
          name: names[i],
          id: ids[i]
        });

      }
    }


    function changeFavoriteOption(folder) {
      Folder.changeFavoriteOption(folder, function (err, solve) {
        angular.copy(solve, folder);

        SweetAlert.swal({
          title: 'Hecho!',
          text: "Se cambio el estado",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#253846',
          confirmButtonText: 'Aceptar',
          timer: 1000
        });

        return solve;
      });
    }


    function setCurrentFolder(folder) {

      vm.currentFolder = folder;
      Folder.getInfoOfFolder(folder, function (err, solve) {
        vm.filter.folderID = folder.id;

        vm.internalFolders = solve;
        vm.onRoot = false;
        getBreadcrumb();
        vm.paginator.init('externalArchived');
      });
    }

    function setCurrentFolderByID(folderID) {
      if (!folderID) {
        goToRoot();
        getBreadcrumb();
        return;
      }

      Folder.getFolderByID(folderID, function (err, folder) {
        vm.currentFolder = folder;

        setCurrentFolder(folder);
      });
    }

    function goToRoot() {


      vm.filter.folderID = null;
      vm.onRoot = true;
      vm.currentFolder = null;

      if (vm.isInbox) {
        Folder.getRootFoldersOfBoss({}, function (err, solve) {
          vm.internalFolders = solve;
          for (let i = 0; i < vm.internalFolders.length; i++) {
            Folder.getInfoOfFolder(vm.internalFolders[i], function (errdos, solvedos) {
              vm.internalFolders[i]['internalFolders'] = solvedos;
            });
          }




          vm.onRoot = true;
        });
      } else {
        Folder.getRootOutFoldersOfBoss({}, function (err, solve) {

          vm.internalFolders = solve;
          for (let i = 0; i < vm.internalFolders.length; i++) {
            Folder.getInfoOfFolder(vm.internalFolders[i], function (errdos, solvedos) {
              vm.internalFolders[i]['internalFolders'] = solvedos;
            });
          }
          vm.onRoot = true;
        });
      }





      // Folder.getRootFolders({}, function (err, solve) {
      //   vm.internalFolders = solve;

      //   vm.onRoot = true;
      // });
    }



    function createFolder() {
      if (vm.folder.name === '') {

        SweetAlert.swal({
          title: '¡Error!',
          text: 'Agrega nombre a la carpeta',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });

        return;
      }
      if (vm.currentFolder && vm.currentFolder.id) vm.folder.folderID = vm.currentFolder.id;
      Folder.createFolder(vm.folder, function (err, solve) {
        if (err) {

          SweetAlert.swal({
            title: '¡Error!',
            text: 'Ocurrio un error inesperado',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });

          return;
        }
        if (vm.onRoot) {
          goToRoot();
        } else {
          setCurrentFolderByID(vm.currentFolder.id);
        }
        document.getElementById('closeModalCreateFolder').click();

        SweetAlert.swal({
          title: 'Hecho!',
          text: 'Se agrego nueva carpeta',
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#253846',
          confirmButtonText: 'Aceptar',
          timer: 1000
        });
        vm.folder.name = '';
      });
    }


    function editFolder() {
      if (vm.folderToEdit.name === '') {

        SweetAlert.swal({
          title: '¡Error!',
          text: 'Agrega nombre a la carpeta',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });

        return;
      }

      Folder.editFolder(vm.folderToEdit, function (err, solve) {
        if (err) {

          SweetAlert.swal({
            title: '¡Error!',
            text: 'Ocurrio un error inesperado',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });

          return;
        }

        if (vm.onRoot) {
          goToRoot();
        } else {
          setCurrentFolderByID(vm.currentFolder.id);
        }
        document.getElementById('closeModalEditFolder').click();

        SweetAlert.swal({
          title: 'Hecho!',
          text: 'Se actualizo la carpeta',
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#253846',
          confirmButtonText: 'Aceptar',
          timer: 1000
        });
      });
    }




    function deleteFolder() {

      Folder.deleteFolder(vm.folderToEdit, function (err, solve) {
        if (err) {

          SweetAlert.swal({
            title: '¡Error!',
            text: 'Ocurrio un error inesperado',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });

          return;
        }


        if (vm.onRoot) {
          goToRoot();
        } else {
          setCurrentFolderByID(vm.currentFolder.id);
        }

      });
    }





    function archiveInboxes() {
      if (vm.inboxMarked) {
        var inboxes = [];
        for (var i = 0; i < vm.inboxMarked.length; i++) {
          inboxes.push(vm.inboxMarked[i].id);
        }
        var data = {
          inboxes: inboxes,
          folder: vm.folderSelected
        };

        Folder.archiveInboxes(data, function (err, inbox) {
          if (err) {

            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });

          }
          if (inbox) {
            vm.paginator.refreshPage();
          }
        });
      }
    }

    function unarchiveInboxes() {
      if (vm.inboxMarked) {
        var inboxes = [];
        for (var i = 0; i < vm.inboxMarked.length; i++) {
          inboxes.push(vm.inboxMarked[i].id);
        }
        var data = {
          inboxes: inboxes
        };

        Folder.unarchiveInboxes(data, function (err, inbox) {
          if (err) {

            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });

          }
          if (inbox) {
            vm.paginator.refreshPage();
          }
        });
      }
    }




    function acceptAction() {
      vm.changeAction();
    }








    function getClassCheck(indexInbox) {
      if (vm.inboxMarked.indexOf(vm.inbox[indexInbox]) >= 0) {
        return 'checked all';
      }
      return '';
    }

    function getClassCheckMaster(items) {
      vm.inbox = items;
      var imrCount = vm.inboxMarked.length;
      var iCount = vm.inbox.length;
      if (imrCount === iCount) {
        return 'checked all';
      } else if (imrCount < iCount && imrCount > 0) {
        return 'checked middle'
      } else {
        return '';
      }
    }

    function clickCheckbox(indexInbox) {

      var index = vm.inboxMarked.indexOf(vm.inbox[indexInbox]);
      if (index >= 0) {
        vm.inboxMarked.splice(index, 1);
      } else {
        vm.inboxMarked.push(vm.inbox[indexInbox]);
      }
    }



    function clickCheckboxMaster() {
      var imrCount = vm.inboxMarked.length;
      var iCount = vm.inbox.length;
      vm.inboxMarked = [];
      if (imrCount !== iCount) {
        for (var i = 0; i < vm.inbox.length; i++) {
          vm.inboxMarked.push(vm.inbox[i]);
        }
      }
    }

    function onChangeAction() {
      if (vm.inboxMarked.length === 0) {

        SweetAlert.swal({
          title: '¡Error!',
          text: 'Es necesario que selecciones al menos un elemento',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });

        return;
      }
      if (!vm.action) {

        SweetAlert.swal({
          title: '¡Error!',
          text: 'Debe seleccionar la acción que desea realizar',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });

        return;
      }



      switch (vm.action) {

        case 'Desarchivar': {
          var unarchiveModal = angular.element('#unarchiveModal');
          unarchiveModal.modal('show');
          break;
        }
        case 'Cambiar de lugar': {
          vm.archiveIn = false;
          vm.folderSelected = null;
          var archiveModal = angular.element('#archiveModal');
          archiveModal.modal('show');
          break;
        }

      }
    }







  }
})();
