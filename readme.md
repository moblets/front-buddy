![alt Front-Buddy](https://s22.postimg.org/njccshcmp/Captura_de_Tela_2016_11_08_a_s_21_55_50.png)

> A frontend build automator tool

[![npm](https://img.shields.io/npm/v/front-buddy.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/front-buddy)
[![npm](https://img.shields.io/npm/dt/front-buddy.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/front-buddy)
[![stars](https://img.shields.io/github/stars/moblets/front-buddy.svg?maxAge=2592000&style=flat-square)](https://github.com/moblets/front-buddy)
[![GitHub forks](https://img.shields.io/github/forks/moblets/front-buddy.svg?maxAge=2592000&style=flat-square)](https://github.com/moblets/front-buddy/network)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?maxAge=2592000&style=flat-square)](https://github.com/moblets/m-validate#license)

No matter the structure of your project, ***front buddy*** will help you!

Show to ***front buddy*** what is your initial js file, and it will build, inject css, inject less, inject html, precompile ec6 into ec5 and create a bundle file with all into it.

Show the ***front buddy*** your index.html file, and it will compile all your modules, inject bower and all modules compiled to prepare it for production!

Forget about complicated gulp files! ***front buddy*** is browserify, babel, uglify, wiredep and gulp-inject in a single module!

### Install
```
$ npm i -s front-buddy
```

### Structure

#### Module
Module is a JavaScript file with all your code. Pass the options object to front buddy, and it will build your module build or watch it for changes.

> ***front buddy*** will inject all files from you commonjs requires, including **HTML files**, **CSS and Less** files and **JavaScript** files into the resulting bundle. You can also use it in your JavaScript's module.exports to import it in your module file.

```javascript
// myJsFileLocation.js
const angular = require('angular');
require('./style.less');
const myTemplate = require('./template.html');

var app = angular.module("myApp");
app.directive('myDirective', function() {
  return {
    template: myTemplate,
    controller: function(){
    
    }
  }
});

```

>  in your gulp file you import ***front buddy*** and use it to build your module file


```javascript
// gulpfile.js
const gulp = require('gulp');
const Buddy = require('front-buddy');

const myModule = new Buddy.Module({
  location: "./folder/to/myModule.js",
  destination: "./folder/to/www/bundles/",
});
  
gulp.task('build', () => {
  return myModule.build().then(value => {
    console.log(value.message);
  });
});
```

#### Project
Project is a collection of Modules, and an initial HTML file.

> In your html file, insert the needed *import tags* that will be used to inject the content.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- bower:css -->
    <!-- endbower -->
  </head>
  <body ng-app="MyApp">
    <my-directive></my-directive>
    <!-- bower:js -->
    <!-- endbower -->
    
    <!-- bundles:js -->
    <!-- endinject -->
  </body>
</html>

```
> The tags **bower:css**, **bower:js** and **bundles:js** will be filled by ***front buddy*** with the bower injections and bundle modules imports.


```javascript
// gulpfile.js
const gulp = require('gulp');
const Buddy = require('front-buddy');


const myModule = new Buddy.Module({
  location: "./folder/to/myModule.js",
  destination: "./folder/to/www/bundles/",
});
  
const myProject = new Buddy.Project({
  index: "./folder/to/Index.html",
  modules: [myModule],
});
  
// build modules
gulp.task('build', () => {
  return myProject.build().then(value => {
    console.log(value.message);
  });
});

// inject bower and modules files into index
gulp.task('inject', () => {
  return myProject.inject().then(value => {
    console.log(value.message);
  });
});

```

> Made with love, from moblets dev team.
