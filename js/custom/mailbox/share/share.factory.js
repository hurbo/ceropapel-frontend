(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .factory('shareFactory', shareFactory);

  shareFactory.$inject = ['socket'];

  function shareFactory(socket) {

    return {
      getEmployees: getEmployees,
      getEmployeeByName: getEmployeeByName,
      getEmployeeByID: getEmployeeByID,
      getSharedServicesByFolio: getSharedServicesByFolio
    };

    function getEmployees(cb) {
      socket.emit('shareGetEmployees', {}, cb);
    }

    function getEmployeeByName(name, cb) {
      socket.emit('getEmployeeByName', name, cb);
    }

    function getEmployeeByID(clave, cb) {
      socket.emit('getEmployeeByID', clave, cb);
    }

    function getSharedServicesByFolio(folio, cb) {
      socket.emit('getSharedServicesByFolio', folio, cb);
    }
  }

}());