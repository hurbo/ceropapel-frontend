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
    'swalFactory'

  ];

  function draftViewController(
    $state,
    socket,
    $rootScope,
    composeFactory,
    templatesFactory,
    swalFactory
  ) {
    var vm = this;

    vm.templates = false;


    vm.selectTemplete = selectTemplete;
    vm.showListTemplates = showListTemplates;
    vm.closeListTemplates = closeListTemplates;

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
          vm.compose = composeFactory;

          if (err) {
            swalFactory.error('Error iniesperado');
            $state.go('app.mailbox.internal.drafts');
          }
          if (draft) {
            vm.compose.init(draft);
          } else {
            swalFactory.error('No se encontro el borrador');
            $state.go('app.mailbox.internal.drafts');
          }
        }
      );
    }


    function selectTemplete(item) {

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

      socket.emit('getTemplates', {}, function (error, data) {

        vm.templates = data;
      });


      vm.modalListTemplates = angular.element('#modalSelectTemplete').modal({
        backdrop: true,
        show: false
      });

      _getDraft();
      $rootScope.app.layout.isCollapsed = true;
    }
  }
})();
