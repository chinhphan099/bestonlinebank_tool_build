'use strict';

const gulp = require('gulp'),
  path = require('path'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  minifyCss = require('gulp-minify-css'),
  autoprefixer = require('gulp-autoprefixer'),
  lesshint = require('gulp-lesshint'),
  jshint = require('gulp-jshint'),
  gutil = require('gulp-util');

let srcPath = 'Y:/bestonlinebank.vi/' + 'src',
  outPath = 'Y:/bestonlinebank.vi/' + 'vi/pub-assets';

gulp.task('compileen', () => {
  srcPath = 'Y:/bestonlinebank.en/' + 'src';
  outPath = 'Y:/bestonlinebank.en/' + 'en/pub-assets';
});

gulp.task('copyAssets', () => {
  gulp.src(srcPath + '/fonts/*')
    .pipe(gulp.dest(outPath + '/fonts'));
});

gulp.task('compilejs', () => {
  // Compule JS Libs
  gulp.src([
    srcPath + '/libs/jquery.min.js',
    srcPath + '/libs/*/*.js',
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(outPath + '/js'));
  
  // Compile JS Components
  gulp.src([
    srcPath + '/js/l10n.js',
    srcPath + '/js/utils.js',
    srcPath + '/js/common.js',
    srcPath + '/js/components/*.js'
  ])
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(sourcemaps.init())
  .pipe(concat('components.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(outPath + '/js'));

  // Compile JS Pages
  gulp.src(srcPath + '/js/pages/*/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(outPath + '/js/pages'))
});

gulp.task('concatCSS', () => {
  gulp.src(srcPath + '/libs/*/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('libs.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outPath + '/css'));
});

gulp.task('less', () => {
  // Compile Less Components
  gulp.src([
      srcPath + '/less/style.less',
    ])
    .pipe(less().on('error', function(err) {
      let displayErr = gutil.colors.red(err.message);
      gutil.log(displayErr);
      this.emit('end');
    }))
    .pipe(autoprefixer('last 3 versions', 'ie 9'))
    //.pipe(minifyCss())
    .pipe(sourcemaps.init())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outPath + '/css'))

  // Compile Less Pages
  gulp.src([
      srcPath + '/less/pages/*.less'
    ])
    .pipe(less().on('error', function(err) {
      let displayErr = gutil.colors.red(err.message);
      gutil.log(displayErr);
      this.emit('end');
    }))
    .pipe(autoprefixer('last 3 versions', 'ie 9'))
    //.pipe(minifyCss())
    .pipe(gulp.dest(outPath + '/css/pages'))
});

gulp.task('default', ['compilejs', 'concatCSS', 'less', 'copyAssets']);
gulp.task('en', ['compileen'], () => { gulp.start(['default']); });