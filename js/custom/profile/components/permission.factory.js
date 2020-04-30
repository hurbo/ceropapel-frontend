(function () {
  'use strict';

  angular
    .module('app.profile')
    .factory('permissionFactory', permissionFactory);

  permissionFactory.$inject = [
    'profileFactory'
  ];


  function permissionFactory(profileFactory) {


    var currentUser = null;
    var currentProfile = null;

    return {
      setUser: setUser,
      getUser: getUser
    };



    function getUser() {
      if (currentUser) {
        profileFactory.getProfile().then(function (profile) {
          currentProfile = profile;
          for (let i = 0; i < currentUser.permissions.length; i++) {
            var permissionsUser = currentUser.permissions[i];
            if (currentProfile.jobTitleID === permissionsUser.bossJobTitleID) {
              currentUser.permissions.readIn = currentUser.permissions.readIn === 1;
              currentUser.permissions.readOut = currentUser.permissions.readOut === 1;
              currentUser.permissions.readTurned = currentUser.permissions.readTurned === 1;
              currentUser.permissions.sign = currentUser.permissions.sign === 1;
              currentUser.permissions.reject = currentUser.permissions.reject === 1;
              currentUser.permissions.changeStatus = currentUser.permissions.changeStatus === 1;
              currentUser.permissions.turn = currentUser.permissions.turn === 1;
              currentUser.permissions.showIn = currentUser.permissions.showIn === 1;
              currentUser.permissions.showOut = currentUser.permissions.showOut === 1;

              currentUser.permissions.createFolders = currentUser.permissions.createFolders === 1;
              currentUser.permissions.archiveInboxes = currentUser.permissions.archiveInboxes === 1;
            }
          }
        });
      }

      return currentUser;
    }

    function setUser(user) {
      profileFactory.getProfile().then(function (profile) {
        currentProfile = profile;
        currentUser = user;
        var found = false;
        for (let i = 0; i < currentUser.permissions.length; i++) {
          var permissionsUser = currentUser.permissions[i];

          if (currentProfile.jobTitleID === permissionsUser.bossJobTitleID) {
            found = true;
            currentUser.permissions = permissionsUser;
            currentUser.permissions.readIn = currentUser.permissions.readIn === 1;
            currentUser.permissions.readOut = currentUser.permissions.readOut === 1;
            currentUser.permissions.readTurned = currentUser.permissions.readTurned === 1;
            currentUser.permissions.sign = currentUser.permissions.sign === 1;
            currentUser.permissions.reject = currentUser.permissions.reject === 1;
            currentUser.permissions.changeStatus = currentUser.permissions.changeStatus === 1;
            currentUser.permissions.turn = currentUser.permissions.turn === 1;
            currentUser.permissions.showIn = currentUser.permissions.showIn === 1;
            currentUser.permissions.showOut = currentUser.permissions.showOut === 1;

            currentUser.permissions.createFolders = currentUser.permissions.createFolders === 1;
            currentUser.permissions.archiveInboxes = currentUser.permissions.archiveInboxes === 1;
          }
        }
        if (!found) {
          currentUser.permissions = {
            readIn: false,
            readOut: false,
            readTurned: false,
            sign: false,
            reject: false,
            changeStatus: false,
            turn: false,
            showIn: false,
            showOut: false,

            createFolders: false,
            archiveInboxes: false
          };
        }
        return currentUser;

      });


    }
  }

}());