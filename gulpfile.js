var gulp 		    = require('gulp');
var autoprefixer    = require('gulp-autoprefixer');
var concat 			= require('gulp-concat');
var cleanCSS 		= require('gulp-clean-css');
var	include 		= require("gulp-include");
var sass 			= require('gulp-ruby-sass');
var sass 			= require('gulp-sass');
var uglify 			= require('gulp-uglify');
var pump 			= require('pump');
var rename          = require("gulp-rename");
var browserSync = require('browser-sync').create();

var resources 	= './resources/';

// ************************************************ //
// --- JavaScript files
// ************************************************ //

// Javascript
var jsFiles = [
    './resources/js/app.js'
];

// StyleSheets
var cssFiles = [
  './resources/scss/style.scss'
];

// Destination folders
var destJS = './dist/js';
var destCSS = './dist/css';

// ************************************************ //
// --- Minimized and for showcase
// ************************************************ //

gulp.task('scripts', function() {
    gulp.src(jsFiles)
        .pipe(include())
        .pipe(concat('script.js'))
        .pipe(gulp.dest(destJS));
});

gulp.task('sass', function () {
  gulp.src(cssFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: [
            'Android >= 2.3',
            'BlackBerry >= 7',
            'Chrome >= 9',
            'Firefox >= 4',
            'Explorer >= 9',
            'iOS >= 5',
            'Opera >= 11',
            'Safari >= 5',
            'OperaMobile >= 11',
            'OperaMini >= 6',
            'ChromeAndroid >= 9',
            'FirefoxAndroid >= 4',
            'ExplorerMobile >= 9'
        ],
        cascade: false
     }))

    .pipe(gulp.dest(destCSS));

});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost/wordpress"
    });
});

// ************************************************ //
// --- Directly for production
// ************************************************ //

gulp.task('sass-production', function() {
    gulp.src(cssFiles)
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({debug: true}, function(details) {
        // console.log(details.name + ': ' + details.stats.originalSize);
        // console.log(details.name + ': ' + details.stats.minifiedSize);
      }))
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest(destCSS));
});

gulp.task('scripts-production', function() {
    gulp.src(jsFiles)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destJS));
});

// ************************************************ //
// --- Watchers
// ************************************************ //
gulp.task('watch', function() {
    // Watch .js files
    gulp.watch(resources + 'js/*.js', ['scripts']);
    gulp.watch(resources + 'js/modules/*.js', ['scripts']);
    gulp.watch(resources + 'js/init/*.js', ['scripts']);

    // Watch .scss files
    gulp.watch(resources + 'scss/*.scss', ['sass']);
    gulp.watch(resources + 'scss/mixins/*.scss', ['sass']);
    gulp.watch(resources + 'scss/config/*.scss', ['sass']);
    gulp.watch(resources + 'scss/modules/*.scss', ['sass']);
});


//default tasks
gulp.task('dev', ['scripts', 'sass', 'watch']);

//production tasks
gulp.task('production', ['scripts-production', 'sass-production']);
