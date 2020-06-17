/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('elaboratedController', elaboratedController);

  elaboratedController.$inject = [
    'socket',
    '$rootScope',
    'mailboxFactory',
    'paginatorFactory',
    'filterFactory'
  ];

  function elaboratedController(
    socket,
    $rootScope,
    mailboxFactory,
    paginatorFactory,
    filterFactory
  ) {
    var vm = this;
    vm.filter = filterFactory;

    vm.folder = 'colaboration';

    vm.getState = getState;

    vm.filtra = filtra;
    vm.search = search;
    vm.cancelSearch = cancelSearch;

    function filtra(
      descDate,
      showL1,
      showL2,
      showL3,
      showLeidos,
      showFirmados,
      showRechazado
    ) {
      mailboxFactory.inDocuments(function (error, data) {
        var initialState = data;
        var statePreference = [];
        if (showL1) {
          for (var i = 0; i < initialState.length; i++) {
            if (initialState[i].priority === 'Urgente') {
              statePreference.push(i);
            }
          }
        }
        if (showL2) {
          for (var i = 0; i < initialState.length; i++) {
            if (initialState[i].priority === 'Importante') {
              statePreference.push(i);
            }
          }
        }
        if (showL3) {
          for (var i = 0; i < initialState.length; i++) {
            if (initialState[i].priority === 'Normal') {
              statePreference.push(i);
            }
          }
        }
        var initialState = [];
        for (var i = 0; i < statePreference.length; i++) {
          initialState.push(data[statePreference[i]]);
        }
        var stateRead = [];
        var removeIdsRead = [];
        if (showLeidos) {
          for (var i = 0; i < initialState.length; i++) {
            if (initialState[i].read && initialState[i].status !== 'reject') {
              stateRead.push(initialState[i]);
            } else {
              stateRead.push(initialState[i]);
            }
          }
        } else {
          for (var i = 0; i < initialState.length; i++) {
            if (!initialState[i].read && initialState[i].status !== 'reject') {
              stateRead.push(initialState[i]);
            }
          }
        }
        vm.myMails = initialState;
      });
    }

    function getState(document) {
      // '0')  Cancelado
      // '1')  Rechazado'
      // '2')  Sin leer'
      // '3')  Leído'
      // '4')  Firmado'
      if (document.status === 'cancelled') {
        return 0;
      }
      if (document.rejected) {
        return 1;
      }
      if (document.signed) {
        return 4;
      }
      if (!document.read) {
        return 2;
      }
      return 3;
    }

    activate();

    function search() {
      if (vm.query) {
        socket.emit(
          'searchColaborationDocuments', {
            query: vm.query
          },
          function (err, result) {
            vm.resultSearch = result;
            vm.hidePaginate = true;
          }
        );
      }
    }

    function cancelSearch() {
      vm.resultSearch = [];
      vm.query = '';
      vm.hidePaginate = false;
      activate();
    }

    function activate() {

      vm.paginator = paginatorFactory;
      vm.paginator.init('elaborated');

      socket.emit('getProfile', {}, function (error, profile) {
        if (
          profile.jobTitle === '' ||
          profile.jobTitle === undefined ||
          profile.jobTitle === null
        ) {

        }
        socket.on('mailbox-in-' + profile.email, function (nuevo) {
          vm.paginator.items.unshift(nuevo);
        });
      });

    }
  }
})();
