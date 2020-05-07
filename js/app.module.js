// /*!
//  *
//  * Angle - Bootstrap Admin App + AngularJS Material
//  *
//  * Version: 3.3.1
//  * Author: @themicon_co
//  * Website: http://themicon.co
//  * License: https://wrapbootstrap.com/help/licenses
//  *
//  */

// import * as Sentry from '@sentry/browser';
// import * as Integrations from '@sentry/integrations';

// Sentry.init({
//     dsn: 'https://19b343fab6d7490296e2e8cf57d216ae@sentry.io/2015386',
//     integrations: [
//       new Integrations.Angular(),
//     ],
//   });

(function () {
  'use strict';

  var app = angular.module('angle', [
    'app.core',
    'app.routes',
    'app.auth',
    'app.navbar',
    'app.sidebar',
    'app.preloader',
    'app.loadingbar',
    'app.translate',
    'app.settings',
    'app.utils',
    'app.sockets',
    'app.general',
    'app.swal',
    'app.notifications',
    'app.profile',
    'app.templates',
    'app.info',
    'app.secretariats',
    'app.jobTitles',
    'app.usersJobs',
    'app.canceledDocuments',
    'app.drafts',
    // 'app.develop',
    'app.groups',
    'app.mailbox',
    'app.chats',
    // External Modules
    'ngIdle',
    'nzTour',
    'summernote',
    'ngTagsInput',
    'ngSanitize',
    'app.documentTypes'
  ])
  .config(config);

  config.$inject = ['KeepaliveProvider', 'IdleProvider'];

  function config(KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(15 * 60);
    IdleProvider.timeout(15 * 60);
    KeepaliveProvider.interval(15 * 60);
  }

  app.run(function ($rootScope, Idle, authService, $transitions, $state) {
    Idle.watch();

    // Put the authService on $rootScope so its methods
    // can be accessed from everywhere
    $rootScope.auth = authService;

    // Process the auth token if it exists and fetch the profile
    // TODO: Create and get this to callback route
    authService.handleParseHash();

    $rootScope.$on('IdleTimeout', function () {
      $rootScope.$broadcast('closeSesion');
      // end their session and redirect to login.
    });


    $transitions.onStart({
      to: function (state) {
        const logged = authService.isAuthenticated();
        if (logged && state.name == 'auth.login') {
          return $state.go('app');
        }

        return !state.isPublic || state.isPublic !== true;
      }
    }, function () {
      if (!authService.isAuthenticated()) {
        return $state.go('auth.login');
      }
    });
  });
})();
