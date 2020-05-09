(function () {
  'use strict';

  angular.
  module('app.mailbox').
  component('changeStatusComponent', {
    template: '<div ng-include="cscmp.templateUrl">',
    bindings: {
      document: '=',
    },
    controller: changeStatusComponentController,
    controllerAs: 'cscmp'

  });

  changeStatusComponentController.$inject = [
    '$q',
    'ViewDocumentFactory',
    'swangular',
    'inboxFactory',
    'DocumentFactory',
    '$rootScope',
    'ExternalsFactory',
    'profileFactory',
    'paginatorFactory'
  ];



  function changeStatusComponentController(
    $q,
    ViewDocumentFactory,
    SweetAlert,
    inboxFactory,
    DocumentFactory,
    $rootScope,
    ExternalsFactory,
    profileFactory,
    paginatorFactory
  ) {
    var vm = this;
    vm.templateUrl = 'views/mailbox/components/changeStatus.html';

    vm.signDocument = signDocument;
    vm.changeStatus = changeStatus;
    vm.rejectCancel = rejectCancel;
    vm.aceptCancel = aceptCancel;

    vm.optionsStatus = [
      'Recibido',
      'En proceso',
      'Atendido satisfactoriamente',
      'De conocimiento',
      'No procede',
      'Congelado'
    ];
    vm.itsOutbox = null;
    vm.prossesing = false;



    $rootScope.$on('watch-reload-view-inbox', function (event, data) {

      _reload().then(function () {

      });
    });

    function _reload() {
      let defer = $q.defer();
      ViewDocumentFactory.getCurrentDocumentASYNC().then(function (doc) {
        vm.currentDocument = doc;
        ViewDocumentFactory.getInbox().then(function (inbox) {
          ViewDocumentFactory.getBox().then(function (box) {
            vm.currentBoss = ExternalsFactory.getCurrentUser();
            vm.currentBox = box;
            vm.inbox = inbox;
            vm.fallUpon = true;
            if (vm.currentBox === 'internalIn' || vm.currentBox === 'externalIn') {
              validateInfo().then(function () {
                defer.resolve();
              });
            } else {
              defer.resolve();
            }
          }, function (err) {
            console.error('Error al obtener el box en archiveComponent');
            console.error(err);
          });
        }, function (err) {
          console.error('Error al obtener el inbox en archiveComponent');
          console.error(err);
        });
      }, function (error) {
        console.error(error);
      });

      return defer.promise;
    }




    _init();

    function _init() {

      let defer = $q.defer();


      profileFactory.getProfile().then(function (profile) {
        vm.profile = profile;
        ViewDocumentFactory.getCurrentDocumentASYNC().then(function (doc) {
          vm.currentDocument = doc;
          ViewDocumentFactory.getInbox().then(function (inbox) {
            ViewDocumentFactory.getBox().then(function (box) {
              vm.currentBoss = ExternalsFactory.getCurrentUser();
              vm.currentBox = box;
              vm.inbox = inbox;
              vm.imAuthor = vm.currentDocument.jobTitleID === vm.profile.jobTitleID;



              vm.fallUpon = true;
              if (vm.currentBox === 'internalIn' || vm.currentBox === 'externalIn') {
                vm.itsOutbox = false;
                validateInfo().then(function () {
                  defer.resolve();
                });
              } else {
                vm.itsOutbox = true;
                defer.resolve();
              }
            }, function (err) {
              console.error('Error al obtener el box en archiveComponent');
              console.error(err);
            });
          }, function (err) {
            console.error('Error al obtener el inbox en archiveComponent');
            console.error(err);
          });
        }, function (error) {
          console.error(error);
        });
      });



      return defer.promise;
    }

    function signDocument() {
      if (!vm.password) {
        SweetAlert.swal({
          title: '¡Error!',
          text: 'Se requiere contraseña',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });
      } else {
        vm.prossesing = true;
        var data = {
          password: vm.password,
        };
        inboxFactory.validatePassword(data, function (err, solve) {
          if (err) {
            vm.prossesing = false;
            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar'
            });
          } else {
            var info = null;
            if (vm.currentBox === 'externalIn') {
              info = {
                docID: vm.currentDocument.id,
                password: vm.password,
                uuid: vm.currentDocument.uuid,
                userJT: vm.currentBoss.jobTitleID,
                bossJT: vm.currentBoss.jobTitleID,
                inboxID: vm.inbox.id,
                bossID: vm.currentBoss.id
              };


              DocumentFactory.signLikeSecretary(info, function (err, result) {
                if (err) {
                  vm.prossesing = false;
                  console.error(err);
                } else {
                  paginatorFactory.refreshPage();
                  ViewDocumentFactory.sendReloadMessageViewInbox(true);
                  vm.inbox.needSign = false;
                  vm.prossesing = false;
                  SweetAlert.swal({
                    title: '¡Hecho!',
                    text: 'Firma agregada',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#DD2C57',
                    confirmButtonText: 'Aceptar',
                    timer: 1200
                  });
                }
              });
            } else {
              info = {
                docID: vm.currentDocument.id,
                password: vm.password,
                uuid: vm.currentDocument.uuid,
              };

              DocumentFactory.signOfRecive(info, function (err, result) {
                if (err) {
                  vm.prossesing = false;
                  console.error(err);
                } else {
                  paginatorFactory.refreshPage();
                  ViewDocumentFactory.sendReloadMessageViewInbox(true);
                  vm.inbox.needSign = false;
                  vm.prossesing = false;
                  SweetAlert.swal({
                    title: '¡Hecho!',
                    text: 'Firma agregada',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#DD2C57',
                    confirmButtonText: 'Aceptar',
                    timer: 1200
                  });
                }
              });
            }



          }
        });
      }

    }

    function rejectCancel() {
      if (!vm.password) {
        SweetAlert.swal({
          title: '¡Error!',
          text: 'Se requiere contraseña',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });
      } else {
        vm.prossesing = true;
        var data = {
          password: vm.password,
        };
        inboxFactory.validatePassword(data, function (err, solve) {
          if (err) {
            vm.prossesing = false;
            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar'
            });
          } else {
            var info = {
              rejectCancelMessage: vm.message,
              docID: vm.currentDocument.id,
              password: vm.password,
              uuid: vm.currentDocument.uuid,
              inboxID: vm.inbox.id
            };
            inboxFactory.rejectCancel(info, function (err, solve) {
              if (err) {
                SweetAlert.swal({
                  title: '¡Error!',
                  text: err.message,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#DD2C57',
                  confirmButtonText: 'Aceptar'
                });
                vm.loading = false;
                ViewDocumentFactory.sendReloadMessageViewInbox(true);
              } else {
                paginatorFactory.refreshPage();
                SweetAlert.swal({
                  title: '¡Hecho!',
                  text: 'Solicitud rechazada',
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#DD2C57',
                  confirmButtonText: 'Aceptar'
                });
                vm.loading = false;
                ViewDocumentFactory.sendReloadMessageViewInbox(true);
              }
            });
          }
        });
      }

    }

    function aceptCancel() {

      vm.prossesing = true;
      var data = {
        docID: vm.currentDocument.id,
        inboxID: vm.inbox.id
      };
      vm.loading = true;
      inboxFactory.aceptCancel(data, function (err, solve) {
        if (err) {
          SweetAlert.swal({
            title: '¡Error!',
            text: err.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar'
          });
          vm.loading = false;
          ViewDocumentFactory.sendReloadMessageViewInbox(true);
        } else {
          paginatorFactory.refreshPage();
          SweetAlert.swal({
            title: '¡Hecho!',
            text: 'Solicitud aceptada',
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar'
          });
          vm.loading = false;
          ViewDocumentFactory.sendReloadMessageViewInbox(true);
        }
      });






    }

    function validateInfo() {
      let defer = $q.defer();

      if (vm.currentBox === 'externalIn') {
        ExternalsFactory.validatePermision('changeStatus').then(function (can) {
          if (can) {

            if (!vm.inbox.readBySecretary || vm.inbox.readBySecretary === 0) {
              var data = {
                docID: vm.inbox.documentID,
                bossJT: vm.inbox.toJT,
                userID: vm.inbox.toID,
                inboxID: vm.inbox.id
              };
              DocumentFactory.secretaryMarkAsRead(data, function (err, success) {
                if (err) {
                  console.error(err);
                  defer.reject();
                } else {
                  ViewDocumentFactory.sendReloadMessageViewInbox(false);
                  defer.resolve();
                }
              });
            } else {
              defer.resolve();
            }
          }

        });
      } else {
        if (vm.inbox.isRead === 0) {
          var docID = vm.currentDocument.id;
          DocumentFactory.markAsRead(docID, function (err, success) {
            if (err) {
              console.error(err);
              defer.reject();
            } else {
              ViewDocumentFactory.sendReloadMessageViewInbox(false);
              defer.resolve();
            }
          });
        } else {
          defer.resolve();
        }
      }
      return defer.promise;
    }


    function changeStatus() {
      let defer = $q.defer();
      if (!vm.newStatus) {
        SweetAlert.swal({
          title: '¡Error!',
          text: 'Agrega toda la información',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar'
        });
        defer.reject();
      } else {
        vm.prossesing = true;
        if (!vm.message && vm.newStatus !== 'No procede') {
          vm.message = ' ';
        }
        var data = {
          docID: vm.currentDocument.id,
          status: vm.newStatus,
          message: vm.message,
          inboxID: vm.inbox.id,
        };
        inboxFactory.changeProcessStatus(data, function (err, resolve) {
          if (err) {
            vm.prossesing = false;
            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar'
            });
            defer.reject();
          } else {
            paginatorFactory.refreshPage();
            ViewDocumentFactory.sendReloadMessageViewInbox(false);
            vm.prossesing = false;
            SweetAlert.swal({
              title: '¡Hecho!',
              text: 'Estatus actualizado',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });
            vm.newStatus = null;
            vm.message = null;
            defer.resolve();
          }
        });
      }
      return defer.promise;
    }
  }

}());
