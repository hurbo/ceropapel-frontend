(function () {
  'use strict';
  angular.module('app.mailbox')
    .factory('ExternalsFactory', ExternalsFactory);
  ExternalsFactory.$inject = ['$rootScope', '$q', 'socket', 'profileFactory', '$state', '$stateParams'];

  function ExternalsFactory($rootScope, $q, socket, Profile, $state, $stateParams) {
    var current = null;
    var users = null;
    var currentPermissions = null;
    var currentProfile = null;
    return {

      getUsers: getUsers,
      getCurrentUser: getCurrentUser,
      setCurrentUser: setCurrentUser,
      navigate: navigate,
      getCurrentBossjobTitleID: getCurrentBossjobTitleID,
      validatePermision: validatePermision
    };

    function validatePermision(permission) {
      let defer = $q.defer();
      if (!permission) {
        defer.resolve(false);
      } else {

        if (!currentPermissions) {
          _setPermissions().then(function (permissions) {
            for (let i = 0; i < currentPermissions.length; i++) {
              var element = currentPermissions[i];
              if (element.name === permission) {
                if (element.val == 1) {

                  defer.resolve(true);
                } else {
                  defer.resolve(false);
                }
              }

            }
          });
        } else {
          for (let i = 0; i < currentPermissions.length; i++) {
            var element = currentPermissions[i];
            if (element.name === permission) {
              if (element.val === 1) {

                defer.resolve(true);
              } else {
                defer.resolve(false);
              }
            }

          }
        }





      }

      return defer.promise;
    }








    function _setPermissions() {
      let defer = $q.defer();


      Profile.updateProfile().then(function (profile) {

        currentProfile = profile;


        // Profile.getProfile().then(function (profile) {

        var boss = getCurrentUser();
        if(!boss){
          console.error('No hay jefe activo');
          defer.reject();
          return defer;
        }
        var data = {
          clerkJobTitleID: profile.jobTitleID,
          bossJobTitleID: boss && boss.jobTitleID ? boss.jobTitleID : null
        };

        socket.emit('getPermission', data, function (err, permissions) {
          if (err) {
            defer.reject(err);
          } else {
            currentPermissions = permissions;
            defer.resolve(currentPermissions);
          }
        });
      }, function (err) {
        defer.reject(err);
      });


      return defer.promise;
    }


    function getCurrentBossjobTitleID(cb) {

      if (current) {
        cb(null, current);
      } else if ($stateParams.jobTitle) {
        cb(null, $stateParams.jobTitle);
      } else {
        cb(null, null);
      }
    }

    function getUsers(cb) {

      if (users) {
        cb(null, users);
      } else {
        socket.emit('getBosses', {}, function (err, data) {
          if (data[0]) setCurrentUser(data[0]);
          cb(err, data);
        });
      }
    }

    function getCurrentUser() {

      console.log('getCurrentUser on external factory');
      if (!current && !users) {
        socket.emit('getBosses', {}, function (err, data) {
          if(data && data[0]){
            console.log('need reloas');
            $state.reload();
          }

          users = data;
          if (data[0]) {
            current = users[0];
            setCurrentUser(data[0]);
          }
        });
      }
      if (!current && users && users[0]) {

        current = users[0];
        setCurrentUser(current);

        return users[0];
      }
      return current;
    }




    function setCurrentUser(boss) {
      current = boss;
      _setPermissions();
      navigate();
    }


    function navigate() {

      if (current && current.jobTitleID && current.jobTitleID !== $stateParams.jobTitle) {



        if ($state.current.name === 'app.mailbox.external.in' && current.jobTitleID) {
          $state.go('app.mailbox.external.in', {
            jobTitle: current.jobTitleID
          });
        }


        if ($state.current.name === 'app.mailbox.external.out' && current.jobTitleID) {
          $state.go('app.mailbox.external.out', {
            jobTitle: current.jobTitleID
          });
        }

        if ($state.current.name === 'app.mailbox.external.turned' && current.jobTitleID) {
          $state.go('app.mailbox.external.turned', {
            jobTitle: current.jobTitleID
          });
        }


        if ($state.current.name === 'app.mailbox.external.archived' && current.jobTitleID) {
          $state.go('app.mailbox.external.archived', {
            jobTitle: current.jobTitleID
          });
        }

        if ($state.current.name === 'app.mailbox.external.archivedOut' && current.jobTitleID) {
          $state.go('app.mailbox.external.archivedOut', {
            jobTitle: current.jobTitleID
          });
        }

      }
    }

  }
})();
