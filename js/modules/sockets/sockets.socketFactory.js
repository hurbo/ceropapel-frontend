(function () {
  'use strict';

  angular
    .module('app.sockets', ['app.environment'])
    .factory('socket', sockets);

  sockets.$inject = ['$rootScope', 'API_URL'];

  /* @ngInject */
  function sockets($rootScope, API_URL) {
    /*jshint -W117*/
    let retryAttempts = 5;

    const socket = io.connect(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: retryAttempts
    });

    socket.on('reconnect_error', function () {
      retryAttempts--;
      // if (retryAttempts === 0) {
      //   alert('Error de conexión al servidor.');
      //   window.location.reload();
      // }
    });

    socket.on('connect_error', function () {
      console.log('%c Socket connection ERROR', 'background: black; color: red');
    });

    socket.on('connect', function () {
      console.log('%c Socket CONNECTED!', 'background: black; color: cyan');
    });

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }
})();
