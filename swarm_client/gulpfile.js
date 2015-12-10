var gulp = require("gulp");
var typescript = require("gulp-typescript");
var tsProject = typescript.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('ts-build-client', function () {
	 tsProject.src()
		.pipe(sourcemaps.init())
        .pipe(typescript(tsProject)).js
		.pipe(sourcemaps.write('.', { includeContent: true }))
		.pipe(gulp.dest('.'));
})


gulp.task('build', ['ts-build-client']);