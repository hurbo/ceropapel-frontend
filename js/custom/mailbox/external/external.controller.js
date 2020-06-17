(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('ExternalMailboxController', ExternalMailboxController);

  ExternalMailboxController.$inject = ['$state', 'ExternalsFactory', 'swangular'];

  function ExternalMailboxController($state, Externals, SweetAlert) {
    var vm = this;

    activate();

    function activate() {

      Externals.getUsers(function (err, users) {
        console.log('users', users);
        vm.users = users;
        vm.currentUser = Externals.getCurrentUser();
        if (users.length === 0) {
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
    }

  }
})();
