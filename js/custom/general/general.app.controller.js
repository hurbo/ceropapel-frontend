(function () {
  'use strict';
  angular.module('app.general').controller('AppController', AppController);

  AppController.$inject = ['$scope'];

  function AppController($scope) {
    var vm = this;

    activate();

    function activate() {
      var section = angular.element('.wrapper > section');
      section.css({
        position: 'static'
      });
      // finally restore on destroy and reuse the value declared in stylesheet
      $scope.$on('$destroy', function () {
        section.css({
          position: ''
        });
      });
    }
  }
})();
