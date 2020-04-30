(function () {
  'use strict';

  angular
    .module('app.secretariats')
    .controller('SecretariatsController', SecretariatsController);
  SecretariatsController.$inject = [
    '$state',
    '$rootScope',
    'swalFactory',
    'profileFactory',
    'secretariatsFactory'
  ];

  function SecretariatsController(
    $state,
    $rootScope,
    swalFactory,
    Profile,
    Secretariates
  ) {
    var vm = this;
    vm.showDetails = [];

    vm.changeShowDetails = changeShowDetails;




    active();

    function active() {

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (vm.profile.roleID === 1) {
          swalFactory.error('No puedes acceder al contenido');
          $state.go('app.mailbox.internal.in');
          return;
        } else {
          Secretariates.subscribe().then(function (init) {
            if (!init) {

              $rootScope.$on('refreshSecretariatesView', function () {

                Secretariates.reloadSecretariates(vm.profile, function (err, secretariates) {
                  if (err) {
                    console.error('Error reloadSecretariates', err);
                  } else {
                    vm.secretariats = secretariates;
                  }
                });
              });
            }
            Secretariates.getSecretariates(vm.profile, function (err, secretariates) {
              if (err) {
                console.error('Error getSecretariates', err);
              } else {
                vm.secretariats = secretariates;
              }
            });
          });
        }
      });
    }


    function changeShowDetails(item) {

      if (item) {
        var show = item.showJobTitles ? !item.showDetails : true;

        if (show && !item.jobTitlesSecretariateViewData) {

          item.showJobTitles = true;
          Secretariates.getJobTitlesBySecretariateID(item.id, function (error, jobTitles) {
            if (error) {
              console.error('error: getJobTitlesBySecretariateID', error);
            } else {
              item.jobTitlesSecretariateViewData = jobTitles;
            }
          });
        } else {

          item.showJobTitles = show;
        }
      }

    }
  }
})();
