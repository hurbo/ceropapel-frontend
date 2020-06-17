(function () {
  'use strict';

  angular
    .module('app.lazyload')
    .constant('APP_REQUIRES', {
      // jQuery based and standalone scripts
      scripts: {
        'moment': ['vendor/moment/min/moment-with-locales.min.js'],
        'modernizr': ['vendor/modernizr/modernizr.custom.js'],
        'animate': ['vendor/animate.css/animate.min.css'],
        'icons': [
          'vendor/font-awesome/css/font-awesome.min.css',
          'vendor/simple-line-icons/css/simple-line-icons.css'
        ],
        'screenfull': ['vendor/screenfull/dist/screenfull.js'],
        'inputmask': ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.js'],
        'taginput': [
          'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
          '/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
        ],
        'loaders.css': ['vendor/loaders.css/loaders.css'],
        'spinkit': ['vendor/spinkit/spinkit.min.css'],
        'ngMaterial' : ['vendor/angular-material/angular-material.min.css']
      },

      // Angular based script (use the right module name)
      modules: [{
          name: 'swangular',
          files: [
            // 'vendor/sweetalert/dist/sweetalert.min.js',
            // 'vendor/sweetalert/dist/sweetalert.css',
            "vendor/sweetalert2/dist/sweetalert2.min.js",
            "vendor/sweetalert2/dist/sweetalert2.min.css",
            'vendor/swangular/swangular.js'
          ],
          serie: true
        },

        {
          name: 'ng-nestable',
          files: ['vendor/ng-nestable/src/angular-nestable.js',
          'vendor/ng-nestable/lib/jquery.nestable.js'
          ]
        },

        {
          name: 'angularBootstrapNavTree',
          files: [
            'vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
            'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
          ]
        },
        {
          name: 'ui.select',
          files: [
            'vendor/angular-ui-select/dist/select.js',
            'vendor/angular-ui-select/dist/select.css'
          ]
        },
        {
          name: 'bm.bsTour',
          files: [
            'vendor/bootstrap-tour/build/css/bootstrap-tour.min.css',
            'vendor/bootstrap-tour/build/js/bootstrap-tour.min.js',
          ],
          serie: true
        }
      ]
    });

})();
