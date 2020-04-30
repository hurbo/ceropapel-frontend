(function () {
  'use strict';

  angular.module('app.mailbox').controller('multipleDeleteDraftsComponentController', multipleDeleteDraftsComponentController);

  angular.module('app.mailbox').component('multipleDeleteDraftsComponent', {
    template: '<div ng-include="mddcmp.templateUrl">',
    bindings: {
      document: '=',
      needReload: '='
    },
    controller: multipleDeleteDraftsComponentController,
    controllerAs: 'mddcmp'

  });


  multipleDeleteDraftsComponentController.$inject = [
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'paginatorFactory',
    'inboxFactory',
    'socket'
  ];

  function multipleDeleteDraftsComponentController(
    $uibModal,
    $uibModalStack,
    swalFactory,
    paginatorFactory,
    inboxFactory,
    socket
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/mailbox/components/multipleDeleteDraft.html';
    vm.open = open;
    vm.multipleDelete = multipleDelete;
    vm.value = 0;

    vm.haveInboxesMarked = haveInboxesMarked;



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
        templateUrl: 'views/mailbox/components/multipleDeleteDraftModal.html',
        controller: multipleDeleteDraftsComponentController,
        size: size
      });
    }


    function multipleDelete() {

      vm.progressStyle = {
        width: '0%'
      };
      vm.progress = 0;
      vm.isLoading = true;
      var data = {
        channel: new Date().getTime(),
        inboxes: _getDraftsMarked()
      };


      inboxFactory.multipleDelete(data, function (err, solve) {
        socket.on(data.channel, function (value) {
          vm.value = value;
          if (value >= 100) {
            vm.isLoading = false;
            vm.cancel();
            vm.value = 0;
            if (err) {
              swalFactory.error('¡Ha ocurrido un error!');
            } else {
              swalFactory.success('¡Hecho!');
            }
            paginatorFactory.refreshPage();
          }
        });
      });

    }

  }

}());
