(function () {
  'use strict';

  angular
    .module('app.general')
    .service('contactsService', contactsService);

  contactsService.$inject = [
    'socket'
  ];

  function contactsService(socket) {

    return {
      getContacts: getContacts
    };

    function getContacts(resolve) {
      socket.emit('getContacts', {}, resolve);
    }
  }

}());