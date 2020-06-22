(function () {
  'use strict';

  angular.module('app.drafts').factory('draftsFactory', draftsFactory);

  draftsFactory.$inject = ['$q', 'socket', 'profileFactory'];

  function draftsFactory($q, socket, Profile) {
    var templates = false;
    var service = {
      getTemplates: getTemplates,

      createTemplete: createTemplete,
      getTemplate: getTemplate,
      reloadTemplates: reloadTemplates
    };
    return service;







    function getTemplate(data, callback) {
      console.log("GetTemplate service draft");
      socket.emit('getTemplate', data, callback);
    }

    function createTemplete(json, callback) {
      socket.emit('createTemplate', json, function (err, solve) {
        reloadTemplates().then(function (solve) {
          callback(err, solve);
        });
      });
    }


    function reloadTemplates() {
      var deferred = $q.defer();
      Profile.getProfile().then(function (profile) {
        socket.emit('getTemplates', profile, function (error, data) {
          if (!error) {
            templates = data;
            deferred.resolve(data);
          } else {
            deferred.reject(error);
          }
        });
      });
      return deferred.promise;
    }


    function getTemplates() {
      var deferred = $q.defer();
      if (templates) {
        deferred.resolve(templates);
      } else {
        Profile.getProfile().then(function (profile) {
          socket.emit('getTemplates', profile, function (error, data) {
            if (!error) {
              templates = data;
              deferred.resolve(data);
            } else {
              deferred.reject(error);
            }
          });
        });
      }
      return deferred.promise;
    }
  }
})();
