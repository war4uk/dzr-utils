var gulp = require("gulp");
var typescript = require("gulp-typescript");
var tsProject = typescript.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('ts-build', function () {
	 return tsProject.src()
		.pipe(sourcemaps.init())
        .pipe(typescript(tsProject)).js
		.pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: __dirname }))
		.pipe(gulp.dest('.'));
})