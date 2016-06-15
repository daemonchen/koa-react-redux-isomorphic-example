var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js')

gulp.task('build', ['build:server', 'build:client'])

gulp.task('build:server', ['build:server:app', 'build:server:shared'])

gulp.task('build:server:app', function() {
  return gulp.src('src/server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/server'))
})

gulp.task('build:server:shared', function() {
  return gulp.src('src/shared/**/*.+(js|jsx)')
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/shared'))
})

gulp.task('build:client', function() {
  return gulp.src(['src/shared/**/*.+(js|jsx)', 'src/client/**/*.+(js|jsx)'])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/public/js'));
})

          
