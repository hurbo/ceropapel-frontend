// A RESTful factory for retrieving mailboxFactory from json file

(function () {
  'use strict';

  angular.module('app.mailbox').factory('mailboxFactory', mailboxFactory);

  mailboxFactory.$inject = ['$state', 'socket'];

  function mailboxFactory($state, socket) {
    var documentsIn = null;
    var documentsSent = null;
    var documentsArchived = null;

    var drafts = null;
    var changes = false;


    return {
      inDocuments: inDocuments,
      outDocuments: outDocuments,
      draftDocuments: draftDocuments,
      archiveDocuments: archiveDocuments,
      search: search,
      getInvolvedsByDocID: getInvolvedsByDocID
    };


    function getInvolvedsByDocID(ID, resolve) {
      socket.emit('getInvolvedsByDocID', ID, function (err, data) {
        resolve(err, data);
      });
    }

    function archiveDocuments() {
      socket.emit('getArchiveDocuments', {}, function (error, data) {
        documentsArchived = data;
      });
    }

    function inDocuments(page, cb) {
      // if (documentsIn !== null) {
      //   cb(null, documentsIn);
      // }
      // else {
      socket.emit(
        'getDocuments', {
          page: page
        },
        function (err, result) {
          if (!err) documentsIn = result.docs;
          cb(err, result);
        }
      );
      // }
    }

    function outDocuments(page, cb) {
      // if ( documentsSent !== null ) {
      //   cb( null, documentsSent );
      // }
      // else {
      socket.emit(
        'getSentDocuments', {
          page: page
        },
        function (error, result) {
          if (!error) documentsSent = result.docs;
          cb( error, documentsSent);
        }
      );
      // }
    }

    function draftDocuments(cb) {
      // if ( drafts !== null ) {
      //   cb( null, drafts );
      // }
      // else {

      socket.emit('getDraftDocuments', {}, function (error, data) {
        drafts = data;
        cb(error, drafts);
      });
      // }
    }

    function search(query, cb) {
      socket.emit(
        'searchDocuments', {
          query: query
        },
        function (err, result) {
          cb(err, result);
        }
      );
    }
  }
})();
