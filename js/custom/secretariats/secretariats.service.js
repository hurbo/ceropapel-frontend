// A RESTful factory for retrieving secretariatsFactory from json file

(function () {
  'use strict';

  angular
    .module('app.secretariats')
    .factory('secretariatsFactory', secretariatsFactory);

  secretariatsFactory.$inject = ['socket'];

  function secretariatsFactory(socket) {
    var currentJobTitle = null;
    var secretariates = null;
    var init = false;

    return {
      subscribe: subscribe,
      reloadSecretariates: reloadSecretariates,
      getSecretariates: getSecretariates,
      getJobTitlesBySecretariateID: getJobTitlesBySecretariateID,
      getJobTitle: getJobTitle,
      setJobTitle: setJobTitle,
      createJobTitle: createJobTitle,
      editJobTitle: editJobTitle,
    };


    function getJobTitlesBySecretariateID(id, cb) {
      socket.emit('getJobTitlesBySecretariateID', id, cb);
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

    function subscribe() {
      var prosime = new Promise(function (resolve, reject) {
        resolve(init);
        if (!init) {
          init = true;
        }
      });
      return prosime;
    }

    function getJobTitle() {
      return currentJobTitle;
    }


    function setJobTitle(jobTitle) {
      currentJobTitle = jobTitle;
    }

    function createJobTitle(data, cb) {

      socket.emit('createJobTitle', data, function (err, solve) {



        if (err) {
          return cb(err, null);
        }
        var mes = currentJobTitle ? 'Se agregó una área' : 'Se agregó un puesto';
        return cb(null, mes);
      });
    }

    function editJobTitle(data, cb) {

      socket.emit('editJobTitle', data, function (err, data) {
        if (err) {
          return cb(err, null);
        }
        var mes = currentJobTitle ? 'Se edito una área' : 'Se edito un puesto';
        return cb(null, mes);
      });
    }




  }
})();
