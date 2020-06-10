(function () {
  'use strict';

  angular.module('app.mailbox').controller('multipleTurnComponentController', multipleTurnComponentController);

  angular.module('app.mailbox').component('multipleTurnComponent', {
    template: '<div ng-include="mtcmp.templateUrl">',
    bindings: {
      document: '=',
      needReload: '='
    },
    controller: multipleTurnComponentController,
    controllerAs: 'mtcmp'

  });


  multipleTurnComponentController.$inject = [
    '$q',
    'inboxFactory',
    '$uibModal',
    '$uibModalStack',
    'swangular',
    'paginatorFactory',
    'contactsService',
    'socket',
    'profileFactory',
    '$state',
    'ExternalsFactory'
  ];

  function multipleTurnComponentController(
    $q,
    inboxFactory,
    $uibModal,
    $uibModalStack,
    SweetAlert,
    paginatorFactory,
    contactsService,
    socket,
    profileFactory,
    $state,
    ExternalsFactory
  ) {
    var vm = this;
    vm.canActivate = canActivate;

    vm.templateUrl = 'views/mailbox/components/multipleTurn.html';
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
    vm.haveInboxesMarked = haveInboxesMarked;
    vm.steepTwo = steepTwo;
    vm.steepThree = steepThree;
    vm.validateSigns = validateSigns;





    vm.turnTypes = [{
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




    function canActivate() {
      if (vm.active) {
        return true;
      } else {

      }
    }

    init();

    function _activate() {

      if ($state.current.name.indexOf('app.mailbox.internal') !== -1) {
        vm.active = true;
        vm.internal = true;
        // /out/
        if ($state.current.name.indexOf('archivedOut') !== -1 || $state.current.name.indexOf('.out') !== -1 || $state.current.name.indexOf('.archivedOut') !== -1) {

          vm.itsInbox = false;
        } else {
          vm.itsInbox = true;
        }
      } else {
        ExternalsFactory.validatePermision('turn').then(function (can) {
          if (can) {
            vm.active = true;
            vm.currentBoss = ExternalsFactory.getCurrentUser();
            vm.internal = false;
            if ($state.current.name.indexOf('archivedOut') !== -1 || $state.current.name.indexOf('.out') !== -1 || $state.current.name.indexOf('.archivedOut') !== -1) {
              vm.itsInbox = false;
            } else {
              vm.itsInbox = true;
            }
          } else {
            vm.active = false;
          }
        });
      }
    }


    function validateSigns() {
      if (vm.itsInbox) {
        var a = 0;
        var b = 0;
        for (let i = 0; i < paginatorFactory.items.length; i++) {
          var element = paginatorFactory.items[i];

          // if(element.selected && element.needSign === 1 && (element.signed === 0 || (!element.signBySecretary || element.signBySecretary === 0) )){
          if (element.selected && element.needSign === 1) {
            b++;
            if (element.signBySecretary === 1 || element.signed === 1) {
              a++;
            } else {
              vm.canUse = false;
            }
          }
        }
        if (a === b) {
          vm.canUse = true;
        }
        return vm.canUse;
      } else {
        return true;
      }
    }

    function init() {


      profileFactory.getProfile().then(profile => {
        vm.profile = profile;
        vm.isOnExternal = null;
        vm.currentBoss = null;
        _activate();
        if ($state.current.name.indexOf('app.mailbox.external') !== -1) {
          vm.currentBoss = ExternalsFactory.getCurrentUser();
          vm.isOnExternal = true;
        } else {
          vm.isOnExternal = false;
        }

        profileFactory.getProfile().then(function (profile) {

          vm.profile = profile;
          contactsService.getContacts(function (err, solve) {
            vm.steep = 1;
            vm.contacts = solve;

          });
        });
      })



    }

    function open(size) {

      var modalInstance = $uibModal.open({
        templateUrl: 'views/mailbox/components/multipleTurnModal.html',
        controller: multipleTurnComponentController,
        size: size,
        backdrop: 'static',
        keyboard: false
      });

      vm.test = modalInstance.close();

      var state = $('#modal-state');
      modalInstance.result.then(function () {
        state.text('Modal dismissed with OK status');
      }, function () {
        state.text('Modal dismissed with Cancel status');
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
        index = vm.contacts.indexOf(item);
        if (index >= 0) {
          vm.contacts.splice(index, 1);
        }

        return;
      }
      if (_isEmail(item.email)) {
        var index = vm.contacts.indexOf(item);
        if (index >= 0) {
          vm.contacts.splice(index, 1);
        }
        item.needSign = false;
        vm.recipients.push(item);
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


    function steepTwo() {
      vm.steep = 2;

      var data = {
        inboxes: _getInboxMarked(),
        recipients: vm.recipients
      };
      vm.loading = true;

      inboxFactory.confirmMultipleTurn(data, function (err, solve) {
        vm.fullDetails = solve;

      });
    }


    function _getCleanDetails() {
      let defer = $q.defer();

      for (let i = 0; i < vm.fullDetails.length; i++) {
        var item = vm.fullDetails[i];
        var cleanRecipients = [];
        for (let j = 0; j < item.recipients.length; j++) {
          var element = Object.assign({}, item.recipients[j]);



          if (element.canRecibe) {
            element['trackingMessage'] = vm.trackingMessage;
            element['trackingReason'] = vm.trackingReason.name;
            element['jobTitleID'] = element.jobTitleID;
            element['toJT'] = element.jobTitleID;
            element['toID'] = element.id;
            element['toUser'] = element.id;
            element['fromJT'] = vm.profile.jobTitleID;
            element['externalTurned'] = false;
            element['bossJTID'] = vm.isOnExternal ? vm.currentBoss.jobTitleID : null;
            element['bossID'] = vm.isOnExternal ? vm.currentBoss.id : null;
            element['externalTurned'] = vm.isOnExternal;
            cleanRecipients.push(element);

          }
        }
        vm.fullDetails[i].recipients = cleanRecipients;
      }
      defer.resolve(vm.fullDetails);
      return defer.promise;
    }

    function steepThree() {
      vm.steep = 3;

      _getCleanDetails().then(function (solve) {
        var data = {
          inboxes: solve
        };
        vm.loading = true;
        console.clear();


        inboxFactory.newMultipleForwardDocuments(data, function (err, solve) {
          if (err) {
            console.error(err);
          } else {
            paginatorFactory.refreshPage();
            vm.loading = false;
            vm.cancel();
            SweetAlert.swal({
              title: '¡Hecho!',
              text: 'Oficios turnados',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });

          }
        });
      });







    }



  }
}());
