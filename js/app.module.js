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

  var myApp = angular.module('angle', [
    'app.core',
    'app.routes',
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
    'ngIdle',
    'nzTour',
    'summernote',
    'ngTagsInput',
    'ngSanitize',
    'ng-nestable',

    'app.documentTypes'
  ]);



  myApp.config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
    // IdleProvider.idle(10);
    // IdleProvider.timeout(15);
    // KeepaliveProvider.interval(15);
    IdleProvider.idle(15 * 60);
    IdleProvider.timeout(15 * 60);
    KeepaliveProvider.interval(15 * 60);
  }]);

  myApp.run(function ($rootScope, Idle) {
    Idle.watch();
    $rootScope.$on('IdleTimeout', function () {
      $rootScope.$broadcast('closeSesion');
      // end their session and redirect to login.



    });
  });




})();
