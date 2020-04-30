(function () {
  'use strict';

  angular.module('app.mailbox').service('EditorFactory', EditorFactory);

  EditorFactory.$inject = ['$filter'];

  function EditorFactory($filter) {

    return {
      getSummernoteViewOptions: getSummernoteViewOptions,
      getSummernoteEditOptions: getSummernoteEditOptions,
      getFullDisplay: getFullDisplay
    };


    function getSummernoteViewOptions() {
      return {
        lang: 'es-MX',
        height: 700,
        toolbar: [
          ['misc', ['print']]
        ],

        disableResizeEditor: true,
        contenteditable: false,
        disableEditor: true
      };
    }

    function getSummernoteEditOptions() {
      return {
        lang: 'es-MX',
        height: 700,
        dialogsInBody: false,
        toolbar: [
          ['edit', ['undo', 'redo']],
          ['headline', ['style']],
          [
            'style',
            [
              'bold',
              'italic',
              'underline',
              'superscript',
              'subscript',
              'strikethrough',
              'clear'
            ]
          ],
          ['fontface', ['fontname']],
          ['textsize', ['fontsize']],
          ['fontclr', ['color']],
          ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
          ['height', ['height']],
          ['table', ['table']],
          ['insert', ['link', 'picture']],
          ['view', ['fullscreen', 'codeview']]
        ],
        disableResizeEditor: true
      };
    }

    function getFullDisplay(doc) {
      if (!doc) {

        return "";
      }
      var display =
        '<div class="media-box-body clearfix" style=" border-style: hidden; right: 0;bottom: 0;left: 0;padding: 1rem;text-align: left; margin-top: 85%;">';
      var auxDate = $filter('date')(doc.createdAt, "dd-MM-yyyy");




      display +=



        '<div><strong style="font-size: small; font-family: "Poppins-Medium" !important;">Enviado por: </strong><strong style= "" class="media-box-heading text-primary" >' +
        doc.from.name +
        " < " +
        doc.from.email +
        " > " +
        "</strong><p class='mb-sm'><strong style='font-size: small;'>Certificado: </strong><small style='font-size: xx-small; word-break: break-all'> " +
        doc.noCertificado +
        " </small></p><p class='mb-sm'><strong style='font-size: small;'>Hash: </strong><small style='word-break: break-all; font-size: xx-small;'> " +
        doc.hash +
        " </small></p><p class='mb-sm'><strong style='font-size: small;'>Fecha de emisión: </strong><small style=' font-size: xx-small; word-break: break-all'> " +
        auxDate +
        " </small></p><p><p></div>";

      for (var i = 0; i < doc.to.length; i++) {
        console.table(doc.to[i]);
        if (doc.to[i].needSign) {
          var name = doc.to[i].name + " ";
          var address = " < " + doc.to[i].email + " > ";

          if (doc.to[i].signed) {
            var d = new Date(doc.to[i].signedAt).toISOString().substring(0, 10);
            // var d = null;
            var cer = doc.to[i].noCertificado;
            var hash = doc.to[i].hash;
          }

          if (!doc.to[i].signed && doc.to[i].rejected !== 1) {
            var d = 'No ha firmado';
            var cer = 'No ha firmado';
            var hash = 'No ha firmado';
          }

          if (doc.to[i].reject === 1) {
            var d = 'Fue rechazado';
            var cer = 'Fue rechazado';
            var hash = 'Fue rechazado';
          }


          var clerkMessage = '';
          if (doc.to[i].signBySecretary == 1) {
            clerkMessage += "</br><strong style='color: #e2466a'>Firmado por asistente:</strong><p class='mb-sm'><strong style='font-size: small;'>Asistente: </strong><small style='word-break: break-all; font-size: xx-small;'> " + doc.to[i].secretaryName + "<" + doc.to[i].secretaryEmail + ">" + "</small>"
          }


          var mensajeTurnado = '';
          var message = "";
          if (doc.to[i].trackingReason !== '') {
            message = doc.to[i].trackingReason + " : " + doc.to[i].trackingMessage;
            mensajeTurnado += "</br><strong style='color: #e2466a'>Detalles de turnado:</strong><p class='mb-sm'><strong style='font-size: small;'>Tipo de turnado: </strong><small style='word-break: break-all; font-size: xx-small;'> " + message + "</small>"
          }




          display +=
            "<div style='border-style: hidden; margin: 10px;padding: 8px;'><strong class='media-box-heading text-primary' style='text-transform: capitalize;' >" +
            name +
            '</strong><strong>' +
            address +
            clerkMessage +
            mensajeTurnado +
            "</strong><p class='mb-sm'><strong style='font-size: small;'>Certificado: </strong><small style='word-break: break-all; font-size: xx-small;'> " +
            cer +
            " </small></p><p class='mb-sm'><strong style='font-size: small;'>Hash: </strong><small style='word-break: break-all; font-size: xx-small;'> " +
            hash +
            " </small></p><p class='mb-sm'><strong style='font-size: small;'>Fecha de firma: </strong><small style='word-break: break-all; font-size: xx-small;'> " +
            d +
            ' </small></p></div>'
            ;
        }
      }
      display += '</div>';

      return doc.content + display;
    }
  }
})();
