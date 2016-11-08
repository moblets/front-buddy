// npm install --save-dev gulp browser-sync
const karma = require('karma');
const q = require('q');
const extend = require('xtend');
const gulp = require('gulp');
const wiredep = require('wiredep').stream;
const fs = require('fs');
const waterfall = require('async-waterfall');
const inject = require('gulp-inject');
const replacer = require('gulp-html-replace');
/**
 * @Module moblet module
 */
module.exports = class Project {
  /**
   * Class constructor
   * @param {options} options of develop object
   * @param {module} module object
   */
  constructor(options, modules) {
    this.options = options;
    this.modules = modules || options.modules;
  }
  /**
   * Creates a constant file and inject it on index.html
   */
  constants(target) {
    // create a promise
    const deferred = q.defer();
    // templates
    const templates = {
      mobile: {
        js: (key, value) => `\t.constant('${key}', '${value}')\n`,
        html: () => '',
      },
      web: {
        js: key => `\t.constant('${key}', window.constants.${key})\n`,
        html: key => `\t\twindow.constants.${key} = '{{${key}}}';\n`,
      },
    };

    // create head of file
    let templateJS = `angular.module('${this.options.starter}')\n`;
    let templateHTML = `<script>\n\t\twindow.constants = {}; \n`;

    for (const key in this.options.constants) {
      templateJS += templates[target].js(key, this.options.constants[key]);
      templateHTML += templates[target].html(key, this.options.constants[key]);
    }

    templateHTML += '\t</script>';
    templateJS += ';';

    if (target === 'mobile') {
      templateHTML = '';
    }

    // if target is web
    const constantFile = `${this.options.www}constants.js`;


    fs.writeFile(constantFile, templateJS, (err) => {
      if (err) {
        deferred.resolve({ error: true, message: 'Error creating constants file' });
      } else {
        // if files is created inject it on index
        const injectOptions = {
          quiet: true,
          name: 'constants',
          relative: true,
          addRootSlash: !target === 'mobile',
        };
        gulp.src(this.options.index)
        .pipe(inject(gulp.src(constantFile, { read: false }), injectOptions))
        .pipe(replacer({ constants: templateHTML }, { keepBlockTags: true }))
        .pipe(gulp.dest(this.options.www))
        .on('end', () => {
          deferred.resolve({ error: false, message: 'Success creating and injecting constants file' });
        });
      }
    });

    return deferred.promise;
  }
  /**
   * Runs bower inject
   */
  inject(_options) {
    // create a promise
    const deferred = q.defer();
    // extend the options
    const options = extend(this.options, _options || {});

    const modulesFinalSourcers = [];
    for (const module of this.modules) {
      const absolutPath = `${module.destination}${module.name}.bundle.js`;
      // absolutPath = absolutPath.replace(options.www, './');
      modulesFinalSourcers.push(absolutPath);
    }
    // if mobile put a / in front o urls
    let injectPrefix = true;
    let htmlReplace = {
      js: '<script src="/{{filePath}}"></script>',
      css: '<link rel="stylesheet" href="/{{filePath}}" />',
    };
    if (options.mobile) {
      injectPrefix = false;
      htmlReplace = {
        js: '<script src="{{filePath}}"></script>',
        css: '<link rel="stylesheet" href="{{filePath}}" />',
      };
    }
    // create a gulp pipe stream
    const target = gulp.src(options.index);
    target
    .pipe(inject(gulp.src(modulesFinalSourcers, { read: false }),
    { name: 'bundles', quiet: true, relative: true, addRootSlash: injectPrefix }))
    .pipe(wiredep({
      fileTypes: {
        html: {
          replace: htmlReplace,
        },
        less: {
          block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect: {
            css: /@import\s['"](.+css)['"]/gi,
            less: /@import\s['"](.+less)['"]/gi,
          },
          replace: {
            css: '@import "{{filePath}}";',
            less: '@import "{{filePath}}";',
          },
        },
      },
    }))
    // .pipe(inject(gulp.src(bowerFiles(), { read: false }), { relative: true }))
    .pipe(gulp.dest(options.www));

    target.on('error', () => {
      deferred.resolve({ error: true, message: 'Error inject bower components' });
    });

    target.on('end', () => {
      deferred.resolve({ success: true, message: 'Success inject bower components' });
    });

    return deferred.promise;
  }

  /**
   * build all project modules
   */
  build() {
    // create a promise
    const deferred = q.defer();
    // builder pipe
    const builders = [];
    // add a build pipe for each module
    for (const mod of this.modules) {
      builders.push((callback) => {
        mod.build().then(() => {
          callback();
        });
      });
    }
    // executing all builders
    waterfall(builders, () => {
      deferred.resolve({ error: false, message: `Success building Modules of ${this.options.name}` });
    });
    // return promise
    return deferred.promise;
  }
  /**
   * Runs the karma test of module
   */
  test() {
    // create a promise
    const deferred = q.defer();
    // loads conf from module directory
    const config = `${this.options.folder}/karma.conf.js`;
    // runs karma service
    new karma.Server({
      configFile: config,
      singleRun: true,
    }, (result) => {
      let r;
      if (result > 0) {
        r = { erros: result, error: true, message: 'Found a one or more errors in karma test.' };
      } else {
        r = { erros: result, success: true, message: 'passed in all karma tests.' };
      }
      deferred.resolve(r);
    }).start();

    return deferred.promise;
  }
};
