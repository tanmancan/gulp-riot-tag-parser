var gulp = require('gulp'),
    config = require('./config.js'),
    plugins = require('gulp-load-plugins')(config.gulpLoadPlugins);

// Watch task
gulp.task('watch', function() {

  // Compile riot tag
  gulp.watch(config.paths.tags, function(e) {
    var tagSrc = e.path,
        tagBuild = e.path.substring(0, e.path.indexOf('src/')).replace(process.cwd(), '.') + 'build';

    gulp.src(tagSrc)
      .pipe(plugins.riot({
        compact: true,
        type: 'jsParser',
        style: 'styleParser',
        parsers: {
          js: {
            jsParser: function(js, opts, url) {
              console.log(js);
              console.log(plugins)l
              return js;
            }
          },
          css: {
            styleParser: function(tag, css, opts, url) {
              var sass = require('node-sass');
              var opts = {
                data: css,
                omitSourceMapUrl: true,
                outputStyle: 'compact',
              };
              var compiled = sass.renderSync(opts);
              console.log(tag, css);
              return compiled.css + '';
            }
          }
        }
      }))
      .pipe(gulp.dest(tagBuild));
  });

});

gulp.task('default', ['watch']);
