/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

(function () {
  'use strict';

  angular.module('app.mailbox').controller('inboxController', inboxController);

  inboxController.$inject = [
    '$rootScope',
    'paginatorFactory',
    'filterFactory',
    'profileFactory'
  ];

  function inboxController(
    $rootScope,
    paginatorFactory,
    filterFactory,
    Profile
  ) {
    var vm = this;

    vm.clickCheckboxMaster = clickCheckboxMaster;
    vm.selectedAll = selectedAll;
    vm.haveInboxesMarked = haveInboxesMarked;
    vm.filter = filterFactory;
    vm.areSelectedAll = false;
    vm.isLoading = false;


    function haveInboxesMarked() {
      for (let i = 0; i < vm.paginator.items.length; i++) {
        var element = vm.paginator.items[i];
        if (element.selected === true) {
          return true;
        }
      }
      return false;
    }



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






    function clickCheckboxMaster() {
      var selectedCount = 0;
      for (let i = 0; i < vm.paginator.items.length; i++) {
        var element = vm.paginator.items[i];
        if (element.selected === true) {
          selectedCount++;
        }
      }
      if (selectedCount === vm.paginator.items.length) {
        _deselectAll();
      } else {
        _selectAll();
      }
    }


    function _deselectAll() {
      for (let i = 0; i < vm.paginator.items.length; i++) {
        vm.paginator.items[i].selected = false;
      }
    }

    function _selectAll() {
      for (let i = 0; i < vm.paginator.items.length; i++) {
        vm.paginator.items[i].selected = true;
      }
    }

    activate();


    function activate() {
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        vm.paginator = paginatorFactory;
        vm.paginator.init('inbox');
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });
      $rootScope.app.layout.isCollapsed = true;
    }

  }
})();
