const gulp = require('gulp')
const path = require('path')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const webpack = require('webpack-stream')
const concat = require('gulp-concat')
const less = require('gulp-less')
const del = require('del')
const runSequence = require('run-sequence')

const paths = {
  mainScripts: ['./assets/js/form.js',
  './assets/js/vendor/jquery.mask.js',
  './assets/js/vendor/jquery.ui.touch-punch.js'],
  LESStoCSS: ['./assets/less/*.less']
}

gulp.task('babel', () => {
  return gulp.src('./assets/js/src/form.js')
  .pipe(webpack({
    entry: './assets/js/src/form.js',
    output: {
      path: `${__dirname}/assets/js/`,
      filename: 'form.js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        include: [path.resolve(__dirname, 'assets/js')],
        loader: 'babel',
        query: { presets: ['es2015'] }
      }]
    }
  }))
  .pipe(gulp.dest('./assets/js/'))
})

gulp.task('mainScripts', () => {
  gulp.src(paths.mainScripts)
  .pipe(concat('form.min.js'))
  .pipe(uglify({ compress:{ properties: false } }))
  .pipe(gulp.dest('./assets/js/'))
  return del(['./assets/js/form.js'])
})

gulp.task('builderScript', () => {
  return gulp.src('./assets/js/src/builder.js')
  .pipe(webpack({
    entry: './assets/js/src/builder.js',
    cache : true,
    output: {
      path: `${__dirname}/assets/js/`,
      filename: 'builder.js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        include: [path.resolve(__dirname, 'assets/js')],
        loader: 'babel',
        query: { presets: ['es2015'] }
      }]
    }
  }))
  .pipe(gulp.dest('./assets/js/'))
})

gulp.task('dashboardScript', () => {
  return gulp.src('./assets/js/src/dashboard.jsx')
  .pipe(webpack({
    entry: './assets/js/src/dashboard.jsx',
    cache : true,
    output: {
      path: `${__dirname}/assets/js/`,
      filename: 'dashboard.js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [{
        test: /\.(jsx|js)$/,
        exclude: /(node_modules)/,
        loader: ['babel'],
        query: { presets: ['es2015', 'react'] }
      }]
    }
  }))
  .pipe(gulp.dest('./assets/js/'))
})

gulp.task('LESStoCSS', () => {
  return gulp.src(paths.LESStoCSS)
  .pipe(less())
  .pipe(cleanCSS({ compatibility: 'ie8' }))
  .pipe(gulp.dest('./assets/css/'))
})

gulp.task('concatCSS', () => {
  return gulp.src(['./assets/css/form.css', './assets/css/common-elements.css'])
  .pipe(concat('form.min.css'))
  .pipe(gulp.dest('./assets/css/'))
})

gulp.watch(['./assets/js/src/builder.js', './assets/js/src/data/*.js'], ['builderScript'])
gulp.watch('./assets/js/src/dashboard.jsx', ['dashboardScript'])

gulp.watch(['./assets/js/src/form.js', './assets/js/src/helpers.js', './assets/js/src/formcraft.validation.js'], ['scripts'])

gulp.watch('./assets/less/*.less', ['LESStoCSS'])
gulp.watch(['./assets/css/form.css', './assets/css/common-elements.css'], ['concatCSS'])

gulp.task('default', ['scripts', 'LESStoCSS', 'builderScript', 'dashboardScript'])
gulp.task('scripts', (callback) => {
  runSequence('babel', 'mainScripts', callback)
})

