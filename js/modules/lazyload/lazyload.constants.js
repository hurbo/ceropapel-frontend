(function () {
  'use strict';

  angular
    .module('app.lazyload')
    .constant('APP_REQUIRES', {
      // jQuery based and standalone scripts
      scripts: {
        'moment': ['vendor/moment/min/moment-with-locales.min.js'],
        'whirl': ['vendor/whirl/dist/whirl.css'],
        'fastclick': ['vendor/fastclick/lib/fastclick.js'],
        'modernizr': ['vendor/modernizr/modernizr.custom.js'],
        'animate': ['vendor/animate.css/animate.min.css'],
        'icons': ['vendor/font-awesome/css/fontawesome.min.css', 'vendor/simple-line-icons/css/simple-line-icons.css'],
        'screenfull': ['vendor/screenfull/dist/screenfull.js'],
        'vector-map': ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
          '/ika.jvectormap/jquery-jvectormap-1.2.2.css'
        ],
        'inputmask': ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.js'],
        'codemirror': ['vendor/codemirror/lib/codemirror.js',
          '/codemirror/lib/codemirror.css'
        ],
        // modes for common web files
        'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
          '/codemirror/mode/xml/xml.js',
          '/codemirror/mode/htmlmixed/htmlmixed.js',
          '/codemirror/mode/css/css.js'
        ],
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
            'vendor/angular-sweetalert/SweetAlert.min.js'
          ],
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
            'vendor//angular-ui-select/dist/select.css'
          ]
        },
      ]
    });

})();
