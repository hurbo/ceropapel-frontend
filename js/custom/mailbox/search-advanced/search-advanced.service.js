// A RESTful factory for retrieving mails from json file

(function () {
  'use strict';

  angular.module('app.mailbox').service('searchAdvanced', search);

  search.$inject = ['$state', 'profileFactory'];

  function search($state, profileFactory) {
    return {
      goTo: goTo
    };

    function goTo(mail) {
      profileFactory.getProfile().then(function (profile) {
        if (mail.fromJT === profile.jobTitleID) {
          $state.go('app.mailbox.internal.out.view', {
            mid: mail.documentID,
            inboxID: mail.id
          });
        }
        if (mail.toJT === profile.jobTitleID) {
          $state.go('app.mailbox.internal.in.view', {
            mid: mail.documentID,
            inboxID: mail.id
          });
        }
        for (let i = 0; i < profile.permissions.length; i++) {
          var bossJT = profile.permissions[i].bossJobTitleID;
          if (mail.fromJT === bossJT) {
            $state.go('app.mailbox.external.out.view', {
              mid: mail.documentID,
              inboxID: mail.id
            });
          } else if (mail.toJT === bossJT) {
            $state.go('app.mailbox.external.out.view', {
              mid: mail.documentID,
              inboxID: mail.id
            });
          }
        }
      });

    }
  }
})();