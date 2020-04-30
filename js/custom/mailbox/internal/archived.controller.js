/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('archivedController', archivedController);

  archivedController.$inject = [
    '$stateParams',
    '$state',
    '$rootScope',
    'mailboxFactory',
    'paginatorFactory',
    'filterFactory',
    'folderFactory',
    'swalFactory',
    'MAIL_ACTIONS_LIST',
    'ExternalsFactory',
    'profileFactory',
    'inboxFactory',
    'configureFolderFactory'
  ];


  function archivedController(
    $stateParams,
    $state,
    $rootScope,
    mailboxFactory,
    paginatorFactory,
    filterFactory,
    Folder,
    swalFactory,
    MAIL_ACTIONS_LIST,
    Externals,
    Profile,
    inboxFactory,
    configureFolderFactory
  ) {


    var vm = this;
    vm.folder = {
      name: '',
      folderID: null,
      favorite: false
    };
    vm.onRoot = true;
    vm.currentFolder = null;
    vm.filter = filterFactory;

    vm.setCurrentFolder = setCurrentFolder;
    vm.goToRoot = goToRoot;
    vm.changeFavoriteOption = changeFavoriteOption;
    vm.setCurrentFolderByID = setCurrentFolderByID;
    vm.favoriteFolders = [];
    vm.internalFolders = false;
    vm.breadcrumb = [];
    vm.inboxMarked = [];
    vm.folderSelected = null;
    vm.isFilter = isFilter;

    vm.actions = ['Cambiar de lugar', 'Desarchivar'];

    vm.areSelectedAll = false;
    vm.selectedAll = selectedAll;

    function selectedAll() {

      if (vm.areSelectedAll) {
        for (let i = 0; i < vm.paginator.items.length; i++) {

          vm.paginator.items[i].selected = false;
          vm.areSelectedAll = false;

        }
      } else {
        for (let i = 0; i < vm.paginator.items.length; i++) {

          vm.paginator.items[i].selected = true;
          vm.areSelectedAll = true;

        }
      }
    }





    function isFilter() {
      return $state.current.name.indexOf('filter') !== -1;
    }




    vm.archiveIn = false;



    vm.archiveInboxes = archiveInboxes;
    vm.unarchiveInboxes = unarchiveInboxes;



    vm.changeAction = onChangeAction;

    vm.acceptAction = acceptAction;

    vm.deleteFolder = deleteFolder;

    vm.hasChanged = hasChanged;
    vm.selected = null;

    vm.folderToEdit = null;




    vm.repeatedDocuments = {};
    vm.documentsIds = [];
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


      configureFolderFactory.setSelectedFolder(null);
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (!vm.profile.jobTitleID) {
          swalFactory.error('No puedes acceder al contenido');
          $state.go('app.mailbox.internal.in');
          return;
        } else {

          $rootScope.app.layout.isCollapsed = true;
          vm.paginator = paginatorFactory;
          _getFavoriteFolders();
          _getAllFolders();
          if ($stateParams && $stateParams.folder) {
            vm.paginator.init('archivedInFolder');
            setCurrentFolderByID($stateParams.folder);

          } else {
            vm.paginator.init('archivedInFolder');
            goToRoot();
            getBreadcrumb();
          }
        }
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });
    }




    function hasChanged() {

      $state.go('app.mailbox.internal.archived.folder', {
        folder: vm.selected.id
      });
    }


    function unarchiveInboxes() {
      if (vm.inboxMarked) {
        var inboxes = [];
        for (var i = 0; i < vm.inboxMarked.length; i++) {
          inboxes.push(vm.inboxMarked[i].id);
        }
        var data = {
          inboxes: inboxes,
          profile: vm.profile,
          itsInbox: 1
        };

        Folder.unarchiveInboxes(data, function (err, inbox) {
          if (err) {
            return swalFactory.error(err.message);
          }
          if (inbox) {
            vm.paginator.refreshPage();
          }
        });
      }
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

    function _getAllFolders() {
      Folder.getAllFolders({}, function (err, solve) {
        vm.allFolders = solve;
      });
    }

    function _getFavoriteFolders() {
      Folder.getFavoriteFolders({}, function (err, solve) {
        vm.favoriteFolders = solve;
      });
    }

    function changeFavoriteOption(folder) {
      Folder.changeFavoriteOption(folder, function (err, solve) {
        angular.copy(solve, folder);
        swalFactory.success('Se cambio el estado');
        _getFavoriteFolders();
        return solve;
      });
    }


    function setCurrentFolder(folder) {

      vm.currentFolder = folder;
      configureFolderFactory.setSelectedFolder(vm.currentFolder);
      Folder.getInfoOfFolder(folder, function (err, solve) {
        vm.filter.folderID = folder.id;

        vm.internalFolders = solve;
        for (let i = 0; i < vm.internalFolders.length; i++) {
          Folder.getInfoOfFolder(vm.internalFolders[i], function (errdos, solvedos) {
            vm.internalFolders[i]['internalFolders'] = solvedos;
          });
        }
        vm.onRoot = false;
        getBreadcrumb();
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
      Folder.getRootFolders({}, function (err, solve) {
        vm.internalFolders = solve;
        for (let i = 0; i < vm.internalFolders.length; i++) {
          Folder.getInfoOfFolder(vm.internalFolders[i], function (errdos, solvedos) {
            vm.internalFolders[i]['internalFolders'] = solvedos;
          });
        }
        vm.onRoot = true;
      });
    }









    function deleteFolder() {

      Folder.deleteFolder(vm.folderToEdit, function (err, solve) {
        if (err) {
          swalFactory.error('Ocurrio un error inesperado');
          return;
        }
        _getFavoriteFolders();
        _getAllFolders();
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
            return swalFactory.error(err.message);
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








    function onChangeAction() {
      if (vm.inboxMarked.length === 0) {
        swalFactory.error('Es necesario que selecciones al menos un elemento');
        return;
      }
      if (!vm.action) {
        swalFactory.error('Debe seleccionar la acción que desea realizar');
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
