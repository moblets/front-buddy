# Front-Buddy
> A frontend build automator tool

No matter the structure of your project, front-buddy will help you!

Show to the front-buddy what is your initial js file is, and it will build, inject css, inject less, inject html, precompile ec6 into ec5 and create a bundle file with all into it.

Show the front-buddy your index.html file, and it will compile all your modules, inject bower, all modules compiled prepare it to production!

Forget about complicate gulp files! front-buddy is browserify, babel, uglify, wiredep and gulp inject in only one module!

### Install
```
  $ npm i -s front-buddy
```

### Structure

#### Module
is a js file with all your code on it, you give us your options object, and we cam build or watch it for changes

> you can user in your file, cummonjs requires of html files, css and less files, js files, you can also use in your js files module.exports to import it in your module file.  

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

>  in your gulp file you import frontBoddy and use it to build your module file


```javascript
// gulpfile.js
const gulp = require('gulp');
const frontBoddy = require('front-buddy');

const myModule = new frontBoddy.Module({
  location: "myJsFileLocation.js",
  destination: "myDestinationFolder/www/bundles",
});
  
gulp.task('build', () => {
  return myModule.build().then(value => {
    console.log(value.message);
  });
});

```


#### Project
is a collection o modules, and a index.html.
> in your html file the import tags should exists

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
> the bower:css, bower:js and bundles:js are the tags that front-buddy will fill with bower injections and modules bundles imports


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

>  in your gulp file you import frontBoddy and use it to build your module and project.


```javascript
// gulpfile.js
const gulp = require('gulp');
const frontBoddy = require('front-buddy');

const myModule = new frontBoddy.Module({
  location: "myJsFileLocation.js",
  destination: "myDestinationFolder/www/bundles",
});

const myProject = new frontBoddy.Project({
  index: "pathToMy/Index.html",
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
