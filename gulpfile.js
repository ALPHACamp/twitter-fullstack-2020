const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

gulp.task('css', function () {
  return gulp.src('public/css/*.css')
    .pipe(concat('combined.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
  gulp.watch('public/css/*.css', gulp.series('css'));
});

gulp.task('default', gulp.series('watch'));