(function () {
  'use strict';

  var Step = {
    FILL_DATA: 'FILL_DATA',
    FILL_SEND_DATA: 'FILL_SEND_DATA',
    REVIEW_DATA: 'REVIEW_DATA'
  };

  angular
    .module('app.mailbox')
    .controller('MailComposerController', MailComposerController);

  MailComposerController.$inject = [
    '$rootScope',
    'swalFactory',
    '$state',
    'composeFactory',
    'templatesFactory',
    'profileFactory',
    'paginatorFactory',
    'socket'
  ];

  function MailComposerController($rootScope, swalFactory, $state, composeFactory, templatesFactory, Profile, paginatorFactory, socket) {
    var vm = this;
    vm.templates = false;
    vm.compose = composeFactory;
    vm.step = Step.FILL_DATA;
    vm.StepEnum = Step;
    vm.selectTemplete = selectTemplete;
    vm.showListTemplates = showListTemplates;
    vm.closeListTemplates = closeListTemplates;
    vm.secretariats = [];
    vm.getTour = getTour;


    function getTour() {


      if (vm.step === 'FILL_DATA' && (!vm.compose.variables || vm.compose.variables.length === 0)) {
        return 1
      } else if (vm.step === 'FILL_DATA') {
        return 2
      } else if (vm.step === 'FILL_SEND_DATA') {
        return 3
      } else if (vm.step === 'REVIEW_DATA') {
        return 4
      }

    }





    vm.summernoteOptions = {
      lang: 'es-MX',
      height: 700,
      dialogsInBody: false,
      // airMode: true,
      FontName: 'Helvetica',
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

    vm.summernoteViewOptions = {
      lang: 'es-MX',
      FontName: 'Helvetica',
      height: 700,
      toolbar: [],
      disableResizeEditor: true
    };

    activate();

    function activate() {
      socket.emit("getTemplates", {}, function (error, data) {
        vm.templates = data;
      });

      vm.modalListTemplates = angular.element('#modalSelectTemplete').modal({ backdrop: true, show: false });

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (!vm.profile.jobTitleID) {
          swalFactory.error('No puedes acceder al contenido');
          $state.go('app.mailbox.internal.in');
          return;
        }
        vm.compose.init();
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });
    }

    function selectTemplete(id) {
      templatesFactory.getTemplateById(id).then(function (solve) {
        if (solve.content) {
          vm.compose.setTemplate(solve);
          // $('#botonCerrarSeleccionPlantilla').click();
          closeListTemplates();
          vm.selectedFormat = solve.fullContent;
        }
      });
    }

    function showListTemplates() {

      selectTemplete(291);
      vm.modalListTemplates.modal('show');

      setTimeout(function () {
        $('.modal-backdrop').remove();
      }, 1000);
    }

    function closeListTemplates() {
      vm.modalListTemplates.modal('hide');
    }

    vm.setStep = setStep;

    function setStep(step) {
      if (step === vm.StepEnum.FILL_SEND_DATA) {
        vm.compose.closePreviewTemplate();
      }
      vm.step = step;
    }






  }
})();


