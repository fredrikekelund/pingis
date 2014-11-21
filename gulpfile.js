var fs         = require("fs"),
	gulp       = require("gulp"),
	jshint     = require("gulp-jshint"),
	please     = require("gulp-pleeease")
	plumber    = require("gulp-plumber"),
	sass       = require("gulp-sass"),
	scsslint   = require("gulp-scss-lint"),
	sourcemaps = require("gulp-sourcemaps"),
	jsonSass   = require("json-sass"),
	source     = require("vinyl-source-stream"),
	rename     = require("gulp-rename"),
	rimraf     = require("gulp-rimraf"),
	markdown   = require("gulp-markdown");

var scssDir    = "meteor/client/scss/",
	scssSource = scssDir + "*.scss",
	colorsJson = scssDir + "colors.json",
	scssDest   = "meteor/client/css",
	jsSource   = [
		"meteor/client/**/*.js",
		"!meteor/client/lib/*.js",
		"meteor/collections/**/*.js",
		"meteor/lib/**/*.js",
		"meteor/server/**/*.js"
	],
	docsDir    = "docs/",
	mdDocs     = docsDir + "markdown/*.md";



gulp.task("default", [
	"compileDocs",
	"cleanColorsScss",
	"colorsToScss",
	"css",
	"scss-lint",
	"jshint",
	"watch"
]);

gulp.task("css", function() {
	return gulp.src(scssSource)
	.pipe(plumber())
	.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(please({
			autoprefixer: {
				browsers: ["last 2 versions"],
				cascade: false
			},
			minifier: true,
			mqpacker: true,
			import: false,
			opacity: false
		}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(scssDest));
});

gulp.task("cleanColorsScss", function() {
	return gulp.src(scssDir + "_colors.scss", {read: false})
	.pipe(rimraf());
});

gulp.task("colorsToScss", function() {
	return fs.createReadStream(colorsJson)
	.pipe(plumber())
	.pipe(jsonSass({
		prefix: "$colors: "
	}))
	.pipe(source(colorsJson))
	.pipe(rename("_colors.scss"))
	.pipe(gulp.dest(scssDir));
});

gulp.task("scss-lint", function() {
	return gulp.src(scssSource)
	.pipe(plumber())
	.pipe(scsslint({
		"config": ".scsslint.yml"
	}));
});

gulp.task("jshint", function() {
	return gulp.src(jsSource)
	.pipe(plumber())
	.pipe(jshint())
	.pipe(jshint.reporter("default"));
});

gulp.task("compileDocs", function() {
	// return gulp.src(mdDocs)
	// .pipe(plumber())
	// .pipe(markdown())
	// .pipe(gulp.dest(docsDir));
});

gulp.task("watch", function() {
	gulp.watch(mdDocs, ["compileDocs"]);
	gulp.watch(colorsJson, ["colorsToScss"]);
	gulp.watch(jsSource, ["jshint"]);
	gulp.watch(scssSource, ["css", "scss-lint"]);
});
