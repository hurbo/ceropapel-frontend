(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .config([
      '$compileProvider',
      function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
      }
    ])
    .controller('InternalMailViewController', InternalMailViewController);

  InternalMailViewController.$inject = [
    'ViewDocumentFactory',
    '$q',
    '$rootScope',
    'DocumentFactory',
    'EditorFactory'
  ];

  function InternalMailViewController(
    ViewDocumentFactory,
    $q,
    $rootScope,
    Doc,
    EditorFactory) {
    var vm = this;
    vm.needReload = false;
    vm.showAttachementSection = 'zip';
    vm.showFiles = showFiles;
    vm.isShowInAttachment = isShowInAttachment;
    vm.showPDF = showPDF;
    vm.refresh = refresh;
    vm.inbox = null;
    vm.clear = clear;

    function clear() {

      // swalFactory.error('No puedes editar el contenido');
      // _reload().then(function () {
      //   refresh();
      // });
    }


    activate();





    $rootScope.$on('watch-reload-view-inbox', function (event, data) {

      _reload().then(function () {

      });
    });


    $rootScope.$on('LoadViewDocumentFactory', function (event, data) {


    });



    function _reload() {
      let defer = $q.defer();

      vm.ViewFactory.init().then(function (solve) {
        vm.profile = vm.ViewFactory.getProfile();
        vm.document = vm.ViewFactory.getDocument();
        vm.inbox = vm.ViewFactory.getInbox().then(function (inbox) {
          vm.inbox = inbox;
          _getDisplay().then(function (solve) {
            defer.resolve();
          }, function (err) {
            console.error('Error al poner los datos iniciales');
            defer.reject(err);
          });
        }, function (err) {
          console.error('Error al obtener el inbox viewController');
          console.error(err);
        });

      }, function (err) {
        console.error("Error al iniciar el viewFactory desde documentViewController");
      });
      return defer.promise;
    }


    function refresh() {
      activate().then(function () {
        return;
      }, function (err) {
        console.error('Error en refresh');
        console.error(err);
      });
    }

    function activate() {

      vm.isLoading = true;
      let defer = $q.defer();


      vm.ViewFactory = ViewDocumentFactory;
      vm.ViewFactory.init().then(function (solve) {
        vm.profile = vm.ViewFactory.getProfile();
        vm.document = vm.ViewFactory.getDocument();
        vm.inbox = vm.ViewFactory.getInbox().then(function (inbox) {
          vm.inbox = inbox;
          vm.summernoteViewOptions = {
            lang: 'es-MX',
            height: 700,
            toolbar: [
              ['misc', ['print']]
            ],

            disableResizeEditor: true,
            contenteditable: false
          };
          $('#summernoteViewOptions').summernote(
            EditorFactory.getSummernoteViewOptions()
          );
          $('.summerNote-disabled+.note-editor .note-editable').attr('contenteditable', false)

          $rootScope.$broadcast('reloadCount', function(){
            console.log('call relload from internal view');
          });


          _getDisplay().then(function (solve) {
            vm.isLoading = false;
          }, function (err) {
            console.error('Error al poner los datos iniciales');
            defer.reject(err);
          });
        }, function (err) {
          console.error('Error al obtener el inbox viewController');
          console.error(err);
        });

        defer.resolve();
      }, function (err) {
        console.error("Error al iniciar el viewFactory desde documentViewController");
      });



      return defer.promise;
    }



    function _getDisplay() {
      let defer = $q.defer();
      $('#summernoteViewOptions').summernote('destroy');
      $('#summernoteViewOptions').summernote(
        EditorFactory.getSummernoteViewOptions()
      );

      vm.content = EditorFactory.getFullDisplay(vm.document);


      defer.resolve();
      return defer.promise;
    }

    function showFiles() {
      vm.showAttachementSection = 'loader';

      Doc.unzipFiles(vm.document.id).then(function (files) {
        vm.showAttachementSection = 'files';
        vm.files = files;

        if (vm.files.pdf.length === 1) {
          showPDF(vm.files.pdf[0]);
        }
      });
    }

    function showPDF(file) {
      window.open(file.downloadURL, '_blank');
    }

    function isShowInAttachment(section) {
      return section === vm.showAttachementSection;
    }





  }
})();
