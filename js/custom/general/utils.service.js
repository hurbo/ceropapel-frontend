(function () {
  'use strict';

  angular
    .module('app.general')
    .service('utilsService', utilsService);

  utilsService.$inject = [
    'socket'
  ];

  function utilsService(socket) {

    return {

    };

  }

}());