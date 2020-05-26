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
    'swalFactory',
    '$state',
    'composeFactory',
    'profileFactory'
  ];

  function MailComposerController( swalFactory, $state, composeFactory, Profile) {
    var vm = this;
    vm.templates = false;
    vm.compose = composeFactory;
    vm.step = Step.FILL_DATA;
    vm.StepEnum = Step;
    vm.getTour = getTour;
    vm.setStep = setStep;


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
      console.log("aqui estoy en el compose controller");
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (!vm.profile.jobTitleID) {
          swalFactory.error('No puedes acceder al contenido');
          $state.go('app.profile');
          return;
        }
          vm.compose.init();
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });
    }
    function setStep(step) {
      if (step === vm.StepEnum.FILL_SEND_DATA) {
        vm.compose.closePreviewTemplate();
      }
      vm.step = step;
    }
  }
})();


