(function () {
  'use strict';

  angular.module('app.mailbox', ['ng-nestable','ui.bootstrap','nzTour'])
    .filter('trusted', function ($sce) {
      return function (html) {
        return $sce.trustAsHtml(html);
      };
    });
})();
