var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    stylish = require('jshint-stylish'),
    path = require('path'),
    buffer = require('vinyl-buffer'),
    mainBowerFiles = require('main-bower-files'),
    _ = require('lodash'),
    browserSync = require('browser-sync'),
    historyApiFallback = require('connect-history-api-fallback'),
    bundler,
    getBundler,
    onError,
    style,
    bundle,
    images,
    favicon,
    reporter;

onError = function (err) {
    console.log(err);
    this.emit('end');
};

style = function (config) {
    config = config || {};

    var prod = (!!config.minify && config.minify);

    return gulp.src('./app/styles/main.scss')
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.if(prod, $.rubySass({
            style: 'compressed',
            precision: 10,
            "sourcemap=none": true
        })))
        .pipe($.if(!prod, $.rubySass({
            style: 'expanded',
            precision: 10,
            "sourcemap=none": true
        })))
        .pipe($.rename('main.css'))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(browserSync.reload({ stream: true }));
};

bundle = function (config) {
    config = config || {};

    var prod = (!!config.minify && config.minify);

    return getBundler(prod).bundle()
    .on('error', onError)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe($.if(prod, $.stripDebug()))
    .pipe($.if(prod, $.uglify()))
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(browserSync.reload({ stream: true }));
};

getBundler = function (prod) {
    prod = prod || false;

    var b;

    if (!bundler) {
        b = browserify('./app/scripts/widget/widget.js', _.extend({
            debug: prod
        }, watchify.args));

        b.transform('hbsfy', {
            "extensions": ["hbs"],
            "precompilerOptions": {
                "knownHelpersOnly": false
            }
        });

        bundler = watchify(b);
    }
    return bundler;
};

images = function (config) {
    config = config || {};

    var prod = (!!config.minify && config.minify);

    return gulp.src('app/images/**/*')
        .pipe(gulp.dest('./dist/images'));
};

favicon = function (config) {
    return gulp.src('app/favicon.ico')
        .pipe(gulp.dest('./dist'));
};

gulp.task('clean', function() {
    return gulp.src('app/tmp', {read: false})
        .pipe($.plumber())
        .pipe($.clean());
});

gulp.task('html', function() {
    return gulp.src('./app/index.html')
        .pipe($.plumber())
        .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
    return style();
});

gulp.task('scripts', function() {
    process.env.BROWSERIFYSWAP_ENV = 'dist';
    return bundle();
});

gulp.task('jshint', function() {
    return gulp.src(['./app/widget/**/*.js', './test/**/*.js'])
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('embed', function () {
    return gulp.src('app/scripts/frame.js')
        .pipe(gulp.dest('dist/scripts/widget'));
});

gulp.task('images', images);

gulp.task('fonts', function () {
    return gulp.src('app/styles/**/*')
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

reporter = 'spec';

gulp.task('compile', [
    'clean',
    'html',
    'fonts'
], function () {
    style();
    images();
    favicon();
    return bundle();
});

gulp.task('build', [
    'clean',
    'html',
    'fonts'
], function () {
    style({minify: true});
    images();
    favicon();
    return bundle({minify: true}).on('end', function() {
        console.log('Build complete');
        return process.exit(0);
    });
});

gulp.task('test', [
    'jshint'
]);

gulp.task('watch', ['compile'], function() {
    browserSync({
        server: {
            baseDir: 'dist',
            middleware: [ historyApiFallback ]
        }
    });

    reporter = 'dot';
    getBundler().on('update', function() {
        console.log('Scripts updated');
    });
    gulp.watch('./test/**/*.js', ['test']);
    gulp.watch('./app/**/*.html', ['html']);
    gulp.watch('./app/**/*.hbs', ['scripts']);
    gulp.watch(['./app/**/*.json', './app/**/*.js'], ['scripts']);
    gulp.watch(['./app/styles/main.scss', './app/styles/**/*.scss'], ['styles']);
});

gulp.task('default', ['watch']);
