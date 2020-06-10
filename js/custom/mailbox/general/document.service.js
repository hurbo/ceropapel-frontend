// A RESTful factory for retrieving mails from json file

(function () {
  'use strict';

  angular.module('app.mailbox').service('DocumentFactory', DocumentFactory);

  DocumentFactory.$inject = ['socket', '$q', 'File', 'swalFactory'];

  function DocumentFactory(socket, $q, File, swalFactory) {
    var doc;

    return {
      get: get,
      info: info,
      create: create,
      getSignatures: getSignatures,
      setInitialSigned: setInitialSigned,

      downloadFile: downloadFile,
      unzipFiles: unzipFiles,
      canIChangeVisibilityTurned: canIChangeVisibilityTurned,
      changeVisibilityTurned: changeVisibilityTurned,
      simpleCancel: simpleCancel,
      fixWhitoutPermissions: fixWhitoutPermissions,
      saveChanges: saveChanges,
      markAsRead: markAsRead,
      signOfRecive: signOfRecive,
      signLikeSecretary: signLikeSecretary,
      secretaryMarkAsRead: secretaryMarkAsRead,
      turn: turn,
      reject: reject,
      rejectLikeSecretary: rejectLikeSecretary,
      requestCancel: requestCancel,
      aceptCancel: aceptCancel,
      rejectCancel: rejectCancel,
      requestEdit: requestEdit,
      aceptEdit: aceptEdit,
      rejectEdit: rejectEdit,
      getInboxByID: getInboxByID
    };

    function get(docID, cb) {
      socket.emit('getDocument', {
        _id: docID
      }, function (err, docu) {
        doc = docu;
        cb(err, doc);
      });
    }

    function getInboxByID(inboxID, cb) {
      if (!inboxID) {
        return cb({
          message: 'Informacion insuficiente'
        }, null);
      }
      socket.emit('getInboxByID', {
        id: inboxID
      }, function (err, inbox) {
        return cb(err, inbox);
      });
    }

    function info() {
      return doc;
    }



    function downloadFile(docID, cb) {

      socket.emit('downloadFiles', {
        _id: docID
      }, function (err, file) {
        cb(err, file);
      });
    }

    function unzipFiles(docID) {

      var defer = $q.defer();
      downloadFile(docID, function (err, file) {
        if (err) {
          defer.reject(err);
        } else {
          File.unzip(file).then(
            function (files) {
              defer.resolve(files);
            },
            function (err) {
              defer.reject(err);
            }
          );
        }
      });

      return defer.promise;
    }

    function canIChangeVisibilityTurned(profile) {
      if (!doc || !profile) return false;
      var found = false;
      for (var i = 0; i < doc.to.length; i++) {
        if (doc.to[i].email === profile.email && doc.to[i].original)
          found = true;
      }
      return found;
    }

    function changeVisibilityTurned() {
      if (doc) {
        socket.emit('changeVisibilityTurnedOfDocument', {
          document: doc._id,
          publicTurned: !doc.publicTurned
        }, function (err, result) {
          if (!err) doc.publicTurned = result.publicTurned;
        });
      }
    }

    function simpleCancel(docID, cancelMessage, uuid, password, cb) {
      var data = {
        uuid: uuid,
        docID: docID,
        password: password,
        cancelMessage: cancelMessage,
      };
      socket.emit('cancelDocument', data, cb);
      // cb({message:'No implementado'});
    }

    function fixWhitoutPermissions(docID, message, cb) {
      socket.emit('empyChanges', {
        docID: docID,
        message: message
      }, cb);
    }

    function saveChanges(docID, content, cb) {
      socket.emit('saveChanges', {
        docID: docID,
        content: content
      }, cb);
    }

    function markAsRead(docID, cb) {
      socket.emit('markAsReadDocument', {
        docID: docID
      }, function (err, result) {
        if (err) {
          swalFactory.error(err.message);
        }
        if (cb) {
          cb(err, result);
        }
      });
    }

    function secretaryMarkAsRead(data, cb) {

      socket.emit('secretarymarkAsReadDocument', data, function (err, result) {
        if (err) {
          swalFactory.error(err.message);
        }
        if (cb) {
          cb(err, result);
        }
      });
    }

    function signOfRecive(data, cb) {

      socket.emit('signOfRecive', data, function (err, result) {
        if (err) {
          swalFactory.error(err.message);
        }
        if (cb) {
          cb(err, result);
        }
      });
    }

    function signLikeSecretary(data, cb) {

      socket.emit('signOfReciveLikeSecretary', data, function (err, result) {
        if (err) {
          swalFactory.error(err.message);
        }
        if (cb) {
          cb(err, result);
        }
      });
    }

    function create(data, cb) {

      socket.emit('createDocument', data, cb);
    }

    function getSignatures(data, cb) {
      socket.emit('getSignatures', data, cb);
    }

    function setInitialSigned(data, cb) {
      socket.emit('setInitialSigned', data, cb);
    }

    function turn(docID, forwards, trackingMessage, trackingReason, cb) {
      var data = {
        docID: docID,
        forwards: forwards,
        trackingMessage: trackingMessage,
        trackingReason: trackingReason,
      };
      socket.emit('forwardDocuments', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });

    }

    function reject(data, cb) {

      socket.emit('rejectDocument', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });

    }

    function rejectLikeSecretary(data, cb) {
      socket.emit('rejectDocumentLikeSecretary', data, cb);
    }

    function requestCancel(docID, cancelMessage, cb) {
      var data = {
        docID: docID,
        cancelMessage: cancelMessage,
      };
      socket.emit('requestCancelDocument', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });
    }

    function aceptCancel(docID, cb) {
      var data = {
        docID: docID,
      };
      socket.emit('aceptCancel', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });
    }

    function rejectCancel(docID, rejectCancelMessage, cb) {
      var data = {
        docID: docID,
        rejectCancelMessage: rejectCancelMessage
      };
      socket.emit('rejectCancel', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });
    }

    function requestEdit(docID, editMessage, cb) {
      var data = {
        docID: docID,
        editMessage: editMessage
      };
      socket.emit('requestChanges', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });
    }

    function aceptEdit(docID, cb) {
      var data = {
        docID: docID,
      };
      socket.emit('aceptChanges', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });
    }

    function rejectEdit(docID, message, cb) {
      var data = {
        docID: docID,
        rejectEditMessage: message
      };

      socket.emit('rejectChanges', data, function (err, result) {
        if (err) swalFactory.error(err.message);

        cb(err, result);
      });
    }

  }
})();
