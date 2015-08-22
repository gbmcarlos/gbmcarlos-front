var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    notify = require('gulp-notify'),
    del = require('del'),
    browserSync = require('browser-sync');

gulp.task('styles', function() {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            "sourcemap=none": true
        }))
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('scripts', function() {
    return browserify('app.js')
        .pipe(function(b) {b.transform('hbsfy', {
            "extensions": ["hbs"],
            "precompilerOptions": {
                "knownHelpersOnly": false
            }
        });return b})
        .pipe(gulp.dest('dist/scripts'))
});

gulp.task('clean', function(cb) {
    del(['dist/styles', 'dist/scripts'], cb);
});

gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'scripts');
});

gulp.task('watch', function() {

    browserSync({
        server: {
            baseDir: 'dist'
        }
    });

    gulp.watch(['app/styles/**/*.scss'], ['styles']);

    gulp.watch(['app/scripts/**/*.js', 'app/scripts/**/*.json', 'app/scripts/**/*.hbs'], ['scripts']);

    gulp.watch(['dist/**']).on('change', function() {browserSync.reload({ stream: true })});

});