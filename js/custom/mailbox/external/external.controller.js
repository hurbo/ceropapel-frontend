(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('ExternalMailboxController', ExternalMailboxController);

  ExternalMailboxController.$inject = ['$state', 'ExternalsFactory', 'swangular', 'profileFactory'];

  function ExternalMailboxController($state, Externals, SweetAlert, Profile) {
    var vm = this;

    activate();

    function activate() {
      console.log(1)
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        console.log('external controller canEnterOnExternal');
        Externals.canEnterOnExternal(profile, (err,permissions) => {
          console.log('permissions', permissions);
          console.log('err',err);
          if(permissions.length > 0){
            console.log('Si s epuede', permissions);

            Externals.getUsers(function (err, users) {
              console.log('saijdlajkdlsakd', users);
              vm.users = users;
              vm.currentUser = Externals.getCurrentUser();
              console.log('vm.currentUser', vm.currentUser);
              console.log('vm.profile', vm.profile);
              if(vm.profile.permissions <= 0){
                console.log('reload completo chsm');
                window.location.reload();
                // $state.reload();
              }
            });
          } else {
            SweetAlert.swal({
              title: '¡Error!',
              text: 'No han compartido oficios contigo',
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar'
            });
            $state.go('app.mailbox.internal.in');
            return;
          }
        });
      });



    }

  }
})();
