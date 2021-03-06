(function () {
  'use strict';

  angular
    .module('app.sidebar')
    .controller('UserBlockController', UserBlockController);

  UserBlockController.$inject = ['$rootScope', '$scope'];

  function UserBlockController($rootScope, $scope) {

    activate();

    ////////////////

    function activate() {

      $rootScope.userBlockVisible = true;
      // Hides/show user avatar on sidebar
      $rootScope.toggleUserBlock = function () {
        $rootScope.$broadcast('toggleUserBlock');
      };
      var detach = $rootScope.$on('toggleUserBlock', function ( /*event, args*/ ) {

        $rootScope.userBlockVisible = !$rootScope.userBlockVisible;

      });
      $rootScope.toggleUserBlock();
      $scope.$on('$destroy', detach);
    }
  }
})();
