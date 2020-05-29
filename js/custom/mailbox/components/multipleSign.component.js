(function () {
  'use strict';

  angular.module('app.mailbox').controller('multipleSignComponentController', multipleSignComponentController);

  angular
    .module('app.mailbox')
    .component('multipleSignComponent', {
      template: '<div ng-include="mscmp.templateUrl">',
      bindings: {
        document: '=',
      },
      controller: multipleSignComponentController,
      controllerAs: 'mscmp'

    });



  multipleSignComponentController.$inject = [
    'swangular',
    'inboxFactory',
    '$uibModal',
    '$uibModalStack',
    'paginatorFactory',
    'socket',
    '$state',
    'ExternalsFactory',
    'profileFactory'
  ];



  function multipleSignComponentController(
    SweetAlert,
    inboxFactory,
    $uibModal,
    $uibModalStack,
    paginatorFactory,
    socket,
    $state,
    Externals,
    profileFactory
  ) {
    var vm = this;
    vm.templateUrl = 'views/mailbox/components/multipleSign.html';


    vm.haveInboxesMarked = haveInboxesMarked;

    vm.optionsStatus = [{
        name: 'Recibido',
        id: 18
      },
      {
        name: 'En proceso',
        id: 16
      },
      {
        name: 'Atendido satisfactoriamente',
        id: 17
      },
      {
        name: 'De conocimiento',
        id: 19
      },
      {
        name: 'No procede',
        id: 20
      },
      {
        name: 'Congelado',
        id: 25
      }
    ];



    vm.itsOutbox = null;
    vm.prossesing = false;
    vm.loading = false;
    vm.cancel = cancel;
    vm.open = open;
    vm.ok = ok;
    vm.requirePass = requirePass;








    _activate();

    function _activate() {

      profileFactory.getProfile()
      .then(profile => {
        vm.profile = profile;
        if ($state.current.name.indexOf('app.mailbox.internal') !== -1) {
          vm.active = true;
          vm.internal = true;
          if ($state.current.name.indexOf('archivedOut') !== -1) {
            vm.itsInbox = false;
          } else {
            vm.itsInbox = true;
          }
        } else {
          Externals.validatePermision('sign').then(function (can) {
            if (can) {
              vm.active = true;
              vm.currentBoss = Externals.getCurrentUser();
              vm.internal = false;
              if ($state.current.name.indexOf('archivedOut') !== -1) {
                vm.itsInbox = false;
              } else {
                vm.itsInbox = true;
              }
            } else {
              vm.active = false;
            }
          });
        }
      })


    }


    function cancel() {
      $uibModalStack.dismissAll();
    }


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/multipleSignModal.html',
        controller: multipleSignComponentController,
        size: size,
        backdrop: 'static',
        keyboard: false
      });
    }


    function haveInboxesMarked() {
      for (let i = 0; i < paginatorFactory.items.length; i++) {
        var element = paginatorFactory.items[i];
        if (element.selected === true) {
          return true;
        }
      }
      return false;
    }

    function requirePass() {
      for (let i = 0; i < paginatorFactory.items.length; i++) {
        var element = paginatorFactory.items[i];
        if (element.selected === true && element.needSign === 1) {
          return true;
        }
      }
      return false;
    }

    function _getInboxMarked() {
      var inboxes = [];
      for (let i = 0; i < paginatorFactory.items.length; i++) {
        var element = paginatorFactory.items[i];
        if (element.selected === true) {
          inboxes.push(element);
        }
      }
      return inboxes;
    }

    function ok() {
      vm.loading = true;
      var data = {
        password: vm.password,
        channel: new Date().getTime(),
        inboxes: _getInboxMarked()
      };


      inboxFactory.validatePassword(data, function (err, solve) {
        if (err) {
          vm.loading = false;
          SweetAlert.swal({
            title: '¡Error!',
            text: err.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar'
          });
        } else {
          inboxFactory.multipleSign(data, function (err, solve) {
            if (err) {
              vm.loading = false;
              SweetAlert.swal({
                title: '¡Error!',
                text: err.message,
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#DD2C57',
                confirmButtonText: 'Aceptar'
              });
            } else {
              socket.on(data.channel, function (progress) {


                vm.value = progress;
                vm.type = '';

                if (vm.value < 25) {
                  vm.type = 'danger';
                } else if (vm.value < 50) {
                  vm.type = 'warning';
                } else if (vm.value < 75) {
                  vm.type = 'info';
                } else {
                  vm.type = 'success';
                }
                if (vm.value >= 100) {

                  paginatorFactory.refreshPage();
                  vm.loading = false;
                  cancel();
                  SweetAlert.swal({
                    title: '¡Hecho!',
                    text: 'Cambio de estatus',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#DD2C57',
                    confirmButtonText: 'Aceptar',
                    timer: 1200
                  });
                }

              });
            }



          });

        }

      });

    }











  }

}());
