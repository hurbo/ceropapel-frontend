(function () {
  'use strict';

  angular
    .module('app.canceledDocuments')
    .factory('CanceledDocuments', CanceledDocuments);

  CanceledDocuments.$inject = ['socket', 'profileFactory'];

  function CanceledDocuments(socket, Profile) {

    return {
      getSecretariates: getSecretariates,
      getDeleteDocumentsBySecretariateID: getDeleteDocumentsBySecretariateID
    };


    function getSecretariates(data, cb) {
      Profile.getProfile().then(function (profile) {
        if (profile.roleID === 1) {
          return cb({
            message: 'No tienes permisos adecuados'
          }, []);
        }
        socket.emit('getStructureAndCounts', data, cb);
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });
    }

    function getDeleteDocumentsBySecretariateID(data, cb) {
      socket.emit('getDeleteDocumentsBySecretariateID', data, cb);
    }


  }
})();
