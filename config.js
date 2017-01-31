module.exports = {
  paths: {
    tags: ['./tags/**/*.tag'],
  },
  gulpLoadPlugins: {
    lazy: false,
    scope: ['dependencies', 'devDependencies', 'peerDependencies'],
    pattern: ['gulp-*', 'gulp.*'],
    DEBUG: false,
  },
};
