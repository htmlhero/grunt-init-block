/**
 * grunt-init-block
 * https://github.com/htmlhero/grunt-init-block
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 *
 * Version: 0.1.0
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		initBlock: {
			options: {
				initDir: 'test/'
			},
			all: ['test/*.html']
		}

	});

	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['initBlock']);

};
