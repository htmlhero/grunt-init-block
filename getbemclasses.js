/**
 * getBemClasses.js
 * http://github.com/htmlhero/getBemClasses
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 *
 * Version: 0.0.7
 */

var fs = require('fs');
var cheerio = require('cheerio');

var htmlFile = process.argv[2];

var options = {
	exportPrefix: 'test/',
	exportAttr: 'data-export-to',
	element: '__',
	modifier: '_',
	indentSize: 1,
	indentChar: '\t',
	shortModifier: true,
	preprocessor: false
};

// Read file and get DOM
var html = fs.readFileSync(htmlFile, 'utf-8');
var $ = cheerio.load(html);

// Get all nodes with export attribute
$('[' + options.exportAttr + ']').each(function () {

	var block = $(this);

	getClassList(block).forEach(function (clss) {

		// Filter elements and modifiers
		if (clss.indexOf(options.element) !== -1 || clss.indexOf(options.modifier) !== -1) {
			return;
		}

		var css = cssToString({
			block: '.' + clss,
			elements: getElements($, block, clss),
			modifiers: getModifiers(block, clss)
		});

		var cssFile = options.exportPrefix + block.attr(options.exportAttr);

		// If the file exists, append to it
		if (fs.existsSync(cssFile)) {
			css = fs.readFileSync(cssFile, 'utf-8') + css;
		}

		fs.writeFileSync(cssFile, css);

	});

});

function getClassList (node) {
	var className = node.attr('class');
	return className.replace(/\s+/g, ',').split(',');
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

function cssToString (input) {

	var output = '';

	var indentRepeat = function (size) {
		var tmp = '';
		for (var i = 0; i < size; i++) {
			tmp += options.indentChar;
		}
		return tmp;
	};

	var openBracket = !options.preprocessor ? ' {' : '';
	var closeBracket = !options.preprocessor ? '}' : '';

	var formatRule = function (selector, level) {
		var tmp = '';
		tmp += indentRepeat(options.indentSize * level);
		tmp += selector;
		tmp += openBracket;
		tmp += '\n';
		tmp += indentRepeat((options.indentSize + 1) * level);
		tmp += '\n';
		tmp += indentRepeat(options.indentSize * level);
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
