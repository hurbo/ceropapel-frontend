/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('MailboxController', MailboxController);

  MailboxController.$inject = ['$state', 'socket', 'profileFactory', 'paginatorFactory'];

  function MailboxController($state, socket, Profile, paginatorFactory) {
    var vm = this;
    activate();

    function activate() {

      if ($state.current.name === 'app.mailbox') {
        $state.go('.internal.in');
      }

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        socket.on('refresh-mailboxCounts-' + vm.profile.email, function (nuevo) {
          paginatorFactory.refreshPage();
        });
        socket.on('refresh-mailboxCounts-' + vm.profile.jobTitleID, function (nuevo) {
          paginatorFactory.refreshPage();
        });


        socket.on('draft-in-' + profile.email, function (nuevo) {
          vm.paginator.refreshPage();
        });

      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });


    }


  }
})();
