/**
 * getBemClasses.js
 * http://github.com/htmlhero/getBemClasses
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 *
 * Version: 0.0.6
 */

var fs = require('fs');
var cheerio = require('cheerio');

var file = process.argv[2];
var blockClass = process.argv[3];

var options = {
	indentSize: 1,
	indentChar: '\t',
	element: '__',
	modifier: '_',
	shortModifier: true,
	preprocessor: false
};

var html = fs.readFileSync(file, 'utf-8');

var $ = cheerio.load(html);
var block = $('.' + blockClass).eq(0);

// Catch zero length
if (!block.length) {
	console.error('No such block');
	process.exit(1);
}

var selectors = {
	block: '.' + blockClass,
	elements: getElements($, block, blockClass),
	modifiers: getModifiers(block, blockClass)
};

selectors = selectorsToString(selectors);

// Output
console.log(selectors);

function getClassList (node) {
	var className = node.attr('class');
	return className.replace(/\s+/g, ',').split(',');
}

function getElements ($, block, blockClass) {

	// Find all the elements starting with the block name
	var elemClass = blockClass + options.element;
	var elemsList = block.find('[class*="' + elemClass + '"]');

	var elemClassList;
	var elems = [];

	elemsList.each(function () {

		var prevClass;

		elemClassList = getClassList($(this));
		elemClassList.forEach(function (clss) {

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

function selectorsToString (input) {

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
