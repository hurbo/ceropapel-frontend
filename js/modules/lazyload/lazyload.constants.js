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
          'vendor/components-font-awesome/css/all.min.css',
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
      },

      // Angular based script (use the right module name)
      modules: [{
          name: 'oitozero.ngSweetAlert',
          files: [
            'vendor/sweetalert/dist/sweetalert.min.js',
            'vendor/sweetalert/dist/sweetalert.css',
            'vendor/angular-sweetalert/SweetAlert.min.js'
          ],
          serie: true
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
      ]
    });

})();
