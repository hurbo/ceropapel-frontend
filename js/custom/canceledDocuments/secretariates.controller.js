(function () {
  'use strict';

  angular
    .module('app.canceledDocuments')
    .controller(
      'secretariatesCanceledDocsController',
      secretariatesCanceledDocsController
    );
  secretariatesCanceledDocsController.$inject = [
    'swangular',
    'CanceledDocuments',
    'profileFactory',
    '$state'
  ];

  function secretariatesCanceledDocsController(
    SweetAlert,
    CanceledDocuments,
    Profile,
    $state
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

          $state.go('app.mailbox.internal.in');
          return;
        } else if (vm.profile.roleID === 2) {
          $state.go('app.secretariateCanceledDocuments', {
            id: profile.jobTitleID
          });
          return;
        } else {
          CanceledDocuments.getSecretariates(null, function (err, secretariates) {
            vm.secretariates = secretariates;
          });
        }

      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });






    }
  }
})();
