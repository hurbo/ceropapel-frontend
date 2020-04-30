(function () {
  'use strict';

  angular.module('app.chats').controller('chatsController', chatsController);
  chatsController.$inject = [];

  function chatsController() {
    var vm = this;


    activate();


  }
})();
