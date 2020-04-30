(function () {
  'use strict';

  angular.module('app.mailbox').controller('turnComponentController', turnComponentController);

  angular.module('app.mailbox').component('turnComponent', {
    template: '<div ng-include="tcmp.templateUrl">',
    bindings: {
      document: '=',
      needReload: '='
    },
    controller: turnComponentController,
    controllerAs: 'tcmp'

  });


  turnComponentController.$inject = [
    '$q',
    '$state',
    'ViewDocumentFactory',
    'inboxFactory',
    '$uibModal',
    '$uibModalStack',
    'SweetAlert',
    '$rootScope',
    'ExternalsFactory',
    'contactsService',
    'profileFactory'
  ];

  function turnComponentController(
    $q,
    $state,
    ViewDocumentFactory,
    inboxFactory,
    $uibModal,
    $uibModalStack,
    SweetAlert,
    $rootScope,
    ExternalsFactory,
    contactsService,
    profileFactory
  ) {
    var vm = this;

    vm.templateUrl = 'views/mailbox/components/turn.html';
    vm.contacts = [];
    vm.selectedTo = [];
    vm.recipients = [];

    vm.trackingReason = '';
    vm.turnMessage = '';
    vm.disableTurnButton = false;

    //FUNCTIONS

    vm.onRemoveTo = onRemoveTo;
    vm.onSelectTo = onSelectTo;
    vm.toggleSignatureRequirement = toggleSignatureRequirement;
    vm.turnDocument = turnDocument;


    vm.turnTypes = [
      {
        value: 'Para su atención',
        name: 'Para su atención',
        id: 1
      },
      {
        value: 'De conocimiento',
        name: 'De conocimiento',
        id: 2
      },
      {
        value: 'Tratar acuerdos con titular',
        name: 'Tratar acuerdos con titular',
        id: 3
      },
      {
        value: 'Preparar oficio para firma del titular',
        name: 'Preparar oficio para firma del titular',
        id: 4
      }
    ];
    vm.open = open;

    vm.ok = function () {
      $uibModalStack.dismissAll();
    };
    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };


    function open(size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/mailbox/components/turnModal.html',
        controller: turnComponentController,
        size: size
      });

      vm.test = modalInstance.close();

      var state = $('#modal-state');
      modalInstance.result.then(function () {
        state.text('Modal dismissed with OK status');
      }, function () {
        state.text('Modal dismissed with Cancel status');
      });
    }



    $rootScope.$on('watch-reload-view-inbox', function (event, data) {

      _init().then(function () {

      });
    });







    _init();

    function _init() {

      let defer = $q.defer();
      vm.ViewFactory = ViewDocumentFactory;
      vm.isOnExternal = false;
      vm.currentBoss = null;

      profileFactory.getProfile().then(function (profile) {
        vm.profile = profile;
        vm.ViewFactory.getInvolveds().then(function (Involveds) {
          vm.currentInvolveds = Involveds;

          vm.ViewFactory.getBox().then(function (box) {

            vm.currentBox = box;
            if (vm.currentBox === 'externalIn' || vm.currentBox === 'externalOut') {
              vm.currentBoss = ExternalsFactory.getCurrentUser();
              vm.isOnExternal = true;
            }
            contactsService.getContacts(function (err, contacts) {
              if (err) {
                console.error('error en getContacs turn Component');
                console.error(err);
              }
              vm.contacts = contacts;

              vm.currentDocument = vm.ViewFactory.getDocument();
              defer.resolve();
            });



          });
        });

      });







      return defer.promise;
    }






    function onRemoveTo(item, model) {
      vm.contacts.push(item);
      _removeFromListRecipients(item);
    }

    function _removeFromListRecipients(item) {
      vm.recipients.splice(vm.recipients.indexOf(item), 1);
    }

    function onSelectTo(item, model) {
      if (item.email === vm.profile.email) {

        SweetAlert.swal({
          title: '¡Atención!',
          text: 'No se permite enviar oficios a si mismo',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });



        var index = vm.selectedTo.indexOf(item);
        if (index >= 0) vm.selectedTo.splice(index, 1);
        return;
      }



      if (item.email === vm.currentDocument.fromEmail) {
        SweetAlert.swal({
          title: '¡Atención!',
          text: 'El usuario ya tiene acceso al oficio',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });
        /*jshint -W004*/
        var index = vm.selectedTo.indexOf(item);
        if (index >= 0) vm.selectedTo.splice(index, 1);
        return;
      }

      for (var i = 0; i < vm.currentInvolveds.length; i++) {


        if (item.email === vm.currentInvolveds[i].TUEmail) {
          SweetAlert.swal({
            title: '¡Atención!',
            text: 'El usuario ya tiene acceso al oficio',
            type: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });
          /*jshint -W004*/
          var index = vm.selectedTo.indexOf(item);
          if (index >= 0) vm.selectedTo.splice(index, 1);
          return;
        }
      }

      if (_isEmail(item.email)) {


        var index = vm.contacts.indexOf(item);
        if (index >= 0) {
          vm.contacts.splice(index, 1);
        }
        item.needSign = false;
        vm.recipients.push(item);

      } else {
        SweetAlert.swal({
          title: '¡Atención!',
          text: 'Ingresa un correo electrónico válido',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });
        var index = vm.selectedTo.indexOf(item);
        if (index >= 0) vm.selectedTo.splice(index, 1);
      }
    }



    function _isEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }


    function toggleSignatureRequirement(recipient) {
      recipient.needSign = !recipient.needSign;
    }


    function turnDocument() {

      let defer = $q.defer();

      if (vm.recipients.length < 1) {
        defer.reject({
          message: 'Agrega destinatario(s)'
        });

        SweetAlert.swal({
          title: '¡Atención!',
          text: 'Agrega destinatario(s)',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
        });
      } else if (!vm.trackingReason || vm.trackingReason.value === '') {
        defer.reject({
          message: 'Agrega tipo de turnado'
        });

        SweetAlert.swal({
          title: '¡Atención!',
          text: 'Agrega tipo de turnado',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
        });
      } else {

        vm.trackingReason = vm.trackingReason.value;
        var forwards = [];
        for (var i = 0; i < vm.recipients.length; i++) {

          forwards.push({
            noCertificado: 'No ha firmado',
            hash: 'No ha firmado',
            createdAt: new Date().getTime(),
            isTurned: true,
            email: vm.recipients[i].email.toLowerCase(),
            name: vm.recipients[i].name.toLowerCase() || 'Nombre pendiente',
            toJT: vm.recipients[i].jobTitleID,
            fromJT: vm.profile.jobTitleID,
            from: {
              email: vm.profile.email,
              name: vm.profile.name,
              avatar: vm.profile.avatar,
              archived: false
            },
            state: 'Sin leer',
            turnMessage: vm.turnMessage,
            trackingReason: vm.trackingReason,
            publicTracking: true,
            needSign: vm.recipients[i].needSign,
            type: vm.currentDocument.type,
            toID: vm.recipients[i].id,
            userID: vm.recipients[i].id,
            bossJTID: vm.isOnExternal ? vm.currentBoss.jobTitleID : null,
            bossID: vm.isOnExternal ? vm.currentBoss.id : null,
            externalTurned: vm.isOnExternal
          });
        }
        var data = {
          docID: vm.currentDocument.id,
          document: vm.currentDocument.id,
          forwards: forwards,
          trackingReason: vm.trackingReason,
          trackingMessage: vm.turnMessage
        };

        vm.disableTurnButton = true;
        inboxFactory.forwardDocuments(data, function (err, solve) {
          if (err) {
            defer.reject(err);
            vm.disableTurnButton = false;
          } else {

            ViewDocumentFactory.sendReloadMessageViewInbox(true);
            $uibModalStack.dismissAll();
            vm.disableTurnButton = false;
            forwards = [];
            vm.selectedTo = [];
            vm.recipients = [];
            vm.turnMessage = '';
            vm.trackingReason = '';
            SweetAlert.swal({
              title: 'Hecho!',
              text: 'Oficio turnado',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#253846',
              confirmButtonText: 'Aceptar',
              timer: 1000
            });
            defer.resolve();
          }
        });
      }
      return defer.promise;
    }
  }




}());