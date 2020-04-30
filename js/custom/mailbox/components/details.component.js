(function () {
  'use strict';

  angular.
  module('app.mailbox').
  component('detailsComponent', {
    template: '<div ng-include="dcmp.templateUrl">',
    bindings: {
      document: '=',
    },
    controller: detailsComponentController,
    controllerAs: 'dcmp'

  });



  detailsComponentController.$inject = [
    '$q',
    'ViewDocumentFactory',
    '$rootScope'
  ];



  function detailsComponentController(
    $q,
    ViewDocumentFactory,
    $rootScope
  ) {
    var vm = this;
    vm.itsOutbox = null;
    vm.templateUrl = 'views/mailbox/components/details.html';

    vm.totalRequireSign = 0;
    vm.signsCount = 0;
    vm.readCount = 0;




    _init();

    function _init() {

      let defer = $q.defer();
      vm.ViewFactory = ViewDocumentFactory;
      vm.profile = vm.ViewFactory.getProfile();
      vm.currentDocument = vm.ViewFactory.getDocument();
      vm.ViewFactory.getInbox().then(function (inbox) {
        vm.inbox = inbox;
        vm.itsOutbox = inbox.itsOutbox;
        vm.fallUpon = inbox.fallUpon;
        vm.ViewFactory.getInvolveds().then(function (Involveds) {
          vm.currentInvolveds = Involveds;
          vm.haveTurnedInboxes = false;
          vm.totalRequireSign = 0;
          vm.signsCount = 0;
          vm.readCount = 0;
          for (let i = 0; i < vm.currentInvolveds.length; i++) {
            var e = vm.currentInvolveds[i];
            if (e.isTurned === 1) {
              vm.haveTurnedInboxes = true;
            }
            if (e.needSign) {
              vm.totalRequireSign++;
              if (e.hash) {
                vm.signsCount++;
              }
            }
            if (e.isRead === 1) {
              vm.readCount++;
            }
          }
          defer.resolve();
        }, function (err) {
          console.error('Error al obtener currentInvolveds en _init DetailsComponent');
          console.error(err);
        });

      }, function (err) {
        console.error('Error al obtener el inbox en archiveComponent');
        console.error(err);
      });


      return defer.promise;
    }


    $rootScope.$on('watch-reload-view-inbox', function (event, data) {

      _init().then(function () {

      });
    });

  }

}());