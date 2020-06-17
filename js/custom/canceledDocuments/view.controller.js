(function () {
  'use strict';

  angular
    .module('app.canceledDocuments')
    .controller('canceledViewController', canceledViewController);

  canceledViewController.$inject = [
    'socket',
    '$state',
    '$rootScope'
  ];

  function canceledViewController(
    socket,
    $state,
    $rootScope
  ) {
    var vm = this;


    activate();

    function activate() {

      _getDocument();


      vm.summernoteViewOptions = {
        lang: 'es-MX',
        height: 700,
        defaultFontName: 'Helvetica',
        toolbar: [
          ['misc', ['print']]
        ],
        editable: false,

        disableResizeEditor: true,
        contenteditable: false
      };

      $('#summernoteViewOptions').summernote(vm.summernoteViewOptions);
      $('.summerNote-disabled+.note-editor .note-editable').attr('contenteditable', false)


      vm.prossesingLoad = true;

    }

    function _getDocument() {
      vm.prossesing = true;

      socket.emit('getDocument', {
        id: $state.params.mid
      }, function (
        err,
        data
      ) {
        if (!data) {
          vm.prossesing = true;
          return;
        }


        vm.content = data.content;
        vm.document = data;
      });
      vm.prossesing = false;
    }
  }
})();
