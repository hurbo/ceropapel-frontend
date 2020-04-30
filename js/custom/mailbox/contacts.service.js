// A RESTful factory for retrieving mails from json file

(function () {
  'use strict';

  angular.module('app.mailbox').service('contacts', contacts);

  contacts.$inject = ['socket'];

  function contacts(socket) {
    this.load = function (query) {
      socket.emit(
        'findContacts', {
          query: query
        },
        function (error, contacts) {
          var c = [];
          // var defer = $q.defer();
          if (error) return [];
          else {
            // if ( error ) defer.resolve([]);
            for (var i = 0; i < contacts.length; i++) {
              c.push(contacts[i].email);
              // contacts[i].data = contacts[i].email;
            }
            return c;
            // defer.resolve(c);
          }

        }
      );
    };
  }
})();
