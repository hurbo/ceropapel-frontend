var args = require('yargs').argv,
  path = require('path'),
  fs = require('fs'),
  gulp = require('gulp'),
  rename = require("gulp-rename"),
  $ = require('gulp-load-plugins')(),
  gulpsync = $.sync(gulp),
  uglify = require('gulp-terser'),
  gulpNgConfig = require('gulp-ng-config'),
  bowerSrc = require('gulp-bower-src'),
  browserSync = require('browser-sync'),
  // reload = browserSync.reload,
  PluginError = $.util.PluginError,
  del = require('del'),
  replace = require('gulp-string-replace'),
  jsYaml = require('js-yaml'),
  parseArgs   = require('minimist'),
  historyApiFallback = require('connect-history-api-fallback');

// production mode (see build task)
var isProduction = false;
// styles sourcemaps
var useSourceMaps = false;

// Switch to sass mode.
// Example:
//    gulp --usesass
var useSass = args.usesass;

// Angular template cache
// Example:
//    gulp --usecache
var useCache = args.usecache;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!' + hidden_files;

// MAIN PATHS
var paths = {
  app: 'dist/',
  markup: 'jade/',
  styles: 'less/',
  scripts: 'js/',
  assets: 'assets'
}

// if sass -> switch to sass folder
if (useSass) {
  log('Using SASS stylesheets...');
  paths.styles = 'sass/';
}

// Custom env configuration
const { BUILD_ENV } = parseArgs(process.argv.slice(2));

// VENDOR CONFIG
var vendor = {
  // vendor scripts required to start the app
  base: {
    source: require('./vendor.base.json'),
    js: 'base.js',
    css: 'base.css'
  },
  // vendor scripts to make the app work. Usually via lazy loading
  app: {
    source: require('./vendor.json'),
    dest: paths.app + 'vendor',
  }
};


// SOURCES CONFIG
var source = {
  scripts: [
    paths.scripts + 'app.module.js',
    // template modules
    paths.scripts + 'modules/**/*.module.js',
    paths.scripts + 'modules/**/*.js',
    // custom modules
    paths.scripts + 'custom/**/*.module.js',
    paths.scripts + 'custom/**/*.js'
  ],
  assets: {
    i18n: paths.assets + '/i18n/**/*.json',
    img: paths.assets + '/img/**/*',
    fonts: paths.assets + '/fonts/**/*',
  },
  templates: {
    index: [paths.markup + 'index.*'],
    views: [paths.markup + '**/*.*', '!' + paths.markup + 'index.*']
  },
  styles: {
    app: [paths.styles + '*.*'],
    themes: [paths.styles + 'themes/*'],
    watch: [paths.styles + '**/*', '!' + paths.styles + 'themes/*']
  }
};

// BUILD TARGET CONFIG
var build = {
  scripts: paths.app + 'js',
  styles: paths.app + 'css',
  vendor: paths.app + 'vendor',
  assets: {
    img: paths.app + '/assets/img',
    i18n: paths.app + '/assets/i18n',
    fonts: paths.app + '/assets/fonts',
  },
  templates: {
    index: paths.app,
    views: paths.app,
    cache: paths.app + 'js/' + 'templates.js',
  }
};

// PLUGINS OPTIONS
var prettifyOpts = {
  indent_char: ' ',
  indent_size: 3,
  unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'pre', 'code']
};

var vendorUglifyOpts = {
  mangle: {
    reserved: ['$super'] // rickshaw requires this
  }
};

var compassOpts = {
  project: path.join(__dirname, '../'),
  css: 'dist/css',
  sass: 'master/sass/',
  image: 'dist/img',
  fonts: 'dist/fonts'
};

var compassOptsThemes = {
  project: path.join(__dirname, '../'),
  css: 'dist/css',
  sass: 'master/sass/themes/', // themes in a subfolders
  image: 'dist/img',
  fonts: 'dist/fonts'
};

var tplCacheOptions = {
  root: 'app',
  filename: 'templates.js',
  //standalone: true,
  module: 'app.core',
  base: function (file) {
    return file.path.split('jade')[1];
  }
};

var injectOptions = {
  name: 'templates',
  transform: function (filepath) {
    return 'script(src=\'' +
      filepath.substr(filepath.indexOf('app')) +
      '\')';
  }
}

var cssnanoOpts = {
  safe: true,
  discardUnused: false, // no remove @font-face
  reduceIdents: false // no change on @keyframes names
}

//---------------
// TASKS
//---------------


// JS APP
gulp.task('scripts:app', function () {
  log('[scripts:app] Building scripts..');
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(source.scripts)
    .pipe($.jsvalidate())
    .on('error', handleError)
    .pipe($.if(useSourceMaps, $.sourcemaps.init()))
    .pipe($.concat('app.js'))
    // .pipe($.ngAnnotate())
    .on('error', handleError)
    .pipe($.if(isProduction, uglify({
      // comments: 'some'
    })))
    .on('error', handleError)
    .pipe($.if(useSourceMaps, $.sourcemaps.write()))
    .pipe(gulp.dest(build.scripts));
  // .pipe(reload({
  //     stream: true
  // }));
});


// VENDOR BUILD
// gulp.task('vendor', function () {
//   return bowerSrc()
//     .pipe(gulp.dest('dist/lib'));
// });

gulp.task('vendor', gulpsync.sync(['vendor:base', 'vendor:app']));

// Build the base script to start the application from vendor assets
gulp.task('vendor:base', function () {
  log('[vendor:base] Copying base vendor assets..');

  var jsFilter = $.filter('**/*.js', {
    restore: true
  });
  var cssFilter = $.filter('**/*.css', {
    restore: true
  });

  return gulp.src(vendor.base.source)
    .pipe($.expectFile(vendor.base.source))
    .pipe(jsFilter)
    .pipe($.concat(vendor.base.js))
    .pipe($.if(isProduction, uglify()))
    .pipe(gulp.dest(build.scripts))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.concat(vendor.base.css))
    .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
    .pipe(gulp.dest(build.styles))
    .pipe(cssFilter.restore)
    ;
});

// copy file from bower folder into the app vendor folder
gulp.task('vendor:app', function () {
  log('[vendor:app] Copying vendor assets..');

  var jsFilter = $.filter('**/*.js', {
    restore: true
  });
  var cssFilter = $.filter('**/*.css', {
    restore: true
  });

  return gulp.src(vendor.app.source, {
    base: 'bower_components'
  })
    .pipe($.expectFile(vendor.app.source))
    .pipe(jsFilter)
    .pipe($.if(isProduction, uglify(vendorUglifyOpts)))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
    .pipe(cssFilter.restore)
    .pipe(gulp.dest(vendor.app.dest));
});

// APP FONTS
gulp.task('styles:fonts', function () {
  log('[styles:app:fonts] Building application fonts..');
  return gulp.src(source.assets.fonts)
  .pipe(gulp.dest(build.assets.fonts));
});

// APP i18n
gulp.task('assets:i18n', function () {
  log('[assets:i18n] Building application i18n..');

  return gulp.src(source.assets.i18n)
  .pipe(gulp.dest(build.assets.i18n));
});

// APP img
gulp.task('assets:img', function () {
  log('[assets:img] Building application img..');

  return gulp.src(source.assets.img)
  .pipe(gulp.dest(build.assets.img));
});


// APP LESS
gulp.task('styles:app', function () {
  log('[styles:app] Building application styles..');
  return gulp.src(source.styles.app)
    .pipe($.if(useSourceMaps, $.sourcemaps.init()))
    .pipe(useSass ? $.compass(compassOpts) : $.less())
    .on('error', handleError)
    .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
    .pipe($.if(useSourceMaps, $.sourcemaps.write()))
    .pipe(gulp.dest(build.styles));
  // .pipe(reload({
  //     stream: true
  // }));
});

// APP RTL
gulp.task('styles:app:rtl', function () {
  log('[styles:app:rtl] Building application RTL styles..');
  return gulp.src(source.styles.app)
    .pipe($.if(useSourceMaps, $.sourcemaps.init()))
    .pipe(useSass ? $.compass(compassOpts) : $.less())
    .on('error', handleError)
    .pipe($.rtlcss()) /* RTL Magic ! */
    .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
    .pipe($.if(useSourceMaps, $.sourcemaps.write()))
    .pipe($.rename(function (path) {
      path.basename += "-rtl";
      return path;
    }))
    .pipe(gulp.dest(build.styles));
  // .pipe(reload({
  //     stream: true
  // }));
});

// LESS THEMES
gulp.task('styles:themes', function () {
  log('[styles:themes] Building application theme styles..');
  return gulp.src(source.styles.themes)
    .pipe(useSass ? $.compass(compassOptsThemes) : $.less())
    .on('error', handleError)
    .pipe(gulp.dest(build.styles));
  // .pipe(reload({
  //     stream: true
  // }));
});

// JADE
gulp.task('templates:index', ['templates:views'], function () {
  log('[templates:index] Building index..');

  var tplscript = gulp.src(build.templates.cache, {
    read: false
  });
  return gulp.src(source.templates.index)
    .pipe($.if(useCache, $.inject(tplscript, injectOptions))) // inject the templates.js into index
    .pipe($.jade())
    .on('error', handleError)
    .pipe($.htmlPrettify(prettifyOpts))
    .pipe(gulp.dest(build.templates.index));
  // .pipe(reload({
  //     stream: true
  // }));
});

// JADE
gulp.task('templates:views', function () {
  log('[templates:views] Building views.. ' + (useCache ? 'using cache' : ''));

  if (useCache) {
    return gulp.src(source.templates.views)
      .pipe($.jade())
      .on('error', handleError)
      .pipe($.angularTemplatecache(tplCacheOptions))
      .pipe($.if(isProduction, uglify({
        comments: 'some'
      })))
      .pipe(gulp.dest(build.scripts))
      .pipe(reload({
        stream: true
      }));
  } else {

    return gulp.src(source.templates.views)
      .pipe($.if(!isProduction, $.changed(build.templates.views, {
        extension: '.html'
      })))
      .pipe($.jade())
      .on('error', handleError)
      .pipe($.htmlPrettify(prettifyOpts))
      .pipe(gulp.dest(build.templates.views));
      // .pipe(reload({
      //   stream: true
      // }));
  }
});


// Templates environment replacement
gulp.task('templates:environment', function () {
  log('[environment] Injecting environment variables..');

  const compiledIndex = build.templates.index + 'index.html';
  const src = fs.readFileSync('.env.yml')
  const raw = jsYaml.safeLoad(src).env

  let env;
  if (BUILD_ENV) {
    env = raw[BUILD_ENV].env
  } else {
    env = isProduction ? raw.production.env : raw.local.env
  }

  const findReplace = (_replacement) => {
    const replacement = _replacement.replace(/%/g, '');
    return env[replacement];
  }

  return gulp.src(compiledIndex)
    .pipe(replace('%BASE_URL%', findReplace, {}))
    .pipe(replace('%ZENDESK_HOST%', findReplace, {}))
    .pipe(gulp.dest(build.templates.index))
});

// Environment config
gulp.task('environment', function () {
  log('[environment] Injecting environment variables..');

  let environment = BUILD_ENV;
  if (BUILD_ENV) {
    environment = [`env.${BUILD_ENV}`, `env.${BUILD_ENV}.global`]
  } else {
    environment = isProduction ? ['env.production', 'env.production.global'] : ['env.local', 'env.local.global'];
  }

  gulp.src('.env.yml')
    .pipe(gulpNgConfig('app.environment', {
      wrap:true,
      environment,
      parser: 'yml',
      pretty: 2,
      createModule: true
    }))
    .pipe(rename('environment.module.js'))
    .pipe(gulp.dest('./js/modules/environment'))
});

//---------------
// WATCH
//---------------
// Rerun the task when a file changes
gulp.task('watch', function () {
  log('Watching source files..');
  gulp.watch('.env.yml', ['environment']);
  gulp.watch('vendor.base.json', ['vendor:base']);
  gulp.watch('vendor.json', ['vendor:app']);
  gulp.watch(source.fonts, ['styles:fonts']);
  gulp.watch(source.i18n, ['app:i18n']);

  gulp.watch(source.scripts, ['scripts:app']);
  gulp.watch(source.styles.watch, ['styles:app', 'styles:app:rtl']);
  gulp.watch(source.styles.themes, ['styles:themes']);
  gulp.watch(source.templates.views, ['templates:views']);
  gulp.watch(source.templates.index, ['templates:index']);
});

// Serve files with auto reaload
gulp.task('browsersync', function () {
  log('Starting BrowserSync..');

  browserSync({
    ui: false,
    open: false,
    server: {
      baseDir: 'dist/'
    },
    middleware: [historyApiFallback()]
  });
});

// lint javascript
gulp.task('lint', function () {
  return gulp
    .src(source.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe($.jshint.reporter('fail'));
});

// Remove all files from the build paths
gulp.task('clean', async function (done) {
  var delconfig = [].concat(
    build.styles,
    build.scripts,
    build.vendor,
    build.assets.img,
    build.assets.i18n,
    build.assets.fonts,
    build.templates.index + 'index.html',
    build.templates.views + 'views',
    build.templates.views + 'pages',
    vendor.app.dest
  );

  log('[clean] Cleaning: ' + $.util.colors.blue(delconfig));
  // force: clean files outside current directory
  await del(delconfig, {
    force: true
  }, done);
});

//---------------
// MAIN TASKS
//---------------

// build for production (minify)
// Disabled as we have minification problems
// gulp.task('build', gulpsync.sync([
//   'clean',
//   'prod',
//   'environment',
//   'vendor',
//   'assets',
//   'templates:environment',
// ]));

gulp.task('build', gulpsync.sync([
  'environment',
  'clean',
  'vendor',
  'assets',
  'templates:environment',
]));


// build for staging (minify)
gulp.task('build-dev', gulpsync.sync([
  'vendor',
  'assets'
]));

gulp.task('prod', function () {
  log('[prod] Starting production build...');
  isProduction = true;
});

// Server for development
gulp.task('serve', gulpsync.sync([
  'default',
  'browsersync'
]), done);

// Server for production
gulp.task('serve-prod', gulpsync.sync([
  'build',
  'browsersync'
]), done);

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function () {
  useSourceMaps = true;
});

// default (no minify)
gulp.task('default', gulpsync.sync([
  'clean',
  'environment',
  'vendor',
  'assets',
  'templates:environment',
  'watch'
]));

gulp.task('assets', [
  'scripts:app',
  'styles:fonts',
  'styles:app',
  'styles:app:rtl',
  'styles:themes',
  'assets:i18n',
  'assets:img',
  'templates:index',
  'templates:views',
]);


/////////////////////

function done() {
  log('************');
  log('* All Done * You can start editing your code, BrowserSync will update your browser after any change..');
  log('************');
}

// Error handler
function handleError(err) {
  log(err.toString());
  this.emit('end');
}

// log to console using
function log(msg) {
  $.util.log($.util.colors.blue(msg));
}
