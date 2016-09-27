/**
 * NPM Dependencies
 */
const del = require('del');
const gulp = require('gulp');
const tsify = require('tsify');
const vueify = require('vueify');
const watchify = require('watchify');
const sass = require('gulp-sass');
const less = require('gulp-less');
const size = require('gulp-size');
const gutil = require('gulp-util');
const browserify = require('browserify');
const shell = require('gulp-shell');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const gulpfilter = require('gulp-filter');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const tslint = require('gulp-tslint');
const eslint = require('gulp-eslint');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync');
const buffer = require('vinyl-buffer');
const cleancss = require('gulp-clean-css');
const scsslint = require('gulp-scss-lint');
const sasslint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const combiner = require('stream-combiner2');
const autoprefixer = require('gulp-autoprefixer');
const htmlreplace = require('gulp-html-replace');
const source = require('vinyl-source-stream');
const moduleimporter = require('sass-module-importer');

/**
 * Gulp Configuration
 */
const config = require('./gulp-tasks-scaffold-config.json');

module.exports = {
  /**
   * Copy Task
   * @param taskName : string
   * @param copyTasks: Array<Object> = { src: string, dest: string }
   */
  Copy(taskName, copyTasks) {
    gulp.task(taskName, () => {
      for (const copyTask of copyTasks) {
        gulp.src(copyTask.src)
        .on('error', gutil.log)
        .pipe(gulp.dest(copyTask.dest))
        .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
          title: config.name,
          subtitle: `Finished ${taskName}`,
          message: 'Files Copied',
          icon: config.icon,
          sound: false,
          onLast: true
        }));
      }
    });
  },

  /**
   * HTML Task - Replace JS / CSS Links Dependent on Env
   * Also Minifies HTML for Production
   * @param taskName:  : string
   * @param src        : string
   * @param dest       : string
   * @param cssFilePath: string
   * @param jsFilePath : string
   */
  Html(taskName, src, dest, cssFilePath, jsFilePath) {
    const devOptions = { css: cssFilePath, js: jsFilePath };
    const prodOptions = { css: `${cssFilePath.split('.css')[0]}.min.css`, js: `${jsFilePath.split('.js')[0]}.min.js` };
    gulp.task(taskName, () => {
      gulp.src(src)
      .on('error', gutil.log)
      .pipe(gutil.env.production ? htmlreplace(prodOptions) : htmlreplace(devOptions))
      .pipe(gutil.env.production ? htmlmin({ collapseWhitespace: true }) : gutil.noop())
      .pipe(gulp.dest(dest))
      .pipe(size({ title: 'HTML:', showFiles: true, pretty: true }))
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'HTML Compiled',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },

  /**
   * Sass Task
   * @param taskName      : string
   * @param src           : string
   * @param dest          : string
   * @param outputFileName: string
   */
  Sass(taskName, src, dest, outputFileName) {
    gulp.task(taskName, () => {
      gulp.src(src)
      .on('error', gutil.log)
      .pipe(sass({ importer: moduleimporter() }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.init())
      .pipe(gutil.env.production ? cleancss() : gutil.noop())
      .pipe(gutil.env.production ? rename(`${outputFileName.split('.css')[0]}.min.css`) : rename(outputFileName))
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .pipe(size({ title: 'SASS:', showFiles: true, pretty: true }))
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'Sass Compiled',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },

  /**
   * Less Task
   * @param taskName      : string
   * @param src           : string
   * @param dest          : string
   * @param outputFileName: string
   */
  Less(taskName, src, dest, outputFileName) {
    gulp.task(taskName, () => {
      gulp.src(src)
      .on('error', gutil.log)
      .pipe(less().on('error', gutil.log))
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.init())
      .pipe(gutil.env.production ? cleancss() : gutil.noop())
      .pipe(gutil.env.production ? rename(`${outputFileName.split('.css')[0]}.min.css`) : rename(outputFileName))
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .pipe(size({ title: 'LESS:', showFiles: true, pretty: true }))
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'Less Compiled',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },


  /**
   * Browserify Task
   * @param taskName      : string
   * @param src           : Array<string> | string
   * @param dest          : string
   * @param outputFileName: string
   * @param plugins       : Array<string> | string
   */
  Browserify(taskName, src, dest, outputFileName, transforms, plugins) {
    gulp.task(taskName, () => {
      const bundler = browserify({
        debug: true,
        entries: src,
        extensions: ['.js', '.json', '.ts', '.jsx', '.tsx', '.vue']
      });
      if (plugins !== undefined) {
        if (typeof plugins === 'object') {
          for (const plugin of plugins) {
            bundler.plugin(plugin);
          }
        }
        if (typeof plugins === 'string') {
          bundler.plugin(plugins);
        }
      }
      if (plugins !== undefined) {
        if (typeof transforms === 'object') {
          for (const transformItem of transforms) {
            bundler.transform(transformItem);
          }
        }
        if (typeof plugins === 'string') {
          bundler.transform(transforms);
        }
      }
      bundler.bundle()
      .on('error', gutil.log)
      .pipe(gutil.env.production ? source(`${dest}/${outputFileName.split('.js')[0]}.min.js`) : source(`${dest}/${outputFileName}`))
      .pipe(buffer())
      .pipe(gutil.env.production ? uglify() : gutil.noop())
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.init())
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(''))
      .pipe(size({ title: 'JS:', showFiles: true, pretty: true }))
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'JS Compiled',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },

  /**
   * Concat Task
   * @param taskName       :string
   * @param src            :string
   * @param dest           :string
   * @param outputFileName :string
   */
  Concat(taskName, src, dest, outputFileName) {
    gulp.task(taskName, () => {
      gulp.src(src)
      .pipe(concat(outputFileName))
      .pipe(gutil.env.production && outputFileName.includes('.js') ? uglify() : gutil.noop())
      // Some logic to add .min.js
      .pipe(gutil.env.production && outputFileName.includes('.css') ? cleancss() : gutil.noop())
      // Some logic to add .min.css
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.init())
      .pipe(gutil.env.production ? gutil.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .pipe(size({ title: 'Mixed:', showFiles: true, pretty: true }))
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'JS Compiled',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },

  /**
  * ES6 Linter
  * @param taskName : string
  * @param src      : string
  * @param exclude  : string
  * @param configSrc: string
  */
  Eslint(taskName, src, exclude, configSrc) {
    gulp.task(taskName, () => {
      gulp.src([src, '!node_modules/**', `!${exclude}`])
      .pipe(eslint(configSrc))
      .pipe(eslint.format())
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'ES Lint Completed',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },


  /**
   * Typescript Linter
   * @param taskName : string
   * @param src      : string
   * @param exclude  : string
   * @param configSrc: string
   */
  Tslint(taskName, src, exclude, configSrc) {
    gulp.task(taskName, () => {
      gulp.src([src, `!${exclude}`])
      .pipe(tslint({ configuration: configSrc, formatter: 'verbose' }))
      .pipe(tslint.report())
      .on('error', error => gutil.log(error.message))
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'Ts Lint Completed',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },


  /**
   * SCSS Linter
   * @param taskName : string
   * @param src      : string
   * @param exclude  : string
   * @param configSrc: string
   */
  Scsslint(taskName, src, exclude, configSrc) {
    gulp.task(taskName, () => {
      const scssfilter = gulpfilter(exclude);
      gulp.src(src)
      .pipe(scssfilter)
      .pipe(scsslint({ config: configSrc }))
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'Scss Lint Completed',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },


  /**
   * SASS Linter
   * @param taskName : string
   * @param src      : string
   * @param exclude  : string
   * @param configSrc: string
   */
  Sasslint(taskName, src, exclude, configSrc) {
    gulp.task(taskName, () => {
      gulp.src(src)
      .pipe(sasslint({
        files: { ignore: exclude },
        config: configSrc
      }))
      .pipe(sasslint.format())
      .pipe(gutil.env.type === 'ci' ? gutil.noop() : notify({
        title: config.name,
        subtitle: `Finished ${taskName}`,
        message: 'Sass Lint Completed',
        icon: config.icon,
        sound: false,
        onLast: true
      }));
    });
  },

  /**
   * Watch Task
   * @param tasksToRun  : Array<string>
   * @param tasksToWatch: Array<Object> = { path: string, tasks: Array<string> }
   */
  Watch(tasksToRun, tasksToWatch) {
    gulp.task('watch', tasksToRun, () => {
      for (const task of tasksToWatch) {
        gulp.watch(task.path, task.tasks);
      }
    });
  },

  /**
   * Clean Task (Cleans Files)
   * @param taskName : string
   * @param paths    : Array<string>
   */
  Clean(taskName, paths) {
    gulp.task(taskName, () => {
      del(paths);
    });
  },

  /**
   * Default Task
   * @param taskNames: Array<string>
   */
  Default(taskNames) {
    gulp.task('default', taskNames);
  }
};
