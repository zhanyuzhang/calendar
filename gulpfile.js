var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'src',
    livereload: true
  });
});


gulp.task('html', function () {
  gulp.src('./src/*.html')
    .pipe(connect.reload());
});

gulp.task('css', function () {
  gulp.src('./src/**/*.css')
    .pipe(concat('index.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./src/**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.html'], ['html']);
  gulp.watch(['./src/**/*.css'], ['css']);
  gulp.watch(['./src/**/*.js'], ['js']);
});

gulp.task('default', ['connect', 'watch']);