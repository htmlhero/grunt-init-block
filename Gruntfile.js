/**
 * grunt-init-block
 * https://github.com/htmlhero/grunt-init-block
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		initBlock: {
			all: {
				src: ['test/*.html'],
				dest: 'test/'
			}
		}

	});

	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['initBlock']);

};
