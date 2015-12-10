var gulp = require("gulp");
var typescript = require("gulp-typescript");
var tsProjectServer = typescript.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('ts-build-server', function () {
	return tsProjectServer.src()
		.pipe(sourcemaps.init())
        .pipe(typescript(tsProjectServer)).js
		.pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: __dirname }))
		.pipe(gulp.dest('.'));
})

gulp.task('build', ['ts-build-server']);