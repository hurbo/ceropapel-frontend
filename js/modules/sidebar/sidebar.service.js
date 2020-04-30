(function () {
  'use strict';

  angular
    .module('app.sidebar')
    .service('SidebarLoader', SidebarLoader);

  SidebarLoader.$inject = ['socket'];

  function SidebarLoader(socket) {
    this.getMenu = getMenu;


    function getMenu(onReady, onError) {
      onError = onError || function () {
        alert('Failure loading menu');
      };
      socket.emit('getMenu', {}, function (err, menu) {
        if (err) {
          onError(err);
        } else {
          onReady(menu);
        }
      });
    }
  }
})();
