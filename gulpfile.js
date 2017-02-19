var
    lr = require('tiny-lr'),
    gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    typescript = require('gulp-typescript'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    concat = require('gulp-concat'),
    // copy = require('gulp-copy'),
    server = lr();

var paths = {
    typescript: "src/typescript/**/*.ts",
    sass: "src/sass/**/*.sass",
    jslibsmin: [
        "bower_components/angular/angular.min.js",
        "bower_components/jquery/jquery.min.js",
        "bower_components/fullpage.js/vendors/jquery.easings.min.js",
        "bower_components/fullpage.js/vendors/scrolloverflow.min.js",
        "bower_components/fullpage.js/jquery.fullPage.min.js"
    ],
    csslibs: [
        "bower_components/fullpage.js/jquery.fullPage.css"
    ],
    output: "assets"
};
gulp.task("js", function () {
    gulp.src(paths.typescript)
        .pipe(typescript())
        .pipe(uglify())
        .pipe(concat("self.min.js"))
        .pipe(gulp.dest(paths.output));
    gulp.src(paths.jslibsmin)
        .pipe(concat("libs.min.js"))
        .pipe(gulp.dest(paths.output));
});
gulp.task("css", function () {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(csso())
        .pipe(concat("sels.min.css"))
        .pipe(gulp.dest(paths.output));
    gulp.src(paths.csslibs)
        .pipe(concat("libs.min.css"))
        .pipe(gulp.dest(paths.output))
});
gulp.task('http-server', function () {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

gulp.task('watch', function () {
    // Предварительная сборка проекта
    gulp.run('js');

    // Подключаем Livereload
    server.listen(35729, function (err) {
        if (err) return console.log(err);
        gulp.watch('assets/js/**/*', function () {
            gulp.run('js');
        });
    });
    gulp.run('http-server');
});

gulp.task('build', function () {
    gulp.run("js");
    gulp.run("css");
});
