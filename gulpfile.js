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
              custom_stream('riot', js)
                .pipe(plugins.jshint())
                .pipe(plugins.notify(function(file) {
                  if (!file.jshint.success) {
                    var errors = file.jshint.results.map(function(result) {
                      if (result.error) {
                        return '(' + result.error.line + ':' + result.error.character + ') ' + result.error.reason;
                      }
                    }).join('\n');
                    var hint = '\nNote line number is relative to script tag in riot.js tag\n';
                    return hint + url + ' (' + file.jshint.results.length + ' errors)\n' + errors;
                  } else {
                    return false;
                  }
                }));

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
              var compiled;

              try {
                compiled = sass.renderSync(opts);
              }catch(err) {
                custom_stream('error', css)
                  .pipe(plugins.notify(function(file) {
                    var hint = '\nNote line number is relative to style tag inside the riot.js tag\n';
                    var file = 'Error: ' + url + '\n';
                    return hint + file + '(' + err.line + ':' + err.column + ') ' + err.message + '\n';
                  }));
                return css;
              }
              return compiled.css + '';
            }
          }
        }
      }))
      .pipe(gulp.dest(tagBuild))
      .pipe(plugins.notify(function(file) {
        return 'Tag compiled to ' + file.path;
      }));
  });

});

gulp.task('default', ['watch']);

// Create a custom stream, from a string
function custom_stream(file, string) {
  var customStream = require('stream').Readable({ objectMode: true});

  customStream._read = function() {
    this.push(new plugins.util.File({
      cwd: '',
      base: '',
      path: file,
      contents: new Buffer(string)
    }));

    this.push(null);
  }

  return customStream;
}
