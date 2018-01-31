module.exports = function (wallaby) {
  return {
    files: [
      'app/**/*.js',
      '!app/**/*.test.js'
    ],
    tests: [
      'app/**/*.test.js'
    ],
    env: {
      type: 'node'
    },
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  };
};
