# gulp-tasks-scaffold (WIP)

Simple wrapper for common gulp tasks with a very easy-to-use api

[![Build Status](https://travis-ci.org/jonathonwang/gulp-tasks-scaffold.svg?branch=master)](https://travis-ci.org/jonathonwang/gulp-tasks-scaffold)
[![npm version](https://badge.fury.io/js/gulp-tasks-scaffold.svg)](https://badge.fury.io/js/gulp-tasks-scaffold)
[![node version](https://img.shields.io/node/v/gulp-tasks-scaffold.svg)](#)

This is a very simple wrapper around gulp tasks to get rid of all of that piping bloat. I aimed to include at least all of the common tasks that I use.

Official Repo for this Package: __[gulp-tasks-scaffold](https://github.com/jonathonwang/gulp-tasks-scaffold)__

Example repo using this package: __[gulp-starter](https://github.com/jonathonwang/gulp-starter)__

I may create official documentation pages for this as well as it will probably get too large for a readme.

## Getting Started
__Install__

`npm install gulp`

`npm install gulp-tasks-scaffold`

---

### How To Use:
This package comes with a ton of npm dependencies which can be used by importing the `gulp-tasks-scaffold` package into your `gulpfile.js`

Ex:
```javascript
import gulp from 'gulp-tasks-scaffold';
// Or
var gulp = require('gulp-tasks-scaffold');
```
You will then have access to all of the gulp tasks by accessing the imported gulp object: `gulp.Whatevertask`

---

### Tasks:
* __[Copy](#copy-task)__
* __[Html](#html-task)__
* __[Sass](#sass-task)__
* __[Concat](#concat-task)__
* __[Browserify](#browserify-task)__
* __[Scsslint](#scsslint-task)__
* __[Eslint](#eslint-task)__
* __[Tslint](#tslint-task)__
* __[Clean](#clean-task)__
* __[Default](#default-task)__
* __[Watch](#watch-task)__

---

### Copy Task:

Copies files from one directory to another

```javascript
gulp.Copy(
  'copy', // taskName
  [ // files
    {
      src: './node_modules/bootstrap-sass/assets/stylesheets/**/*.scss', // fileSrc
      dest: 'src/sass/vendor/bootstrap' // fileDest
    }
  ]
);
```

Parameters:
* taskName: string
* files: Array of Objects with src and dest attributes
* fileSrc: string
* fileDest: string

---

### Html Task:

Swaps out script and css links depending on environment && minifies files.

```javascript
gulp.Html(
  'html', // taskName
  'src/html/**/*', // htmlSource
  'dist/html', // htmlOutput
  '../css/app.css', // compiledCssPath
  '../js/app.js' // compiledJsPath
);
```

Parameters:
* taskName: string
* htmlSource: string
* htmlOutput: string
* compiledCssPath: string (relative to output html file)
* compiledJsPath: string (relative to output html file)

Note:

You must have these comment code blocks in your html to find and replace css && js links.

```html
<!-- build:css -->
<link rel="stylesheet" href="../dist/css/app.css">
<!-- endbuild -->

<!-- build:js -->
<script src="../dist/js/app.js"></script>
<!-- endbuild -->
```

Run gulp `taskName` --production to change the links to use `app.min.css` for CSS && `app.min.js` for JS

---

### Sass Task:

Compiles SASS with sourcemaps and minifies SASS with --production flag
```javascript
gulp.Sass(
  'sass', // taskName
  'src/sass/**/*.scss', // sassPath
  'dist/css/', // cssOutputPath
  'app.css' // cssOutputFileName
);
```

Parameters:
* taskName: string
* sassPath: string
* cssOutputPath: string
* cssOutputFileName: string

Note:

Run gulp `taskName` --production to minify files and exclude sourcemaps.
This will create `.min.css` extension on the output CSS file.

---

### Concat Task:

Concatenates either JS or CSS files and minifies with --production flag
```javascript
gulp.Concat(
  'scripts', // taskName
  'src/js/*.js'// srcPath
  'dist/js/'// outputPath
  'scripts.js'// outputFileName
);
```

Parameters:
* taskName: string
* srcPath: string
* outputPath: string
* outputFileName: string

---

### Browserify Task:

Browserify JS files with sourcemaps and minifies JS with --production flag
```javascript
gulp.Browserify(
  'browserify', // taskName
  'src/js/*.js', // srcPath
  'dist/js/', // outputPath
  'app.js', // outputFileName
  ['babelify', 'vueify'] // browserifyPlugins
);
```

Parameters:
* taskName: string
* srcPath: string
* outputPath: string
* outputFileName: string
* browserifyPlugins: Array of strings

---

### Scsslint Task:

Lints JS files with .eslintrc rules
```javascript
gulp.Scsslint(
  'scsslint', // taskName
  'src/scss/**/*.scss', // scssPath
  'src/scss/vendor/**', // ignorePath
  '.scss-lint.yml' // linterFilePath
);
```

Parameters:
* taskName: string
* scssPath: string
* ignorePath: string
* linterFilePath: string

---

### Eslint Task:

Lints JS files with .eslintrc rules
```javascript
gulp.Eslint(
  'eslint', // taskName
  'src/js/**/*.{js,vue}', // jsPath
  'src/js/vendor/**', // ignorePath
  '.eslintrc' // linterFilePath
);
```

Parameters:
* taskName: string
* jsPath: string
* ignorePath: string
* linterFilePath: string

---

### Tslint Task:

Lints JS files with tslint rules
```javascript
gulp.Tslint(
  'tslint', // taskName
  'src/ts/**/*.ts', // tsPath
  'src/ts/vendor/**', // ignorePath
  '.tslintrc' // linterFilePath
);
```

Parameters:
* taskName: string
* tsPath: string
* ignorePath: string
* linterFilePath: string

---

### Clean Task:

Deletes files or directories
```javascript
gulp.Clean(
  [ // files
    'dist/js/*',
    'dist/css/*',
    'src/scss/vendor/*',
    'src/js/vendor/*',
  ]
);
```

Parameters:
* files: Array of strings

---

### Default Task:

Tasks that are run by default when running `gulp`
```javascript
gulp.Default(
  [ // tasks
    'copy',
    'scsslint',
    'sass',
    'eslint',
    'browserify',
    'html'
  ]
);
```

---

### Watch Task:
```javascript
gulp.Watch(
  [ // tasksToRunBeforeWatch
    'scsslint', // taskName
    'sass',
    'eslint',
    'browserify',
  ],
  [ // tasksToWatch
    {
      path: 'src/js/**/*.{js,vue}', // pathToWatchForChanges
      tasks: ['eslint', 'browserify']  // tasksToRunOnChange
    },
    {
      path: 'src/sass/**/*.scss', // pathToWatchForChanges
      tasks: ['scsslint', 'sass'] // tasksToRunOnChange
    },
  ]
);
```

---
#### More to come...

The documentation tends to fall behind what has actually been  implemented. If you want to see what other tasks this comes with, checkout the __[gulp-starter](https://github.com/jonathonwang/gulp-tasks-scaffold)__ repo and take a look at the source files, I usually try to include decent docblocks.
