/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/gulpfile.js
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var childProcess = require('child_process');

var browserApp = [
  'node_modules/tgi-core/lib/_packaging/lib-header',
  'node_modules/tgi-core/dist/tgi.core.chunk.js',
  'node_modules/tgi-interface-createjs/dist/tgi.interface.createjs.chunk.js',
  'node_modules/tgi-store-local/dist/tgi.store.local.chunk.js',
  'node_modules/tgi-store-remote/dist/tgi.store.remote.chunk.js',
  'node_modules/tgi-core/lib/_packaging/lib-footer'
];

// Build Lib
gulp.task('buildBrowserApp', function () {
  return gulp.src(browserApp)
    .pipe(concat('browserApp.js'))
    .pipe(gulp.dest('public/lib'))
    .pipe(rename('browserApp.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/lib'));
});
