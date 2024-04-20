import gulp from 'gulp'
import plumber from 'gulp-plumber'
import sourcemap from 'gulp-sourcemaps'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import postcss from 'gulp-postcss'
import postcssUrl from 'postcss-url'
import autoprefixer from 'autoprefixer'
import htmlmin from 'gulp-htmlmin'
import terser from 'gulp-terser'
import imagemin from 'gulp-imagemin'
import rename from 'gulp-rename'
import { deleteAsync } from 'del'
import { create as createSync } from 'browser-sync'

const sass = gulpSass(dartSass)

const sync = createSync()

// Styles
export const styles = () => {
  return gulp
    .src('source/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(
      postcss([
        postcssUrl({
          assetsPath: '../',
        }),
        autoprefixer(),
      ])
    )
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream())
}

// HTML
export const html = () => {
  return gulp
    .src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
}

// Scripts
export const scripts = () => {
  return gulp
    .src('source/js/script.js')
    .pipe(terser())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(sync.stream())
}

// Images
export const imageOptimization = () => {
  return gulp
    .src('source/assets/images/*.{png,jpg,svg,webp}', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest('build/assets/images'))
}

export const copyImages = () => {
  return gulp
    .src('source/assets/images/*.{png,jpg,svg,webp}', { encoding: false })
    .pipe(gulp.dest('build/assets/images'))
}

// Copy
export const copy = (done) => {
  gulp
    .src('source/assets/fonts/**/*.ttf', {
      base: 'source',
      encoding: false,
    })
    .pipe(gulp.dest('build'))
  done()
}

// Clean
export const clean = () => {
  return deleteAsync('build')
}

// Server
export const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build',
    },
    cors: true,
    notify: false,
    ui: false,
  })
  done()
}

// Reload
export const reload = (done) => {
  sync.reload()
  done()
}

// Watcher
export const watcher = () => {
  gulp.watch('source/scss/**/*.scss', gulp.series(styles))
  gulp.watch('source/*.html', gulp.series(html, reload))
  gulp.watch('source/js/script.js', gulp.series(scripts))
}

// Build
export const build = gulp.series(
  clean,
  copy,
  imageOptimization,
  gulp.parallel(styles, html, scripts)
)

// Default
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(styles, html, scripts),
  gulp.series(server, watcher)
)
