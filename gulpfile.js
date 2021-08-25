var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass')(require('sass')),
  connect = require('gulp-connect'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  order = require('gulp-order'),
  deploy = require('gulp-gh-pages');

var jsSources = ['js/*.js'],
  sassSources = ['sass/*.scss'],
  htmlSources = ['**/*.html'],
  outputCSSDir = 'css',
  outputJSDir = 'js',
  outputDir = 'dist';

gulp.task('sass', async function () {
  gulp.src(sassSources)
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outputCSSDir))
    .pipe(connect.reload())
});

gulp.task('js', async function () {
  gulp
    .src(jsSources)
    .pipe(order([
      'js/jquery.min.js',
      'js/jquery.easing.1.3.js',
      'js/bootstrap.min.js',
      'js/jquery.waypoints.min.js',
      'js/sticky.js',
      'js/jquery.stellar.min.js',
      'js/hoverIntent.js',
      'js/superfish.js',
      'js/jquery.magnific-popup.min.js',
      'js/magnific-popup-options.js',
      'js/google_map.js',
      'js/main.js'
    ], { base: './' }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(uglify({ mangle: false }))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload())
});

gulp.task('watch', async function () {
  gulp.watch(jsSources, gulp.series('js'));
  gulp.watch(sassSources, gulp.series('sass'));
  gulp.watch(htmlSources, gulp.series('html'));
});

gulp.task('connect', async function () {
  connect.server({
    root: '.',
    livereload: true
  })
});

gulp.task('html', async function () {
  gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy());
});

gulp.task('default', gulp.series('html', 'js', 'sass', 'connect', 'watch'));