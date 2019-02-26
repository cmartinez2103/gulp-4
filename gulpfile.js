const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');

const app_path = './app';

//compile scss into css

function style(){
    const autoprefixBrowsers = [
        '> 1%',
        'last 2 versions',
        'firefox >= 4',
        'safari 7',
        'safari 8',
        'IE 8', 
        'IE 9',
        'IE 10',
        'IE 11'
    ];
    return gulp.src(app_path + '/assets/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        precision: 10,
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: autoprefixBrowsers,
        cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(size({
        title: 'styles',
        showFiles: true
    }))
    .pipe(gulp.dest(app_path + '/dist/css'))
    .pipe(browserSync.stream());
}

function script(){
    return gulp.src([
		app_path + '/assets/scripts/libs/*.js',
		app_path + '/assets/scripts/src/*.js',
		app_path + '/assets/scripts/*.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify({
		compress: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(size({
        title: 'scripts',
        showFiles: true
    }))
    .pipe(gulp.dest(app_path + '/dist/js'))
    .pipe(browserSync.stream());
}

function images() {
    return gulp.src(app_path + '/assets/images/**/*')
    .pipe(imagemin({ progressive: true }))
    .pipe(size({
        title: 'images',
        showFiles: true
    }))
    .pipe(gulp.dest(app_path + '/dist/img'));
};

function watch(){
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'app/'
        },
        browser: 'google chrome',
        port: 3004,
        https: false
    });

    gulp.watch(app_path + '/assets/styles/**/*.scss', style);
    gulp.watch(app_path + '/*.html').on('change', browserSync.reload);
    gulp.watch(app_path + '/assets/scripts/**/*.js', script);
    gulp.watch(app_path + '/assets/images/**/*', images);
}

exports.style = style;
exports.watch = watch;