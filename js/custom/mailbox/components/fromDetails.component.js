angular.
module('app.mailbox').
component('fromDetailsComponent', {
  template: '<div ng-include="fdcmp.templateUrl">',
  bindings: {
    document: '=',
  },
  controller: fromDetailsComponentController,
  controllerAs: 'fdcmp'

});



fromDetailsComponentController.$inject = [
  '$q',
  'ViewDocumentFactory'
];



function fromDetailsComponentController(
  $q,
  ViewDocumentFactory
) {
  var vm = this;
  vm.templateUrl = 'views/mailbox/components/fromDetails.html';

  vm.profile = null;
  vm.currentDocument = null;
  vm.currentInvolveds = null;
  vm.currentInbox = null;



  _init();

  function _init(DOC) {

    let defer = $q.defer();



    vm.ViewFactory = ViewDocumentFactory;

    vm.profile = vm.ViewFactory.getProfile();
    vm.currentDocument = vm.ViewFactory.getDocument();


    vm.ViewFactory.getInvolveds().then(function (Involveds) {
      vm.currentInvolveds = Involveds;

      vm.totalRequireSign = 0;
      vm.signsCount = 0;
      vm.readCount = 0;
      for (let i = 0; i < vm.currentInvolveds.length; i++) {
        var e = vm.currentInvolveds[i];

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

    return defer.promise;
  }





}