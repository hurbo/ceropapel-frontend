(function () {
  'use strict';


  angular.module('app.profile').factory('profileFactory', profileFactory);

  profileFactory.$inject = ['swalFactory', '$state', '$q', 'socket', '$rootScope'];

  function profileFactory(swalFactory, $state, $q, socket, $rootScope) {
    var profile = null;
    var init = false;
    var initNotifications = false;
    return {
      subcribe: subcribe,
      subcribeNotifications: subcribeNotifications,
      get: get,

      getProfile: getProfile,
      getEmail: getEmail,
      managePermissions: managePermissions,
      deletePermissions: deletePermissions,
      cedePermissions: cedePermissions,
      uploadKey: uploadKey,
      uploadCer: uploadCer,
      setName: setName,
      setUserByClave: setUserByClave,
      editNotificationPreferences: editNotificationPreferences,
      removeFromFavorites: removeFromFavorites,
      getOrganizationalStructureForProfile: getOrganizationalStructureForProfile,
      addToFavorites: addToFavorites,
      getPotentialSecretaries: getPotentialSecretaries,
      getAllProfileUsers: getAllProfileUsers,
      updateProfile: updateProfile,
      reloadProfile: reloadProfile

    };


    function subcribeNotifications() {
      var promise = new Promise(function (resolve, reject) {
        resolve(initNotifications);
        if (!initNotifications) {
          initNotifications = true;
        }
      });
      return promise;
    }

    function subcribe() {
      var promise = new Promise(function (resolve, reject) {
        resolve(init);
        if (!init) {
          init = true;
        }
      });
      return promise;
    }

    function get(cb) {

      if (profile !== null) {
        cb(null, profile);
      } else {
        socket.emit('getProfile', {}, function (err, data) {
          profile = data;
          if (profile) {
            watch(cb);
          }
          cb(err, profile);
        });
      }
    }



    function updateProfile() {
      let defer = $q.defer();

      socket.emit('getProfile', {}, function (err, data) {
        if (err) {
          defer.reject(err);
        } else {
          profile = data;
          $rootScope.$broadcast('updateProfile');
          defer.resolve(data);
        }
      });

      return defer.promise;
    }


    function reloadProfile() {
      let defer = $q.defer();

      socket.emit('getProfile', {}, function (err, data) {
        if (err) {
          defer.reject(err);
        } else {
          profile = data;
          defer.resolve(data);
        }
      });

      return defer.promise;
    }

    function getProfile() {
      let defer = $q.defer();

      if (profile === null) {
        socket.emit('getProfile', {}, function (err, data) {
          if (err) {
            defer.reject(err);
          } else {
            profile = data;
            if (!profile.jobTitleID) {
              // $state.go('app.profile');

            }
            defer.resolve(data);
          }
        });
      } else {

        if (!profile.jobTitleID) {
          // $state.go('app.profile');

        }
        defer.resolve(profile);
      }
      return defer.promise;
    }





    function getEmail() {
      socket.emit('getProfile', {}, function (error, data) {
        return data.email;
      });
    }

    function deletePermissions(params, cb) {

      socket.emit('deletePermissions', params, cb);
    }

    function managePermissions(params, cb) {

      socket.emit('managePermissions', params, cb);
    }

    function cedePermissions(params, cb) {
      socket.emit('cedePermissions', params, cb);
    }


    function editNotificationPreferences(params, cb) {
      if (!params) {
        console.error('Error en parametros de editNotificationPreferences');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('editNotificationPreferences', params, cb);
    }


    function setUserByClave(params, cb) {
      if (!params) {
        console.error('Error en parametros de setUserByClave');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('setUserByClave', params, cb);
    }

    function setName(params, cb) {
      if (!params) {
        console.error('Error en parametros de setName');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('setName', params, cb);
    }

    function uploadKey(params, cb) {

      if (!params) {
        console.error('Error en parametros de uploadKey');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('uploadKey', params, cb);
    }

    function uploadCer(params, cb) {
      if (!params) {
        console.error('Error en parametros de uploadCer');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('uploadCer', params, cb);
    }


    function removeFromFavorites(params, cb) {
      if (!params) {
        console.error('Error en parametros de removeFromFavorites');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('removeFromFavorites', params, cb);
    }

    function getOrganizationalStructureForProfile(params, cb) {
      if (!params) {
        console.error('Error en parametros de getOrganizationalStructureForProfile');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('getOrganizationalStructureForProfile', params, cb);
    }

    function addToFavorites(params, cb) {
      if (!params) {
        console.error('Error en parametros de addToFavorites');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('addToFavorites', params, cb);
    }

    function getPotentialSecretaries(params, cb) {
      if (!params) {
        console.error('Error en parametros de getPotentialSecretaries');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('getPotentialSecretaries', params, cb);
    }

    function getAllProfileUsers(params, cb) {
      if (!params) {
        console.error('Error en parametros de getAllProfileUsers');
        return cb({
          message: 'Debe incluir toda la información'
        }, null);
      }
      socket.emit('getAllProfileUsers', params, cb);
    }



  }
})();
