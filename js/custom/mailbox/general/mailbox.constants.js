(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .constant('DOCUMENT_STATUS_LIST', [
      'Recibido', 'En proceso', 'Atendido satisfactoriamente', 'De conocimiento', 'No procede'
    ])

    .constant('MAIL_ACTIONS_LIST', [
      'Turnar',
      'Leer',
      'Cambiar estatus',
      'Archivar',
      'Firmar'
    ])

    .constant('DEFAULT_STATUS_LIST', {
      'unread': 'Sin leer',
      'read': 'Leído',
      'rejected': 'Rechazado',
      'signed': 'Recibido'
    });

})();
