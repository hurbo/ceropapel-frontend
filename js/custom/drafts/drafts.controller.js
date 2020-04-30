(function () {
  'use strict';
  angular.module('app.drafts').controller('DraftsController', DraftsController);
  DraftsController.$inject = [
    '$state',
    'templatesFactory',
    'SweetAlert',
    'profileFactory',
    'draftsFactory'
  ];

  function DraftsController(
    $state,
    templatesFactory,
    SweetAlert,
    Profile,
    draftsFactory
  ) {
    var vm = this;

    vm.createTemplete = createTemplete;
    vm.isOnEditOrShow = isOnEditOrShow;
    vm.selectTemplate = selectTemplate;



    vm.clearData = clearData;

    vm.show = false;
    vm.template = {
      name: '',
      content: ''
    };
    vm.options = {
      height: 700,
      lang: 'es-MX',
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
    vm.clear = {
      height: 700,
      lang: 'es-MX',
      toolbar: [
        ['misc', ['print']]
      ],
      disableResizeEditor: true
    };

    function clearData() {
      vm.template = {
        name: '',
        content: ''
      };
    }

    function createTemplete() {
      if (vm.template.name === '') {

        SweetAlert.swal({
          title: '¡Error!',
          text: 'Agrega un nombre a la plantilla',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });
        return;
      }
      if (vm.template.content === '') {
        SweetAlert.swal({
          title: '¡Error!',
          text: 'Agrega contenido a la plantilla',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });
        return;
      }
      templatesFactory.createTemplete(vm.template, function (error, template) {
        vm.template = {
          name: '',
          content: ''
        };
        vm.templates.push(template);
        $state.go('app.templates');

        SweetAlert.swal({
          title: 'Hecho!',
          text: 'Nueva plantilla agregada',
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#253846',
          confirmButtonText: 'Aceptar',
          timer: 1000
        });
      });
    }

    function isOnEditOrShow() {
      if (
        'app.templates.show' === $state.current.name ||
        'app.templates.edit' === $state.current.name
      ) {
        return true;
      }
      return false;
    }

    function selectTemplate(id) {
      draftsFactory.getTemplate({
        _id: id
      }, function (error, data) {
        vm.template.content = data.content;
        vm.template.name = data.name;
      });
    }
    activate();

    function activate() {

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        draftsFactory.getTemplates.then(function (data) {
          vm.templates = data;

        });
      });

    }

  }
})();
