/**
 * grunt-init-block
 * https://github.com/htmlhero/grunt-init-block
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 */

'use strict';

module.exports = function (grunt) {

	var fs = require('fs');
	var path = require('path');
	var cheerio = require('cheerio');
	var copy = require('copy-paste').copy;

	grunt.registerMultiTask('initBlock', 'Creates css from bem-html', function () {

		var options = this.options({
			attr: 'init-block',
			element: '__',
			modifier: '_',
			shortModifier: true,
			preprocessor: false,
			indent: '\t'
		});

		var dest = this.data.dest;

		this.filesSrc.forEach(function (htmlFile) {

			// Read file and get DOM
			var html = fs.readFileSync(htmlFile, 'utf-8');
			var $ = cheerio.load(html);
			var clipBoard = '';

			// Get all nodes with init attribute
			$('[' + options.attr + ']').each(function () {

				var block = $(this);
				var blockClassList = getClassList(block).filter(filterBlock);

				blockClassList.forEach(function (clss) {

					var css = cssToString($, clss, block);
					var cssFile = block.attr(options.attr);

					if (cssFile) {

						cssFile = path.join(dest, cssFile);

						// If the file exists, append to it
						if (fs.existsSync(cssFile)) {
							css = fs.readFileSync(cssFile, 'utf-8') + css;
						}

						fs.writeFileSync(cssFile, css);
						grunt.log.ok('Block .' + clss + ' initialized in ' + cssFile);

					} else {

						clipBoard += css;
						grunt.log.ok('Block .' + clss + ' copied to clipboad');

					}

				});

			});

			if (clipBoard) {
				copy(clipBoard);
			}

		});

		function getClassList (node) {
			var className = node.attr('class');
			return className.replace(/\s+/g, ',').split(',');
		}

		function filterBlock (clss) {
			// Filter elements and modifiers
			return (clss.indexOf(options.element) === -1 && clss.indexOf(options.modifier) === -1);
		}

		function getElements ($, block, blockClass) {

			// Find all the elements starting with the block name
			var elemClass = blockClass + options.element;
			var elemsList = block.find('[class*="' + elemClass + '"]');

			var elems = [];

			elemsList.each(function () {

				var elem = $(this);
				var prevClass;

				getClassList(elem).forEach(function (clss) {

					if (clss.indexOf(elemClass) === 0) {

						// Save previous class
						prevClass = '.' + clss;
						// Add element
						elems.push(prevClass);

					} else if (options.shortModifier && clss.indexOf(options.modifier) === 0 && prevClass) {

						// Add modifier
						elems.push(prevClass + '.' + clss);

					}

				});

			});

			// Remove duplicates
			elems = elems.filter(function (elem, pos) {
				return elems.indexOf(elem) === pos;
			});

			return elems;

		}

		function getModifiers (block, blockClass) {

			var modifiers = getClassList(block);
			var modifierClass = options.shortModifier ? options.modifier : blockClass + options.modifier;
			var modifierPrefix = options.shortModifier ? '.' + blockClass + '.' : '.';

			// Filter modifiers
			modifiers = modifiers.filter(function (clss) {
				return clss.indexOf(modifierClass) === 0;
			});

			// Add block prefix
			modifiers = modifiers.map(function (clss) {
				return modifierPrefix + clss;
			});

			return modifiers;

		}

		function cssToString ($, clss, block) {

			var input = {
				block: '.' + clss,
				elements: getElements($, block, clss),
				modifiers: getModifiers(block, clss)
			};

			var output = '\n';

			var indentRepeat = function (repeat) {
				var tmp = '';
				for (var i = 0; i < repeat; i++) {
					tmp += options.indent;
				}
				return tmp;
			};

			var openBracket = !options.preprocessor ? ' {' : '';
			var closeBracket = !options.preprocessor ? '}' : '';

			var formatRule = function (selector, level) {
				var tmp = '';
				tmp += indentRepeat(level);
				tmp += selector;
				tmp += openBracket;
				tmp += '\n';
				tmp += indentRepeat(level + 1);
				tmp += '\n';
				tmp += indentRepeat(level);
				tmp += closeBracket;
				tmp += '\n';
				return tmp;
			};

			// Format block
			output += formatRule(input.block, 0);

			// Format elements
			input.elements.forEach(function (elem) {
				if (options.preprocessor) {
					elem = elem.replace(input.block, '&');
				}
				output += formatRule(elem, 1);
			});

			// Format modifiers
			input.modifiers.forEach(function (modifier) {
				output += formatRule(modifier, 0);
			});

			return output;

		}

	});

};