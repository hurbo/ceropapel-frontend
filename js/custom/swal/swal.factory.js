(function () {
  'use strict';

  angular.module('app.swal').factory('swalFactory', swalFactory);

  swalFactory.$inject = ['SweetAlert'];

  function swalFactory(SweetAlert) {
    var service = {
      success: success,
      warning: warning,
      error: error
    };

    return service;

    function success(text) {

      SweetAlert.swal({
        title: '¡Hecho!',
        text: text,
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#253846',
        confirmButtonText: 'Aceptar',
        timer: 1000
      });

    }

    function error(text) {
      SweetAlert.swal({
        title: '¡Error!',
        text: text,
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#DD2C57',
        confirmButtonText: 'Aceptar',
        timer: 1200
      });

    }

    function warning(text) {
      SweetAlert.swal({
        title: 'Hey!',
        text: text,
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#DD2C57',
        confirmButtonText: 'Aceptar',
        timer: 1200
      });
    }
  }
})();
