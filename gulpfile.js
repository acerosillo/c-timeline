var gulp       = require('gulp'),
	scss         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'),
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	cache        = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
	return gulp.src('app/static/scss/**/*.scss')
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7', 'ie 6'], { cascade: true }))
		.pipe(gulp.dest('app/static/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/static/js'));
});

gulp.task('content', function () {
	return gulp.src([
			'app/content',
		])
		.pipe(gulp.dest('app/content'));
});

// gulp.task('css-libs', ['sass'], function() {
// 	return gulp.src('app/css/libs.css')
// 		.pipe(cssnano())
// 		.pipe(rename({suffix: '.min'}))
// 		.pipe(gulp.dest('app/css'));
// });

gulp.task('watch', ['browser-sync', 'scripts', 'sass', 'content'], function() {
	gulp.watch('app/static/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/static/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('img', function() {
	return gulp.src('app/static/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/static/img'));
});

gulp.task('video', function () {
	return gulp.src('app/static/video/**/*')
		.pipe(gulp.dest('dist/static/video'));
});

gulp.task('content', function () {
	return gulp.src('app/content/**/*')
		.pipe(gulp.dest('dist/content'));
});

gulp.task('build', ['clean', 'img', 'sass', 'video', 'content', 'scripts'], function() {

	var buildCss = gulp.src([
		'app/static/css/main.css',
		'app/static/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/static/css'))

	var buildFonts = gulp.src('app/static/fonts/**/*')
	.pipe(gulp.dest('dist/static/fonts'))

		var buildVideos = gulp.src('app/static/video/**/*')
			.pipe(gulp.dest('dist/static/video'))



	var buildJs = gulp.src('app/static/js/**/*')
	.pipe(gulp.dest('dist/static/js'))

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
