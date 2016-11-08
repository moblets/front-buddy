const gulp = require('gulp');
const browserify = require('browserify');
const q = require('q');
const vinylSource = require('vinyl-source-stream');
const babelify = require('babelify');
const gulpif = require('gulp-if');
const path = require('path');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const extend = require('xtend');

/**
 * @Module moblet module
 */
module.exports = class Module {
  /**
   * Class constructor
   * @param {location} js file from module
   * @param {destination} output module
   * @param {modules} path modules to broserify
   * @param {version} version of build
   */
  constructor(options) {
    this.options = options;
    this.location = options.location;
    this.destination = options.destination;
    this.modules = options.modules;
    this.version = options.version;
    this.name = this.getName();
  }
  dev(_options, callback) {
    // watch module
    this.watch(_options, () => {
      // build if change
      this.build(_options).then((build) => {
        callback(build);
      });
    });
  }
  /**
   * Watch this module
   */
  watch(_options, callback) {
    const options = extend(this.options, _options || {});
    // prepare files to watch
    options.watch = options.watch || [];
    options.watch.push(`${this.getFolder()}**/**`);
    // watch files
    gulp.watch(options.watch, (files) => {
      callback(files);
    });
  }
  /**
   * Build method
   */
  build(_options) {
    const options = extend(this.options, _options || {});
    // create a promise
    const deferred = q.defer();
    // set transforms array
    if (typeof options.paths === 'undefined') {
      options.paths = [];
    }
    options.paths.push(path.join(__dirname, '/node_modules/'));

    options.transform = [
      'browserify-css', 'lessify', 'partialify', 'brfs', 'browserify-ngannotate',
    ];
    // create a stream with parameter or a new browserify
    const stream = browserify(options)
    .transform(babelify.configure({
      compact: false,
      comments: true,
      sourceMaps: false,
      plugins: [path.join(__dirname, '/node_modules/babel-plugin-transform-decorators-legacy/')],
    }))
    .add(options.location)
    .bundle()
    .pipe(vinylSource(`${this.name}.bundle.js`))
    .pipe(buffer())
    .pipe(gulpif(options.min, uglify()))
    .pipe(gulp.dest(options.destination));
    // set stream end to resolve promise and error
    stream.on('error', () => {
      deferred.resolve({ error: true, message: `Error building Moblet Module ${this.name}` });
    });
    stream.on('end', () => {
      deferred.resolve({ success: true, message: `Moblet Module ${this.name} builded` });
    });
    // return promise
    return deferred.promise;
  }
  // return module folder directory
  getFolder() {
    const splited = this.location.split(`/${this.name}.js`);
    return `${splited[0]}/`;
  }
  // return module name
  getName() {
    let name;
    const splited = this.location.split('.js');
    if (splited[0].trim() === '') {
      name = '';
    } else {
      const urlSplited = splited[0].trim().split('/');
      name = urlSplited[urlSplited.length - 1];
    }
    return name;
  }
};
