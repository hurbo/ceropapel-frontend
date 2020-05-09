(function () {
  'use strict';

  angular
    .module('app.canceledDocuments')
    .controller(
      'secretariateCanceledDocsController',
      secretariateCanceledDocsController
    );
  secretariateCanceledDocsController.$inject = [
    '$state',
    'CanceledDocuments',
    'profileFactory',
    'swangular'
  ];

  function secretariateCanceledDocsController(
    $state,
    CanceledDocuments,
    Profile,
    SweetAlert
  ) {
    var vm = this;

    active();

    function active() {
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (vm.profile.roleID === 1) {

          SweetAlert.swal({
            title: '¡Error!',
            text: 'No puedes acceder al contenido',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });
          console.error('111');
          $state.go('app.mailbox.internal.in');
          return;
        } else if (vm.profile.roleID === 2 && !profile.jobTitleID) {

          SweetAlert.swal({
            title: '¡Error!',
            text: 'No puedes acceder al contenido',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });
          console.error('2222');
          $state.go('app.secretariateCanceledDocuments', {
            id: profile.jobTitleID
          });
          return;
        }

      }, function (err) {
        console.error('Error active secretariate controller on getProfile', err);
      });








      CanceledDocuments.getDeleteDocumentsBySecretariateID({
          id: $state.params.id
        },
        function (err, docs) {

          vm.items = docs;
        }
      );

      // vm.paginator = paginatorFactory;
      // vm.paginator.setConfig('getCanceledDocumentsOfSecretariate', {
      //   secretariate: $state.params.id
      // });
      // vm.paginator.init();
    }
  }
})();
