![alt Front-Buddy](https://s22.postimg.org/njccshcmp/Captura_de_Tela_2016_11_08_a_s_21_55_50.png)

> A frontend build automator tool

No matter the structure of your project, front-buddy will help you!

Show to front-buddy what is your initial js file, and it will build, inject css, inject less, inject html, precompile ec6 into ec5 and create a bundle file with all into it.

Show the front-buddy your index.html file, and it will compile all your modules, inject bower and all modules compiled to prepare it for production!

Forget about complicated gulp files! Front-buddy is browserify, babel, uglify, wiredep and gulp-inject in only one module!

### Install
```
$ npm i -s front-buddy
```

### Structure

#### Module
is a js file with all your code on it, you give us your options object, and we can build or watch it for changes

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

>  in your gulp file you import Buddy and use it to build your module file


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
is a collection o modules, and a index.html.
> in your html file the import tags should exists to run inject method

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
