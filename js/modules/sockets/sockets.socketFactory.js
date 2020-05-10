(function () {
  'use strict';

  angular
    .module('app.sockets', ['app.environment'])
    .factory('socket', sockets);

  sockets.$inject = ['$rootScope', '$state', 'swangular', 'env'];

  /* @ngInject */
  function sockets($rootScope, $state, SweetAlert, env) {
    /*jshint -W117*/
    let retryAttempts = 5;
    const token = localStorage.getItem(`${env.STORAGE_PREFIX}:access_token`);

    const socket = io.connect(env.API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: retryAttempts,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`
          }
        }
      },
    });

    socket.on('reconnect_error', function (err) {
      retryAttempts--;
      if (retryAttempts === 0) {
        alert('Error de conexión al servidor.');
        window.location.reload();
      }
    });

    socket.on('connect_error', function () {
      console.log('%c Socket connection ERROR', 'background: black; color: red');
    });

    function logout() {
      SweetAlert.swal({
        title: 'Tu sesión ha expirado',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      $rootScope.auth.logout();
      $state.go('auth.login');
    }

    socket.on('error', function (err) {
      if (err.type === 'UnauthorizedError') {
        logout();
      } else if (err.code === 'invalid_token' && err.message === 'jwt expired') {
        logout();
      } else {
        console.log(`%c Socket ERROR: ${err.message || err}`, 'background: black; color: red');
      }
    });

    socket.on('connect', function () {
      console.log('%c Socket CONNECTED!', 'background: black; color: cyan');
      $rootScope.$broadcast('socket:connected');
    });

    socket.on('unauthorized', (reason) => {
      console.log('Unauthorized:', reason);
      socket.disconnect();
    });

    return {
      on(eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit(eventName, data, callback) {
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
