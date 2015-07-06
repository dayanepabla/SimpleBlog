'use strict';

var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
  build: 'dist',
  styles: 'src/css/**/*.css',
  scripts: 'src/js/**/*.js',
  images: 'src/img/**/*',
  html: 'src/*.html',
};

gulp.task('default', ['html', 'images', 'styles', 'scripts'], function() {});

gulp.task('clean', function(cb) {
  del([paths.build], cb);
});

gulp.task('html', function() {
  return gulp.src(paths.html)
             .pipe($.minifyHtml())
             .pipe(gulp.dest(paths.build));
});

gulp.task('images', function() {
  var destPath = paths.build + '/img';

  return gulp.src(paths.images)
             .pipe($.cache($.imagemin({
                progressive: true,
                interlaced: true
             })))
             .pipe(gulp.dest(destPath));
});

gulp.task('styles', function() {
  var destPath = paths.build + '/css';

  return gulp.src(paths.styles)
             .pipe($.concat('blog.css'))
             .pipe($.minifyCss())
             .pipe(gulp.dest(destPath));
});

gulp.task('scripts', function() {
  var destPath = paths.build + '/js';

  return gulp.src(paths.scripts)
             .pipe($.concat('blog.js'))
             .pipe($.stripDebug())
             .pipe($.uglify())
             .pipe(gulp.dest(destPath));
});

gulp.task('serve', function() {
  browserSync({
    notify: false,
    logPrefix: 'Server',
    server: ['src']
  });

  gulp.watch(paths.html, ['html', reload]);
  gulp.watch(paths.styles, ['styles', reload]);
  gulp.watch(paths.images, ['images', reload]);
  gulp.watch(paths.scripts, ['scripts', reload]);
});

gulp.task('serve:dist', ['default'], function() {
  browserSync({
    notify: false,
    logPrefix: 'Server:Dist',
    server: ['dist']
  });
});
