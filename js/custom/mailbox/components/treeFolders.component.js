(function () {
  'use strict';

  angular.module('app.mailbox').controller('treeFoldersComponentController', treeFoldersComponentController);

  angular.module('app.mailbox').component('treeFoldersComponent', {
    template: '<div ng-include="tfcmp.templateUrl">',
    bindings: {

    },
    controller: treeFoldersComponentController,
    controllerAs: 'tfcmp'

  });


  treeFoldersComponentController.$inject = [

    '$q',
    'ViewDocumentFactory',
    '$uibModal',
    '$uibModalStack',
    'swangular',
    'folderFactory'
  ];

  function treeFoldersComponentController(

    $q,
    ViewDocumentFactory,
    $uibModal,
    $uibModalStack,
    SweetAlert,
    Folder
  ) {
    var vm = this;
    vm.selectedFolder = null;
    vm.tree = null;
    vm.my_tree_handler = my_tree_handler;

    vm.try_adding_a_branch = try_adding_a_branch;


    vm.templateUrl = 'views/mailbox/components/folderTree.html';


    _init();

    function _init() {

      let defer = $q.defer();
      vm.ViewFactory = ViewDocumentFactory;
      vm.ViewFactory.getInbox().then(function (inbox) {
        vm.ViewFactory.getBox().then(function (box) {
          vm.inbox = inbox;
          vm.currentBox = box;
          _getTree().then(function () {
            defer.resolve();
          });
        });


      }, function (err) {
        console.error('Error al obtener el inbox en archiveComponent');
        console.error(err);
        defer.reject(err);
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

      vm.ViewFactory.setSelectedFolder(branch.data);
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



      if (vm.currentBox === 'internalIn') {

        _getInboxRoot().then(function (rootInboxTree) {
          vm.isClean = rootInboxTree.length === 0;


          _setTree(rootInboxTree).then(function () {
            defer.resolve(rootInboxTree);
          });
        });
      } else if (vm.currentBox === 'internalOut') {



        _getOutboxRoot().then(function (rootOutboxTree) {
          vm.isClean = rootOutboxTree.length === 0;
          _setTree(rootOutboxTree).then(function () {
            defer.resolve(rootOutboxTree);
          });
        });
      } else if (vm.currentBox === 'externalIn') {
        _getExternalInboxRoot().then(function (rootInboxTree) {
          vm.isClean = rootInboxTree.length === 0;
          _setTree(rootInboxTree).then(function () {
            defer.resolve(rootInboxTree);
          });
        });
      } else if (vm.currentBox === 'externalOut') {
        _getExternalOutboxRoot().then(function (rootOutboxTree) {
          vm.isClean = rootOutboxTree.length === 0;
          _setTree(rootOutboxTree).then(function () {
            defer.resolve(rootOutboxTree);
          });
        });
      }


      return defer.promise;


    }
  }

}());
