const { src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');

// CSS Utilities
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

// JS Utilities
const terser = require('gulp-terser-js');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

// Fonts Utilities
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2woff = require('gulp-ttf2woff');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    images: 'src/img/**/*',
    fonts: 'src/scss/fonts/**/*.ttf'
}

function createWoff2() {
    return src(paths.fonts)
        .pipe( ttf2woff2() )
        .pipe( dest('./build/assets/fonts') )
        .pipe( notify({ message: 'Fuente woff2 lista'}));
}

function createWoff() {
    return src(paths.fonts)
        .pipe( ttf2woff() )
        .pipe( dest('./build/assets/fonts') )
        .pipe( notify({ message: 'Fuente woff lista'}));
}

function minifyCSS() {
    return src(paths.scss)
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss( [ autoprefixer(), cssnano() ] ))
        .pipe( sourcemaps.write('.') )
        .pipe( dest('./build/css') )
        .pipe( notify({ message: 'Compilando y minificando SASS a CSS'}));
}

function minifyJS() {
    return src(paths.js)
        .pipe( sourcemaps.init() )
        .pipe( concat('bundle.js') )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe(rename({ suffix: '.min' }))
        .pipe( dest('./build/js') )
        .pipe( notify({ message: 'Concatenando y minificando JS'}));
}

function images() {
    return src(paths.images)
        .pipe( imagemin() )
        .pipe( dest('./build/assets/img'))
        .pipe( notify({ message: 'Imagen minificada'}));
}

function versionWebp() {
    return src(paths.images)
        .pipe( webp() )
        .pipe( dest('./build/assets/img/webp') )
        .pipe( notify({ message: 'Version webp lista' }))
}

function watchFiles() {
    watch (paths.fonts, createWoff2);
    watch (paths.fonts, createWoff);
    watch (paths.scss, minifyCSS);
    watch (paths.js, minifyJS);
    watch (paths.images, images);
    watch (paths.images, versionWebp);
}

exports.createWoff = createWoff;
exports.createWoff2 = createWoff2;
exports.minifyCSS = minifyCSS;
exports.images = images;
exports.watchFiles = watchFiles;

exports.default = parallel(minifyCSS, minifyJS, watchFiles);