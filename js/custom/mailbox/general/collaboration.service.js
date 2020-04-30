// A RESTful factory for retrieving mails from json file

(function () {
  'use strict';

  angular.module('app.mailbox').service('CollaborationFactory', CollaborationFactory);

  CollaborationFactory.$inject = [];

  function CollaborationFactory() {

    return {
      imCollaborator: imCollaborator,
      isMyTurnToSign: isMyTurnToSign
    };

    function imCollaborator(doc, jt) {
      var inCollaboration = false;
      for (var i = 0; i < doc.to.length; i++) {
        var to = doc.to[i];
        if (to.inColaboration && to.toJT === jt) {
          inCollaboration = true;
          break;
        }
      }
      return inCollaboration;
    }

    function isMyTurnToSign(doc, jt) {
      var isMyTurn = false;
      for (var i = 0; i < doc.to.length; i++) {
        var to = doc.to[i];
        if (to.inColaboration && !to.signed && to.toJT === jt) {
          if (i === 0) {
            isMyTurn = true;
          } else {
            if (doc.to[i - 1].inColaboration && doc.to[i - 1].signed) {
              isMyTurn = true;
            }
          }
          break;
        }
      }
      return isMyTurn;
    }

  }
})();
