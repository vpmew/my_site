var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');

gulp.task('style', function () {
    return gulp.src('sass/style.scss')
        .pipe(plumber())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('css'))
        .pipe(server.stream());
});

gulp.task('css-min', ['style'], function () {
    return gulp.src('css/style.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'));
});

gulp.task('scripts', function () {
    return gulp.src([
        'js/script.js'
        // 'src/libs/jquery/dist/jquery.min.js',
        // 'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
    ])
        .pipe(concat('min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('serve', ['style'/*, 'scripts'*/], function () {
    server.init({
        server: '.'
    });
    gulp.watch('sass/**/*.scss', ['style']);
    gulp.watch('./*.html', server.reload);
    gulp.watch('js/*.js', server.reload);
});

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('img', function () {
    return gulp.src('img/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('img'));
});

gulp.task('build', ['clean', 'img', 'style', 'css-min'/*, 'scripts'*/], function () {

    var build_css = gulp.src([
        'css/style.min.css'/*,
        'src/css/libs.min.css'*/
    ])
        .pipe(gulp.dest('css'))

    var build_html = gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
});
