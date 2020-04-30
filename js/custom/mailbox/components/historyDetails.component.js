(function () {
  'use strict';

  angular.module('app.mailbox').
  component('historyDetailsComponent', {
    template: '<div ng-include="hcmp.templateUrl">',
    bindings: {
      document: '=',
    },
    controller: historyDetailsController,
    controllerAs: 'hcmp'

  });



  historyDetailsController.$inject = [
    '$q',
    'ViewDocumentFactory',
    '$rootScope'
  ];



  function historyDetailsController(
    $q,
    ViewDocumentFactory,
    $rootScope
  ) {
    var vm = this;
    vm.templateUrl = 'views/mailbox/components/historyDetails.html';





    _init();

    function _init() {

      let defer = $q.defer();

      vm.ViewFactory = ViewDocumentFactory;

      vm.profile = vm.ViewFactory.getProfile();
      vm.ViewFactory.getCurrentDocumentASYNC().then(function (doc) {
        vm.currentDocument = doc;
      }, function (error) {
        console.error(error);
      });


      return defer.promise;
    }


    $rootScope.$on('watch-reload-view-inbox', function (event, data) {

      _init().then(function () {

      });
    });





  }

}());