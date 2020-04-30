(function () {
  'use strict';

  angular
    .module('app.core')
    .run(appRun);

  appRun.$inject = ['$rootScope', '$state', '$stateParams', '$window'];

  function appRun($rootScope, $state, $stateParams, $window) {



    // var uiConfig = {
    //   // Query parameter name for mode.
    //   'queryParameterForWidgetMode': 'mode',
    //   // Query parameter name for sign in success url.
    //   'queryParameterForSignInSuccessUrl': 'signInSuccessUrl',
    //   'signInSuccessUrl': '/',
    //   'signInOptions': [],
    //   // Terms of service url.
    //   'tosUrl': '/',
    //   'callbacks': {
    //     'signInSuccess': function(/*currentUser, credential, redirectUrl*/) {
    //     }
    //   }
    // };




    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;

    // Uncomment this to disable template cache
    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //   if (typeof(toState) !== 'undefined'){
    //     $templateCache.remove(toState.templateUrl);
    //   }
    // });

    // Allows to use branding color with interpolation
    // {{ colorByName('primary') }}


    // cancel click event easily
    $rootScope.cancel = function ($event) {
      $event.stopPropagation();
    };

    // Hooks Example
    // -----------------------------------

    // Hook not found
    $rootScope.$on('$stateNotFound',
      function (event, unfoundState /*, fromState, fromParams*/ ) {

        console.error('state not found');
        console.error('state not found event', event);
        console.error('state not found unfoundState', unfoundState);


      });
    // Hook error
    $rootScope.$on('$stateChangeError',
      function (event, toState, toParams, fromState, fromParams, error) {

        console.error('stateChangeError event', event);
        console.error('stateChangeError toState', toState);
        console.error('stateChangeError toParams', toParams);
        console.error('stateChangeError fromState', fromState);
        console.error('stateChangeError fromParams', fromParams);
        console.error('stateChangeError error', error);
      });
    // Hook success
    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        console.log('stateChangeSuccess core');
        // display new view from top
        $window.scrollTo(0, 0);
        // Save the route title
        $rootScope.currTitle = $state.current.title;
        var ps;
        if (fromState.name) {
          ps = {
            name: fromState.name,
            title: fromState.title,
            params: fromParams
          };
        } else {
          ps = {
            name: 'app.inicio',
            title: 'Inicio',
            params: {}
          };

        }
        $rootScope.previousState = ps;
      });

    // Load a title dynamically
    $rootScope.currTitle = $state.current.title;
    $rootScope.pageTitle = function () {
      var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
      document.title = title;
      return title;
    };

  }

})();
