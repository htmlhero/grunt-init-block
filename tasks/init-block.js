/**
 * grunt-init-block
 * https://github.com/htmlhero/grunt-init-block
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 */

'use strict';

var initBlock = require('../lib/init-block');

module.exports = function (grunt) {

	grunt.registerMultiTask('initBlock', 'Creates css from bem-html', function () {

		initBlock(this.filesSrc, this.data.dest, this.options);

	});

};