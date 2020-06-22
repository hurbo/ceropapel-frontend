(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .controller('draftViewController', draftViewController);

  draftViewController.$inject = [
    '$state',
    'socket',
    '$rootScope',
    'composeFactory',
    'templatesFactory',
    'swalFactory',
    'profileFactory'

  ];



  function draftViewController(
    $state,
    socket,
    $rootScope,
    composeFactory,
    templatesFactory,
    swalFactory,
    profileFactory
  ) {
    var vm = this;

    var Step = {
      FILL_DATA: 'FILL_DATA',
      FILL_SEND_DATA: 'FILL_SEND_DATA',
      REVIEW_DATA: 'REVIEW_DATA'
    };

    vm.StepEnum = Step;
    vm.templates = false;
    vm.profile = null;


    vm.selectTemplete = selectTemplete;
    vm.showListTemplates = showListTemplates;
    vm.closeListTemplates = closeListTemplates;

    vm.getTour = getTour;
    vm.setStep = setStep;

    function setStep(step) {
      if (step === vm.StepEnum.FILL_SEND_DATA) {
        vm.compose.closePreviewTemplate();
      }
      vm.step = step;
    }

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
      defaultFontName: 'Helvetica',
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
      defaultFontName: 'Helvetica',
      height: 700,
      toolbar: [],
      disableResizeEditor: true
    };

    activate();



    function _getDraft() {








      socket.on('draft-remove-' + $state.params.id, function () {
        $state.go('app.mailbox.internal.drafts');
      });
      socket.emit(
        'getDocument', {
          _id: $state.params.id
        },
        function (err, draft) {
          console.log("Draft view ", draft);
          draft.values = JSON.parse(draft.templateVariableValues);
          draft.variableValues = JSON.parse(draft.templateVariableValues);
          console.log("Estos son los datos", draft.values);

          templatesFactory.getTemplateById(draft.templateID).then(function (template) {

            draft.template = template;
            vm.compose = composeFactory;
            if (err) {
              swalFactory.error('Error iniesperado');
              $state.go('app.mailbox.internal.drafts');
            }
            if (draft) {
              vm.compose.init(draft);
              vm.step = 'FILL_DATA';
            } else {
              swalFactory.error('No se encontro el borrador');
              $state.go('app.mailbox.internal.drafts');
            }




          });




        }
      );
    }


    function selectTemplete(item) {
      console.log("Draft view selectTemplete ");
      templatesFactory.getTemplateById(item._id).then(function (solve) {
        if (solve.content) {
          // $('#botonCerrarSeleccionPlantilla').click();
          closeListTemplates();
          vm.selectedFormat = solve.content;
        }
      });
    }

    function showListTemplates() {
      vm.modalListTemplates.modal('show');
    }

    function closeListTemplates() {
      vm.modalListTemplates.modal('hide');
    }



    function activate() {
      profileFactory.getProfile().then(profile => {
        vm.profile = profile;
        _getDraft();
      })

    }
  }
})();
