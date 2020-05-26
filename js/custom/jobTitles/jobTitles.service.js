(function () {
  'use strict';

  angular.module('app.jobTitles').factory('JobTitles', JobTitles);

  JobTitles.$inject = ['socket', '$rootScope', 'profileFactory'];

  function JobTitles(socket, $rootScope, Profile) {
    var secretariates = false;
    var secretariatesGroup = false;


    $rootScope.$on('reloadSecretariatesView', function () {

      Profile.getProfile().then(function (profile) {
        reloadSecretariates(profile, function (err, data) {

          secretariates = data;
          $rootScope.$broadcast('refreshSecretariatesView');

        });
      });
    });


    return {
      reloadSecretariates: reloadSecretariates,
      getSecretariates: getSecretariates,
      getSecretariatesGroup: getSecretariatesGroup,
      getJobTitles: getJobTitles,
      removeUser: removeUser,
      usersWithOut: usersWithOut,
      usersWithJT: usersWithJT,
      changeUser: changeUser,
      changeRoleUser: changeRoleUser,
      removeOldProfile: removeOldProfile,
      getCompleteInfoOfJobTitleByID: getCompleteInfoOfJobTitleByID,
      getJobTitlesBySecretariateID: getJobTitlesBySecretariateID
    };




    function getJobTitlesBySecretariateID(id, cb) {

      socket.emit('getJobTitlesBySecretariateID', id, cb);
    }

    function getCompleteInfoOfJobTitleByID(data, cb) {

      socket.emit('getCompleteInfoOfJobTitleByID', data, cb);
    }

    function removeOldProfile(data, cb) {
      socket.emit('removeOldProfile', data, cb);
    }

    function getSecretariates(profile, cb) {



        socket.emit('getSecretariates', profile, function (err, data) {
          if (profile.roleID === 2 && profile.secretariateID) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id === profile.secretariateID) {
                secretariates = [data[i]];
              }
            }
            return cb(err, secretariates);
          } else if (profile.roleID === 3) {
            secretariates = data;
            return cb(err, secretariates);
          } else {
            secretariates = [];
            return cb(err, secretariates);
          }

        });

    }

    function getSecretariatesGroup(profile, cb) {



        socket.emit('getSecretariates', profile, function (err, data) {
          secretariatesGroup = data;
          return cb(err, secretariatesGroup);
        });

    }

    function reloadSecretariates(profile, cb) {

      socket.emit('getSecretariates', profile, function (err, data) {
        if (profile.roleID === 2 && profile.secretariateID) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === profile.secretariateID) {
              secretariates = [data[i]];
            }
          }
          return cb(err, secretariates);
        } else if (profile.roleID === 3) {
          secretariates = data;
          return cb(err, secretariates);
        } else {
          secretariates = [];
          return cb(err, secretariates);
        }

      });

    }

    function getJobTitles(data, cb) {
      socket.emit('getJobTitles', data, cb);
    }

    function removeUser(data, cb) {
      socket.emit('removeUserFromJobTitle', data, cb);
    }

    function usersWithOut(cb) {
      socket.emit('getUsersWithOutJobTitle', {}, cb);
    }

    function usersWithJT(cb) {
      socket.emit('getUsersWithJobTitle', {}, cb);
    }

    function changeUser(data, cb) {
      socket.emit('changeUserOfJobTitle', data, cb);
    }

    function changeRoleUser(data, cb) {
      socket.emit('changeRoleOfUser', data, cb);
    }
  }
})();
