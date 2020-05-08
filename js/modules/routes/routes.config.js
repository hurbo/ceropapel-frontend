/**=========================================================
* Module: config.js
* App routes and resources configuration
=========================================================*/


(function () {

  'use strict';

  angular
    .module('app.routes')
    .config(routesConfig);

  routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

  function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {
    // Remove the ! from the hash so that
    // auth0.js can properly parse it
    $locationProvider.hashPrefix('');

    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $locationProvider.html5Mode(true);

    // defaults to dashboard
    $urlRouterProvider.otherwise('/app/mailbox/internal/in');
    $urlRouterProvider.when('/app', '/app/mailbox/internal/in');
    $urlRouterProvider.when('/app/mailbox', '/app/mailbox/internal/in');
    $urlRouterProvider.when('/app/mailbox/internal', '/app/mailbox/internal/in');
    $urlRouterProvider.when('/app/mailbox/external', '/app/mailbox/external/in/');

    // Application Routes
    // -----------------------------------
    $stateProvider
      // Auth routes
      // -----------------------------------
      .state('auth', {
        url: '/auth',
        controller: 'AuthController',
        controllerAs: 'aac',
        templateUrl: helper.basepath('auth.html'),
        resolve: helper.resolveFor('modernizr', 'icons', 'loaders.css', 'spinkit',  'swangular'),
        isPublic: true
      })
      .state('auth.login', {
        url: '/login',
        controller: 'AuthController',
        controllerAs: 'auth',
        templateUrl: helper.basepath('auth/login.html'),
        isPublic: true
      })
      .state('auth.logout', {
        url: '/logout',
        controller: 'AuthController',
        controllerAs: 'auth',
        isPublic: true
      })

      .state('auth.callback', {
        url: '/callback',
        controller: 'AuthController',
        controllerAs: 'auth',
        templateUrl: helper.basepath('auth/callback.html'),
        isPublic: true
      })

      // Main app routes
      // -----------------------------------
      .state('app', {
        url: '/app',
        controller: 'AppController',
        controllerAs: 'ac',
        templateUrl: helper.basepath('app.html'),
        resolve: helper.resolveFor('modernizr', 'icons', 'loaders.css', 'spinkit',  'swangular'),
      })

      .state('app.profile', {
        url: '/profile',
        title: 'Profile',
        controller: 'ProfileController',
        controllerAs: 'pc',
        templateUrl: helper.basepath('profile/profile.html')
      })

      .state('app.documentTypes', {
        url: '/documentTypes',
        title: 'Documentos',
        controller: 'DocumentTypesController',
        controllerAs: 'dtc',
        templateUrl: helper.basepath('documentsTypes/documentsTypes.html')
      })

      .state('app.secretariats', {
        url: '/secretariats',
        title: 'Secretariás',
        controller: 'SecretariatsController',
        controllerAs: 'sc',
        templateUrl: helper.basepath('secretariates/secretariats.html')
      })
      .state('app.usersJobs', {
        url: '/users-jobs',
        title: 'Puestos de trabajo',
        controller: 'UsersJobsController',
        controllerAs: 'ujc',
        templateUrl: helper.basepath('users-jobs.html')
      })
      .state('app.groups', {
        url: '/groups',
        title: 'Grupos de trabajo',
        controller: 'groupsController',
        controllerAs: 'gc',
        templateUrl: helper.basepath('groups/index.html')
      })
      .state('app.groups.list', {
        url: '/list',
        title: 'Grupos de trabajo',
        controller: 'groupsController',
        controllerAs: 'gc',
        templateUrl: helper.basepath('groups/list.html')
      })
      .state('app.groups.create', {
        url: '/create',
        title: 'Grupos de trabajo',
        controller: 'groupsCreateController',
        controllerAs: 'gcc',
        templateUrl: helper.basepath('groups/form.html')
      })
      .state('app.groups.edit', {
        url: '/edit/:id',
        title: 'Grupos de trabajo',
        controller: 'groupsCreateController',
        controllerAs: 'gcc',
        templateUrl: helper.basepath('groups/form.html')
      })
      .state('app.canceledDocuments', {
        url: '/canceled-documents',
        title: 'Cancelados',
        controller: 'secretariatesCanceledDocsController',
        controllerAs: 'scdc',
        templateUrl: helper.basepath('canceled-documents/secretariates.html')
      })
      .state('app.secretariateCanceledDocuments', {
        url: '/secretariate-canceled-documents/:id',
        title: 'Cancelados',
        controller: 'secretariateCanceledDocsController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('canceled-documents/secretariate-details.html')
      })
      .state('app.secretariateCanceledDocuments.view', {
        url: '/view/:mid',
        title: 'Documento',
        controller: 'canceledViewController',
        controllerAs: 'mvc',
        templateUrl: helper.basepath('canceled-documents/view-document.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.jobTittles', {
        url: '/jobTittles',
        title: 'Puestos de trabajo',
        controller: 'JobTittlesController',
        controllerAs: 'jtc',
        templateUrl: helper.basepath('jobTittles.html')
      })
      .state('app.info', {
        url: '/Inicio',
        title: 'Inicio',
        controller: 'InfoController',
        controllerAs: 'ic',
        templateUrl: helper.basepath('info.html')
      })
      .state('app.notifications', {
        url: '/notifications',
        title: 'Notificaciones',
        controller: 'NotificationsController',
        controllerAs: 'ntc',
        templateUrl: helper.basepath('notifications.html')
      })

      .state('app.drafts', {
        url: '/drafts',
        title: 'Borradores',
        controller: 'newDraftController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('drafts.html')
      })


      .state('app.templates', {
        url: '/templates',
        title: 'Plantillas',
        templateUrl: helper.basepath('templates/index.html')
      })
      .state('app.templates.list', {
        url: '/list',
        title: 'Plantillas',
        controller: 'TemplatesListCtrl',
        controllerAs: 'docs',
        templateUrl: helper.basepath('templates/list.html')
      })
      .state('app.templates.list.page', {
        url: '/page/:page',
        title: 'Plantillas',
        controller: 'TemplatesListCtrl',
        controllerAs: 'docs',
        templateUrl: helper.basepath('templates/list.html')
      })
      .state('app.templates.compose', {
        url: '/compose',
        title: 'Plantillas',
        controller: 'TemplatesCtrl',
        controllerAs: 'tc',
        templateUrl: helper.basepath('templates/compose.html')
      })
      .state('app.templates.edit', {
        url: '/edit/:mid',
        title: 'Plantilla',
        controller: 'TemplatesCtrl',
        controllerAs: 'tc',
        templateUrl: helper.basepath('templates/edit.html')
      })
      .state('app.templates.show', {
        url: '/show/:mid',
        title: 'Plantilla',
        controller: 'TemplatesCtrl',
        controllerAs: 'tc',
        templateUrl: helper.basepath('templates/compose.html')
      })

      // Mailbox
      // -----------------------------------
      .state('app.mailbox', {
        url: '/mailbox',
        title: 'Mailbox',
        controller: 'MailboxController',
        controllerAs: 'mailbox',
        templateUrl: helper.basepath('mailbox/index.html'),
        resolve: helper.resolveFor('ui.select', 'angularBootstrapNavTree')
      })




      .state('app.mailbox.share', {
        url: '/share',
        title: 'Nomina',
        controller: 'shareController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/share/index.html'),
        resolve: helper.resolveFor('ui.select')
      })



      .state('app.mailbox.search', {
        url: '/search',
        title: 'Buscar',
        controller: 'SearchController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/search/index.html'),
        resolve: helper.resolveFor('ui.select')
      })


      .state('app.mailbox.search.page', {
        url: '/:box/:jt/:startDate/:endDate/:subject/:folio/:status/:require/:ft/:importance/:confidential/page/:page',
        title: 'Buscar',
        controller: 'SearchController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/search/list.html')
      })

      .state('app.mailbox.search.filter.page', {
        url: '/:box/:jt/:startDate/:endDate/:subject/:folio/:status/:require/:ft/:importance/:confidential/page/:page',
        title: 'Buscar',
        controller: 'SearchController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/search/list.html')
      })




      .state('app.mailbox.searchAdvanced', {
        url: '/searchAdvanced',
        title: 'Busqueda',
        controller: 'SearchAdvancedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/search-advanced/index.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.searchAdvanced.page', {
        url: '/:subject/:from/:to/:beneficiary/:folio/:documentType/:status/:startDate/:endDate/page/:page',
        title: 'Busqueda',
        controller: 'SearchAdvancedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/search-advanced/list.html')
      })
      .state('app.mailbox.searchAdvanced.filter.page', {
        url: '/:subject/:from/:to/:beneficiary/:folio/:documentType/:status/:startDate/:endDate/page/:page',
        title: 'Busqueda',
        controller: 'SearchAdvancedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/search-advanced/list.html')
      })



      .state('app.mailbox.compose', {
        url: '/compose',
        title: 'Documentos',
        controller: 'MailComposerController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/compose.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.compose.boss', {
        url: '/compose/boss/:bossJT',
        title: 'Documentos',
        controller: 'MailComposerController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/compose.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.internal.in.view', {
        url: '/view/:mid/:inboxID',
        title: 'Documento',
        controller: 'InternalMailViewController',
        controllerAs: 'mvc',
        templateUrl: helper.basepath('mailbox/internal/view.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.internal.out.view', {
        url: '/view/:mid/:inboxID',
        title: 'Documento',
        controller: 'InternalMailViewController',
        controllerAs: 'mvc',
        templateUrl: helper.basepath('mailbox/internal/view.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.internal', {
        url: '/internal',
        title: 'Recibidos',
        controller: 'InternalMailboxController',
        // controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/index.html')
      })
      .state('app.mailbox.internal.in', {
        url: '/in',
        title: 'Recibidos',
        controller: 'inboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/inbox.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.internal.in.page', {
        url: '/page/:page',
        title: 'Recibidos',
        controller: 'inboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/inbox.html')
      })
      .state('app.mailbox.internal.in.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Recibidos',
        controller: 'inboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/inbox.html')
      })
      .state('app.mailbox.internal.in.filter.page', {
        url: '/page/:page',
        title: 'Recibidos',
        controller: 'inboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/inbox.html')
      })
      .state('app.mailbox.internal.out', {
        url: '/out',
        title: 'Enviados',
        controller: 'outboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/outbox.html')
      })
      .state('app.mailbox.internal.out.page', {
        url: '/page/:page',
        title: 'Enviados',
        controller: 'outboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/outbox.html')
      })
      .state('app.mailbox.internal.out.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Enviados',
        controller: 'outboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/outbox.html')
      })
      .state('app.mailbox.internal.out.filter.page', {
        url: '/page/:page',
        title: 'Enviados',
        controller: 'outboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/outbox.html')
      })
      .state('app.mailbox.internal.collaboration', {
        url: '/collaboration',
        title: 'En colaboración',
        controller: 'collaborationController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/collaboration.html')
      })
      .state('app.mailbox.internal.collaboration.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'collaborationController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/collaboration.html')
      })
      .state('app.mailbox.internal.collaboration.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'En colaboración',
        controller: 'collaborationController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/collaboration.html')
      })
      .state('app.mailbox.internal.collaboration.filter.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'collaborationController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/collaboration.html')
      })
      .state('app.mailbox.internal.drafts', {
        url: '/drafts',
        title: 'Borradores',
        controller: 'newDraftController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/drafts.html')
      })

      .state('app.mailbox.internal.drafts.page', {
        url: '/page/:page',
        title: 'Borradores',
        controller: 'newDraftController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/drafts.html')
      })

      .state('app.mailbox.internal.draft', {
        url: '/drafts/:id',
        title: 'Borrador',
        controller: 'draftViewController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/compose.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.internal.archived', {
        url: '/archived',
        title: 'Archivados',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archived.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archived.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'En colaboración',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archived.filter.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archived.folder', {
        url: '/:folder',
        title: 'Archivados',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archived.folder.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archived.folder.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'En colaboración',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archived.folder.filter.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archived.html')
      })
      .state('app.mailbox.internal.archivedOut', {
        url: '/archivedOut',
        title: 'Archivados',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })
      .state('app.mailbox.internal.archivedOut.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })
      .state('app.mailbox.internal.archivedOut.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'En colaboración',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })
      .state('app.mailbox.internal.archivedOut.filter.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })
      .state('app.mailbox.internal.archivedOut.folder', {
        url: '/:folder',
        title: 'Archivados',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })
      .state('app.mailbox.internal.archivedOut.folder.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })
      .state('app.mailbox.internal.archivedOut.folder.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'En colaboración',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })
      .state('app.mailbox.internal.archivedOut.folder.filter.page', {
        url: '/page/:page',
        title: 'En colaboración',
        controller: 'archivedOutController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/archivedOut.html')
      })

      .state('app.mailbox.internal.elaborated', {
        url: '/elaborated',
        title: 'Elaborados',
        controller: 'elaboratedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/elaborated.html')
      })
      .state('app.mailbox.internal.elaborated.page', {
        url: '/page/:page',
        title: 'Elaborados',
        controller: 'elaboratedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/elaborated.html')
      })
      .state('app.mailbox.internal.elaborated.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Elaborados',
        controller: 'elaboratedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/elaborated.html')
      })
      .state('app.mailbox.internal.elaborated.filter.page', {
        url: '/page/:page',
        title: 'Elaborados',
        controller: 'elaboratedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/internal/elaborated.html')
      })
      .state('app.mailbox.external', {
        url: '/external',
        title: 'Compartidos',
        controller: 'ExternalMailboxController',
        controllerAs: 'emc',
        templateUrl: helper.basepath('mailbox/external/index.html')
      })
      .state('app.mailbox.external.in', {
        url: '/in/:jobTitle',
        title: 'Compartidos',
        controller: 'externalInboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/inbox.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.external.in.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalInboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/inbox.html')
      })
      .state('app.mailbox.external.in.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Compartidos',
        controller: 'externalInboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/inbox.html')
      })

      .state('app.mailbox.external.in.filter.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalInboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/inbox.html')
      })



      .state('app.mailbox.external.in.view', {
        url: '/view/:mid/:inboxID',
        title: 'Documento',
        controller: 'ExternalMailViewController',
        controllerAs: 'mvc',
        templateUrl: helper.basepath('mailbox/external/view.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.external.out.view', {
        url: '/view/:mid/:inboxID',
        title: 'Documento',
        controller: 'ExternalMailViewController',
        controllerAs: 'mvc',
        templateUrl: helper.basepath('mailbox/external/view.html'),
        resolve: helper.resolveFor('ui.select')
      })


      .state('app.mailbox.external.turned', {
        url: '/turned/:jobTitle',
        title: 'Compartidos',
        controller: 'externalTurnedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/externalTurned.html')
      })
      .state('app.mailbox.external.turned.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalTurnedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/externalTurned.html')
      })
      .state('app.mailbox.external.turned.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Compartidos',
        controller: 'externalTurnedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/externalTurned.html')
      })
      .state('app.mailbox.external.turned.filter.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalTurnedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/externalTurned.html')
      })

      .state('app.mailbox.external.out', {
        url: '/out/:jobTitle',
        title: 'Compartidos',
        controller: 'externalOutboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/outbox.html')
      })
      .state('app.mailbox.external.out.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalOutboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/outbox.html')
      })
      .state('app.mailbox.external.out.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Compartidos',
        controller: 'externalOutboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/outbox.html')
      })
      .state('app.mailbox.external.out.filter.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalOutboxController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/outbox.html')
      })

      .state('app.mailbox.external.archived', {
        url: '/archived/:jobTitle',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })
      .state('app.mailbox.external.archived.view', {
        url: '/view/:mid',
        title: 'Compartidos',
        controller: 'ExternalMailViewController',
        controllerAs: 'mvc',
        templateUrl: helper.basepath('mailbox/external/view.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.external.archived.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })
      .state('app.mailbox.external.archived.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })
      .state('app.mailbox.external.archived.filter.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })
      .state('app.mailbox.external.archived.folder', {
        url: '/:folder',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })
      .state('app.mailbox.external.archived.folder.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })
      .state('app.mailbox.external.archived.folder.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })
      .state('app.mailbox.external.archived.folder.filter.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archived.html')
      })

      .state('app.mailbox.external.archivedOut', {
        url: '/archivedOut/:jobTitle',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })
      .state('app.mailbox.external.archivedOut.view', {
        url: '/view/:mid',
        title: 'Compartidos',
        controller: 'ExternalMailViewController',
        controllerAs: 'mvc',
        templateUrl: helper.basepath('mailbox/external/view.html'),
        resolve: helper.resolveFor('ui.select')
      })
      .state('app.mailbox.external.archivedOut.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })
      .state('app.mailbox.external.archivedOut.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })
      .state('app.mailbox.external.archivedOut.filter.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })
      .state('app.mailbox.external.archivedOut.folder', {
        url: '/:folder',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })
      .state('app.mailbox.external.archivedOut.folder.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })
      .state('app.mailbox.external.archivedOut.folder.filter', {
        url: '/filter/:pending/:needSign/:priority/:read/:unread/:signed/:notSigned/:rejected/:confidential/:notTurned/:searchQuery',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })
      .state('app.mailbox.external.archivedOut.folder.filter.page', {
        url: '/page/:page',
        title: 'Compartidos',
        controller: 'externalArchivedController',
        controllerAs: 'docs',
        templateUrl: helper.basepath('mailbox/external/archivedOut.html')
      })

      .state('app.chats', {
        url: '/chat',
        title: 'Chat',
        controller: 'chatsController',
        controllerAs: 'chat',
        templateUrl: helper.basepath('chat/init.html')
      })

      .state('app.general_settings', {
        url: '/settings/general',
        title: 'General Settings',
        templateUrl: helper.basepath('general.settings.html'),
        controller: 'GeneralSettingsController',
        controllerAs: 'gs',
        resolve: helper.resolveFor('moment', 'moment-timezone')
      })


    //
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // -----------------------------------
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;

  } // routesConfig


})();
