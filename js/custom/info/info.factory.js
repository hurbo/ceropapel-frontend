(function () {
  'use strict';

  angular
    .module('app.info')
    .factory('InfoFactory', InfoFactory)

  InfoFactory.$inject = [
    'socket'
  ];

  function InfoFactory(socket) {

    return {
      getsinLeer: getsinLeer,
      getsinFirmar: getsinFirmar,
      getpendientes: getpendientes,
      getcolaboracionSinFirmar: getcolaboracionSinFirmar,
      getcolaboracionPendientes: getcolaboracionPendientes,
      getenviadosSinLeer: getenviadosSinLeer,
      getenviadosSinFirmar: getenviadosSinFirmar,
      getenviadosEnColaboracionSinFirmar: getenviadosEnColaboracionSinFirmar,
      getenviadosPendientes: getenviadosPendientes,
      getexternosSinLeer: getexternosSinLeer,
      getexternosSinFirmar: getexternosSinFirmar,
      getexternosTurnados: getexternosTurnados,
      getborradores: getborradores
    };

    function getsinLeer(data, cb) {
      socket.emit('getsinLeer', data, cb);
    }

    function getsinFirmar(data, cb) {
      socket.emit('getsinFirmar', data, cb);
    }

    function getpendientes(data, cb) {
      socket.emit('getpendientes', data, cb);
    }

    function getcolaboracionSinFirmar(data, cb) {
      socket.emit('getcolaboracionSinFirmar', data, cb);
    }

    function getcolaboracionPendientes(data, cb) {
      socket.emit('getcolaboracionPendientes', data, cb);
    }

    function getenviadosSinLeer(data, cb) {
      socket.emit('getenviadosSinLeer', data, cb);
    }

    function getenviadosSinFirmar(data, cb) {
      socket.emit('getenviadosSinFirmar', data, cb);
    }

    function getenviadosEnColaboracionSinFirmar(data, cb) {
      socket.emit('getenviadosEnColaboracionSinFirmar', data, cb);
    }

    function getenviadosPendientes(data, cb) {
      socket.emit('getenviadosPendientes', data, cb);
    }

    function getexternosSinLeer(data, cb) {
      socket.emit('getexternosSinLeer', data, cb);
    }

    function getexternosSinFirmar(data, cb) {
      socket.emit('getexternosSinFirmar', data, cb);
    }

    function getexternosTurnados(data, cb) {
      socket.emit('getexternosTurnados', data, cb);
    }

    function getborradores(data, cb) {
      socket.emit('getborradores', data, cb);
    }




  }

}());
