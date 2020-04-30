(function () {
  'use strict';

  angular.module('app.mailbox').controller('multipleSendDraftsComponentController', multipleSendDraftsComponentController);

  angular.module('app.mailbox').component('multipleSendDraftsComponent', {
    template: '<div ng-include="msdcmp.templateUrl">',
    bindings: {
      document: '=',
      needReload: '='
    },
    controller: multipleSendDraftsComponentController,
    controllerAs: 'msdcmp'

  });


  multipleSendDraftsComponentController.$inject = [
    '$q',
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'paginatorFactory',
    'inboxFactory'
  ];

  function multipleSendDraftsComponentController(
    $q,
    $uibModal,
    $uibModalStack,
    swalFactory,
    paginatorFactory,
    inboxFactory
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/mailbox/components/multipleSendDraft.html';
    vm.open = open;
    vm.haveInboxesMarked = haveInboxesMarked;
    vm.ok = ok;
    vm.value = 0;



    function haveInboxesMarked() {
      for (let i = 0; i < paginatorFactory.items.length; i++) {
        var element = paginatorFactory.items[i];
        if (element.selected === true) {
          return true;
        }
      }
      return false;
    }


    function _getDraftsMarked() {
      var drafts = [];
      for (let i = 0; i < paginatorFactory.items.length; i++) {
        var element = paginatorFactory.items[i];
        if (element.selected === true) {
          drafts.push(element);
        }
      }
      return drafts;
    }


    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/multipleSendDraftModal.html',
        controller: multipleSendDraftsComponentController,
        size: size
      });
    }



    function ok() {
      vm.isLoading = true;
      vm.value = 0;
      if (!vm.password) {
        swalFactory.error('Ingresa contraseña');
        vm.isLoading = false;
        return;
      }
      var data = {
        password: vm.password,
        channel: new Date().getTime(),
        inboxes: _getDraftsMarked()
      };

      inboxFactory.validatePassword(data, function (err, solve) {
        if (err) {
          vm.isLoading = false;
          swalFactory.error(err.message);
          return;
        }
        inboxFactory.multipleSendDocumentsByDrafts(data, function (err, solve) {

          swalFactory.success('!Hecho¡');
          vm.cancel();
        });
      });
    }



  }

}());