/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/gulpfile.js
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var childProcess = require('child_process');

var desktopLib = [
  'node_modules/tgi-core/lib/_packaging/lib-header',
  'node_modules/tgi-core/dist/tgi.core.chunk.js',
  'node_modules/tgi-interface-bootstrap/dist/tgi.interface.bootstrap.chunk.js',
  'node_modules/tgi-store-local/dist/tgi.store.local.chunk.js',
  'node_modules/tgi-store-remote/dist/tgi.store.remote.chunk.js',
  'node_modules/tgi-core/lib/_packaging/lib-footer'
];

// Build Lib
gulp.task('buildDesktopLib', function () {
  return gulp.src(desktopLib)
    .pipe(concat('desktop.js'))
    .pipe(gulp.dest('public/lib'))
    .pipe(rename('desktop.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/lib'));
});

// Copy bootstrap dist
gulp.task('copyBootstrapDist', function () {
  return gulp.src(['node_modules/tgi-interface-bootstrap/dist/**']).pipe(gulp.dest('public/lib/desktop'));
});
