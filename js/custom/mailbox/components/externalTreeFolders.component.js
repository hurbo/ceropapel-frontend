(function () {
  'use strict';

  angular.module('app.mailbox').controller('externalTreeFoldersComponentController', externalTreeFoldersComponentController);

  angular.module('app.mailbox').component('externalTreeFoldersComponent', {
    template: '<div ng-include="etfcmp.templateUrl">',
    bindings: {

    },
    controller: externalTreeFoldersComponentController,
    controllerAs: 'etfcmp'

  });


  externalTreeFoldersComponentController.$inject = [
    '$q',
    'folderFactory',
    'externalSelectedFolder',
    'configureFolderFactory',
    '$state'
  ];

  function externalTreeFoldersComponentController(

    $q,
    Folder,
    externalSelectedFolder,
    configureFolderFactory,
    $state
  ) {
    var vm = this;
    vm.externalSelectedFolder = externalSelectedFolder;
    vm.selectedFolder = null;
    vm.tree = null;
    vm.my_tree_handler = my_tree_handler;

    vm.try_adding_a_branch = try_adding_a_branch;


    vm.templateUrl = 'views/mailbox/components/externalFolderTree.html';


    _init();

    function _init() {

      let defer = $q.defer();

      _getTree().then(function () {

        defer.resolve();
      });




      return defer.promise;
    }


    function _getOutboxRoot() {
      let defer = $q.defer();
      Folder.getRootTreeFoldersOut(null, function (err, solve) {


        defer.resolve(solve);
      });
      return defer.promise;
    }

    function _getInboxRoot() {
      let defer = $q.defer();
      Folder.getRootTreeFolders(null, function (err, solve) {

        defer.resolve(solve);
      });
      return defer.promise;

    }

    function _getExternalInboxRoot() {
      let defer = $q.defer();
      Folder.getRootBossTreeFolders(null, function (err, solve) {
        defer.resolve(solve);
      });
      return defer.promise;

    }



    function _getExternalOutboxRoot() {
      let defer = $q.defer();
      Folder.getRootBossTreeFoldersOut(null, function (err, solve) {
        defer.resolve(solve);
      });
      return defer.promise;

    }

    function _setTree(treedata_avm) {
      let defer = $q.defer();
      vm.my_data = treedata_avm;


      vm.count = 0;
      // This is our API control variable
      vm.my_tree = vm.tree = {};
      vm.try_adding_a_branch = function (branch) {

        var b;
        b = vm.tree.get_selected_branch();
        vm.count++;
        return vm.tree.add_branch(b, {
          label: 'Internal folder ' + vm.count,
          data: {
            haveChildrens: false
          }
        });
      };
      defer.resolve();

      return defer.promise;
    }

    function my_tree_handler(branch) {

      vm.externalSelectedFolder.setSelectedFolder(branch);
      vm.selectedFolder = branch;
    }




    function try_adding_a_branch(branch) {

      var b;
      b = vm.tree.get_selected_branch();
      vm.count++;
      return vm.tree.add_branch(b, {
        label: 'Internal folder ' + vm.count,
        data: {
          haveChildrens: false
        }
      });
    }

    function _getTree() {
      let defer = $q.defer();


      if ($state.current.name.indexOf('app.mailbox.external.archivedOut') !== -1 || $state.current.name.indexOf('app.mailbox.external.out') !== -1) {

        _getExternalOutboxRoot().then(function (rootOutboxTree) {
          vm.isClean = rootOutboxTree.length === 0;
          _setTree(rootOutboxTree).then(function () {
            defer.resolve(rootOutboxTree);
          });
        });
      } else if ($state.current.name.indexOf('app.mailbox.external.archived.folder') !== -1 || $state.current.name.indexOf('app.mailbox.external.archivedIn') !== -1 || $state.current.name.indexOf('app.mailbox.external.in') !== -1) {
        _getExternalInboxRoot().then(function (rootInboxTree) {
          vm.isClean = rootInboxTree.length === 0;
          _setTree(rootInboxTree).then(function () {
            defer.resolve(rootInboxTree);
          });
        });
      } else if ($state.current.name.indexOf('app.mailbox.internal.archivedOut') !== -1 || $state.current.name.indexOf('app.mailbox.internal.out') !== -1) {
        _getOutboxRoot().then(function (rootOutboxTree) {
          vm.isClean = rootOutboxTree.length === 0;
          _setTree(rootOutboxTree).then(function () {
            defer.resolve(rootOutboxTree);
          });
        });
      } else if ($state.current.name.indexOf('app.mailbox.internal.archived.folder') !== -1 || $state.current.name.indexOf('app.mailbox.internal.archivedIn') !== -1 || $state.current.name.indexOf('app.mailbox.internal.in') !== -1) {


        _getInboxRoot().then(function (rootInboxTree) {
          vm.isClean = rootInboxTree.length === 0;
          _setTree(rootInboxTree).then(function () {
            defer.resolve(rootInboxTree);
          });
        });
      } else {
        console.log("$state.current.name", $state.current.name);
        alert('Error reportar error numero 9090');
      }




      return defer.promise;
    }
  }

}());
