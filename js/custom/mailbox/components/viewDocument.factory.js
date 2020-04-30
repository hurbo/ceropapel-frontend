(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .factory('ViewDocumentFactory', ViewDocumentFactory);

  ViewDocumentFactory.$inject = [
    'socket',
    '$q',
    '$state',
    'profileFactory',
    'mailboxFactory',
    'DocumentFactory',

    'ExternalsFactory',
    '$rootScope'
  ];




  function ViewDocumentFactory(socket,
    $q,
    $state,
    Profile,
    BOX,
    DocumentFactory,

    Externals,
    $rootScope) {
    var currentDocumentID = null;
    var currentInboxID = null;
    var currentBox = null;
    var currentImage = null;
    var currentInbox = null;
    var currentBoss = null;
    var currentProfile = null;
    var isExternal = null;
    var currentDocument = null;
    var involveds = null;
    var canTurn = null;
    var loading = true;
    var requireSign = null;

    var fallUpon = false;
    var selectedFolder = null;

    var _showArchive = null;

    socket.on('refresh-document-' + $state.params.mid, function () {
      sendReloadMessageViewInbox(false);
    });


    return {
      init: init,
      getCurrentDocument: getCurrentDocument,
      iCanTurn: iCanTurn,

      getProfile: getProfile,
      getInvolveds: getInvolveds,
      getInbox: getInbox,
      getDocument: getDocument,
      loading: isLoading,
      emitRefreshDocument: emitRefreshDocument,
      reload: reload,
      setSelectedFolder: setSelectedFolder,
      getSelectedFolder: getSelectedFolder,
      isFolderSelected: isFolderSelected,
      showArchive: showArchive,
      toggleViewArchive: toggleViewArchive,
      getCurrentDocumentASYNC: getCurrentDocumentASYNC,
      sendReloadMessageViewInbox: sendReloadMessageViewInbox,
      getCurrentImage: getCurrentImage,
      setCurrentImage: setCurrentImage,
      getBox: getBox
    };




    function getBox() {
      let defer = $q.defer();
      defer.resolve(currentBox);
      return defer.promise;
    }


    function getCurrentImage() {
      let defer = $q.defer();
      defer.resolve(currentImage);
      return defer.promise;
    }

    function setCurrentImage(image) {
      currentImage = image;
    }


    function sendReloadMessageViewInbox(global) {

      if (global) {
        reload().then(function () {
          $rootScope.$broadcast('watch-reload-view-inbox', true);
          socket.emit('refresh-document', $state.params.mid);
        });
      } else {
        reload().then(function () {
          $rootScope.$broadcast('watch-reload-view-inbox', true);
        });
      }

    }






    function toggleViewArchive(value) {
      console.error();
      _showArchive = value;
    }



    function showArchive() {
      switch ($state.current.name) {
        case 'app.mailbox.internal.in.view':
          return currentInbox.archived === 1;
        case 'app.mailbox.internal.out.view':
          return currentInbox.archivedOut === 1;
        case 'app.mailbox.external.in.view':
          return currentInbox.archived === 1;
        case 'app.mailbox.external.out.view':
          return currentInbox.archivedOut === 1;
      }
    }






    function setSelectedFolder(folder) {
      selectedFolder = folder;
    }

    function getSelectedFolder() {
      return selectedFolder;
    }

    function isFolderSelected() {
      if (selectedFolder && selectedFolder.id) {
        return true;
      } else {
        return false;
      }
    }




    function emitRefreshDocument() {

      console.error('refresh-document-' + currentDocument.id);
      socket.emit('callRefreshDocument', {
        id: currentDocument.id
      }, function () {

      });
    }

    function _clean() {
      currentDocumentID = null;
      currentInboxID = null;



      loading = true;
      currentInbox = null;
      currentBoss = null;
      currentProfile = null;
      isExternal = null;
      currentDocument = null;
      involveds = null;
      canTurn = null;
      selectedFolder = null;

      requireSign = null;

    }




    function _setInternalIn() {
      let defer = $q.defer();
      _setCurrentDocument().then(function (document) {
        _setInvolveds().then(function () {
          _setInbox().then(function () {
            if (currentInbox.toJT === currentProfile.jobTitleID) {
              fallUpon = true;
              currentBox = 'internalIn';
              loading = false;
              $rootScope.$broadcast('LoadViewDocumentFactory');
              defer.resolve(document);
            } else {
              fallUpon = false;
              defer.reject('Este oficio no te corresponde');
            }
          }, function (err) {
            defer.reject(err);
          });
        }, function (err) {
          defer.reject(err);
        });
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }

    function _setInternalOut() {
      let defer = $q.defer();
      _setCurrentDocument().then(function (document) {
        _setInvolveds().then(function () {
          _setInbox().then(function () {
            if (currentInbox.fromJT === currentProfile.jobTitleID) {
              fallUpon = true;
              currentBox = 'internalOut';
              loading = false;
              $rootScope.$broadcast('LoadViewDocumentFactory');
              defer.resolve(document);
            } else {
              fallUpon = false;
              defer.reject('Este oficio no te corresponde');
            }
          }, function (err) {
            defer.reject(err);
          });
        }, function (err) {
          defer.reject(err);
        });
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }


    function _setExternalIn() {
      let defer = $q.defer();
      currentBoss = Externals.getCurrentUser();

      if (!currentBoss) {
        console.error('No hay jefe actual');
        defer.reject();
      } else {
        Externals.validatePermision('readIn').then(function (can) {
          if (can) {
            _setCurrentDocument().then(function (document) {
              _setInvolveds().then(function () {
                _setInbox().then(function () {

                  if (currentInbox.toJT === currentBoss.jobTitleID) {
                    fallUpon = true;
                    currentBox = 'externalIn';
                    loading = false;
                    $rootScope.$broadcast('LoadViewDocumentFactory');
                    defer.resolve(document);
                  } else {
                    fallUpon = false;
                    defer.reject('Este oficio no te corresponde');
                  }
                }, function (err) {
                  defer.reject(err);
                });
              }, function (err) {
                defer.reject(err);
              });
            }, function (err) {
              defer.reject(err);
            });
          } else {
            defer.reject();
          }
        });
      }
      return defer.promise;
    }

    function _setExternalOut() {
      let defer = $q.defer();
      currentBoss = Externals.getCurrentUser();

      if (!currentBoss) {
        defer.reject();
      } else {
        Externals.validatePermision('readOut').then(function (can) {
          if (can) {
            _setCurrentDocument().then(function (document) {
              _setInvolveds().then(function () {
                _setInbox().then(function () {
                  if (currentInbox.fromJT === currentBoss.jobTitleID) {
                    fallUpon = true;
                    currentBox = 'externalOut';
                    loading = false;
                    $rootScope.$broadcast('LoadViewDocumentFactory');
                    defer.resolve(document);
                  } else {
                    fallUpon = false;
                    defer.reject('Este oficio no te corresponde');
                  }
                }, function (err) {
                  defer.reject(err);
                });
              }, function (err) {
                defer.reject(err);
              });
            }, function (err) {
              defer.reject(err);
            });
          } else {
            console.error('No tienes permisos para ver la bandeja de recibidos');
            defer.reject();
          }
        });
      }
      return defer.promise;
    }











    function init() {
      let defer = $q.defer();

      _clean();
      Profile.getProfile().then(function (profile) {
        currentProfile = profile;
        currentDocumentID = $state.params.mid;
        currentInboxID = $state.params.inboxID;
        switch ($state.current.name) {
          case 'app.mailbox.internal.in.view':
            _setInternalIn().then(function () {
              defer.resolve();
            });

            break;
          case 'app.mailbox.internal.out.view':
            _setInternalOut().then(function () {
              defer.resolve();
            });
            break;
          case 'app.mailbox.external.in.view':
            _setExternalIn().then(function () {
              defer.resolve();
            });
            break;
          case 'app.mailbox.external.out.view':
            _setExternalOut().then(function () {
              defer.resolve();
            });
            break;
        }
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }




    function reload() {
      let defer = $q.defer();
      init().then(function () {
        defer.resolve();
      });
      return defer.promise;
    }








    function isLoading() {
      return loading;
    }

    function iCanTurn() {
      if (currentDocument && currentProfile && currentDocument.jobTitleID === currentProfile.jobTitleID) {
        canTurn = true;
        return true;
      } else if (canTurn === null && currentInbox !== null) {
        if (isExternal) {
          Externals.validatePermision('turn', function (err, permission) {
            if (currentInbox.needSign === 0 && permission) {

              canTurn = true;
              requireSign = false;
              return canTurn;
            } else if (currentInbox.needSign === 1 && currentInbox.signed === 1 && permission) {

              requireSign = true;
              canTurn = true;
              return canTurn;
            } else if (currentInbox.needSign === 1 && currentInbox.signed === 0 && permission) {

              requireSign = true;
              canTurn = false;
              return canTurn;
            }
          });
        } else {
          if (currentInbox.needSign === 0) {

            canTurn = true;
            requireSign = false;
            return canTurn;
          } else if (currentInbox.needSign === 1 && currentInbox.signed === 1) {

            requireSign = true;
            canTurn = true;
            return canTurn;
          } else if (currentInbox.needSign === 1 && currentInbox.signed === 0) {

            requireSign = true;
            canTurn = false;
            return canTurn;
          }
        }




      } else {
        return canTurn;
      }
    }


    function _setCurrentDocument() {
      let defer = $q.defer();
      DocumentFactory.get($state.params.mid, function (err, document) {
        if (err) {
          defer.reject(err);
        } else {
          currentDocument = document;
          defer.resolve(document);
        }
      });
      return defer.promise;
    }

    function _setInbox() {
      let defer = $q.defer();


      DocumentFactory.getInboxByID($state.params.inboxID, function (err, inbox) {
        if (err) {
          defer.reject(err);
        } else {
          currentInbox = inbox;
          defer.resolve(inbox);
        }
      });

      return defer.promise;
    }







    function getProfile() {
      return currentProfile;
    }

    function getInvolveds() {
      let defer = $q.defer();
      if (involveds) {
        defer.resolve(involveds);
      } else {
        _setInvolveds().then(function (involveds) {
            defer.resolve(involveds);
          },
          function (err) {
            console.error('Error en getInvolveds/_setInvolveds');
            console.error(err);
          });
      }
      return defer.promise;

    }




    function getInbox() {
      let defer = $q.defer();
      if (currentInbox) {
        defer.resolve(currentInbox);
      } else {
        _setInbox().then(function (inbox) {
          defer.resolve(inbox);
        }, function (err) {
          defer.reject(err);
        });
      }
      return defer.promise;
    }




    function getDocument() {
      return currentDocument;
    }

    function _setInvolveds() {

      let defer = $q.defer();

      BOX.getInvolvedsByDocID($state.params.mid, function (err, solve) {
        if (err) {
          defer.reject(err);
        } else {
          involveds = solve;
          defer.resolve(involveds);
        }
      });


      return defer.promise;
    }

    function getCurrentDocumentASYNC() {
      let defer = $q.defer();
      if (currentDocument) {
        defer.resolve(currentDocument);
      } else {
        _setCurrentDocument().then(function (document) {
          currentDocument = document;
          defer.resolve(currentDocument);
        });
      }
      return defer.promise;
    }




    function getCurrentDocument() {

      if (currentDocument) {
        return currentDocument;
      } else {

        _setCurrentDocument().then(function (document) {
          currentDocument = document;
          return currentDocument;
        });
      }
    }
  }

}());