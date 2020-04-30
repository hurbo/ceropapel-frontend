// A RESTful factory for retrieving inboxFactory from json file

(function () {
  'use strict';

  angular.module('app.mailbox')
    .factory('inboxFactory', inboxFactory);

  inboxFactory.$inject = ['socket'];

  function inboxFactory(socket) {

    return {
      aceptCancel: aceptCancel,
      rejectCancel: rejectCancel,
      changeProcessStatus: changeProcessStatus,
      getInfo: getInfo,
      getInfoExternal: getInfoExternal,
      forwardDocuments: forwardDocuments,

      multipleForwardDocuments: multipleForwardDocuments,
      newMultipleForwardDocuments: newMultipleForwardDocuments,
      getDocsByIds: getDocsByIds,
      multipleSign: multipleSign,
      validatePassword: validatePassword,
      multipleRead: multipleRead,
      multipleReadLikeSecretary: multipleReadLikeSecretary,
      multipleChangeStatus: multipleChangeStatus,
      multipleDelete: multipleDelete,
      confirmMultipleTurn: confirmMultipleTurn,
      multipleSendDocumentsByDrafts: multipleSendDocumentsByDrafts,
      requestCancelDocument: requestCancelDocument,
      cancelDocument: cancelDocument,
      validateDocs: validateDocs,
    };


    function aceptCancel(data, cb) {
      socket.emit('aceptCancel', data, cb);
    }

    function rejectCancel(data, cb) {
      socket.emit('rejectCancel', data, cb);
    }

    function cancelDocument(data, cb) {

      socket.emit('cancelDocument', data, cb);
    }

    function requestCancelDocument(data, cb) {

      socket.emit('requestCancelDocument', data, cb);
    }

    function multipleSendDocumentsByDrafts(data, cb) {

      socket.emit('multipleSendDocumentsByDrafts', data, cb);
    }

    function confirmMultipleTurn(data, cb) {

      socket.emit('confirmMultipleTurn', data, cb);
    }

    function changeProcessStatus(data, cb) {
      socket.emit('changeProcessStatus', data, cb);
    }

    function getInfo(data, cb) {
      socket.emit('getInfoOfInbox', data, cb);
    }

    function getInfoExternal(jt, docID, cb) {
      var data = {
        docID: docID,
        jobTitleID: jt
      };
      socket.emit('getInfoExternalInbox', data, cb);
    }

    function forwardDocuments(data, cb) {

      socket.emit('forwardDocuments', data, cb);
    }

    function multipleForwardDocuments(data, cb) {

      socket.emit('multipleForwardDocuments', data, cb);
    }

    function newMultipleForwardDocuments(data, cb) {

      socket.emit('newMultipleForwardDocuments', data, cb);
    }

    function getDocsByIds(data, cb) {

      socket.emit('getDocsByIds', data, cb);
    }

    function validateDocs(data, cb) {
      socket.emit('validateDocsWithMail', data, cb);
    }


    function multipleSign(data, cb) {

      socket.emit('multipleSign', data, cb);
    }

    function multipleRead(data, cb) {
      socket.emit('multipleRead', data, cb);
    }

    function multipleReadLikeSecretary(data, cb) {

      socket.emit('multipleReadLikeSecretary', data, cb);
    }

    function multipleDelete(data, cb) {
      socket.emit('multipleDelete', data, cb);
    }

    function multipleChangeStatus(data, cb) {
      socket.emit('multipleChangeStatus', data, cb);
    }

    function validatePassword(data, cb) {
      socket.emit('validatePassword', data, cb);
    }

  }
})();
