(function () {
  'use strict';

  angular
    .module('app.settings', ['app.environment'])
    .run(settingsRun);

  settingsRun.$inject = ['$rootScope', '$sce', '$localStorage', 'global', 'env'];

  function settingsRun($rootScope, $sce, $localStorage, global, env) {

    // Global Settings
    // -----------------------------------
    $rootScope.app = {
      baseUrl: env.BASE_URL,
      name: global.name,
      description: global.description,
      version: global.version,
      year: ((new Date()).getFullYear()),
      privacyDoc: env.PRIVACY_DOC,
      zendeskHost: env.ZENDESK_HOST,
      analyticsUrl: `https://www.googletagmanager.com/gtag/js?id=${env.ANALYTICS_CODE}`,
      layout: {
        isFixed: true,
        isCollapsed: false,
        isBoxed: false,
        isRTL: false,
        horizontal: false,
        isFloat: false,
        asideHover: false,
        theme: null,
        asideScrollbar: false
      },
      useFullLayout: false,
      hiddenFooter: false,
      offsidebarOpen: false,
      asideToggled: false,
      viewAnimation: 'ng-fadeInUp'
    };

    $rootScope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    // Setup the layout mode
    $rootScope.app.layout.horizontal = ($rootScope.$stateParams.layout === 'app-h');

    // Restore layout settings
    if (angular.isDefined($localStorage.layout))
      $rootScope.app.layout = $localStorage.layout;
    else
      $localStorage.layout = $rootScope.app.layout;

    $rootScope.$watch('app.layout', function () {
      $localStorage.layout = $rootScope.app.layout;
    }, true);

    // Close submenu when sidebar change from collapsed to normal
    $rootScope.$watch('app.layout.isCollapsed', function (newValue) {
      if (newValue === false)
        $rootScope.$broadcast('closeSidebarMenu');
    });
  }
})();
