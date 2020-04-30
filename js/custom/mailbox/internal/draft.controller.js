/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('newDraftController', newDraftController);

  newDraftController.$inject = [
    '$rootScope',
    'paginatorFactory',
    'filterFactory',
    'profileFactory',
    'socket',
    'swalFactory',
    'inboxFactory'
  ];

  function newDraftController(
    $rootScope,
    paginatorFactory,
    filterFactory,
    Profile,
    socket,
    swalFactory,
    inboxFactory
  ) {
    var vm = this;
    vm.filter = filterFactory;
    vm.folder = 'drafts';
    vm.hidePaginate = false;

    vm.areSelectedAll = false;


    vm.inboxMarked = [];
    vm.multipleDelete = multipleDelete;
    vm.isLoading = false;
    vm.actions = ['Borrar'];
    vm.action = null;
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

    activate();

    function activate() {

      $rootScope.app.layout.isCollapsed = true;
      vm.paginator = paginatorFactory;
      vm.paginator.init('drafts');
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;

      }, function (err) {
        console.error('Error addMember on getProfile', err);
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
        inboxes: vm.inboxMarked
      };


      angular.element('#closeModalDeleteModalButton').click();
      inboxFactory.multipleDelete(data, function (err, solve) {
        var progressModal = angular.element('#signProgresModal');
        progressModal.modal('show');
        socket.on(data.channel, function (progress) {
          if (progress >= 100) {
            vm.isLoading = false;
            vm.progressStyle = {
              width: '0%'
            };
            vm.progress = 0;
            progressModal.modal('hide');
            swalFactory.success('¡Hecho!');
            vm.paginator.refreshPage();
          }
          vm.progress = progress;
          vm.progressStyle = {
            width: vm.progress + '%'
          };
        });

      });

    }






  }
})();
