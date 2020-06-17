(function () {
  'use strict';

  angular
    .module('app.preloader')
    .directive('preloader', preloader);

  preloader.$inject = ['$rootScope', '$window', '$animate', '$timeout', '$q', 'profileFactory'];

  function preloader($rootScope, $window, $animate, $timeout, $q, Profile) {
    var directive = {
      restrict: 'EAC',
      template: '<div class="preloader-progress">' +
        '<div class="preloader-progress-bar" ' +
        'ng-style="{width: loadCounter + \'%\'}"></div>' +
        '</div>',
      link: link,
    };
    return directive;

    ///////
    function link(scope, el, attr) {
      scope.loadCounter = 0;
      var counter = 0,
        timeout;
      // disables scrollbar
      angular.element('body').css('overflow', 'hidden');
      // ensure class is present for styling
      el.addClass('preloader');

      appReady().then(function () {
        Profile.getProfile().then(function (profile) {
          endCounter();
        }).catch(function (err) {
          $window.location.reload();
        });
      });

      timeout = $timeout(startCounter);

      ///////
      function startCounter() {
        var remaining = 100 - counter;
        counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));
        scope.loadCounter = parseInt(counter, 10);
        timeout = $timeout(startCounter, 20);
      }

      function endCounter() {
        $timeout.cancel(timeout);
        scope.loadCounter = 100;
        $timeout(function () {
          // animate preloader hiding
          $animate.addClass(el, 'preloader-hidden');
          // retore scrollbar
          angular.element('body').css('overflow', '');
        }, 300);
      }

      function appReady() {
        var deferred = $q.defer();
        var viewsLoaded = 0;
        // Wait for app socket
        scope.$on('socket:connected', () => {
          $timeout(function () {
            deferred.resolve();
          }, 3000);
        });
        return deferred.promise;
      }
    } //link
  }

})();
