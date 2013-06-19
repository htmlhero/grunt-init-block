/**
 * getBemClasses.js
 * http://github.com/htmlhero/getbemclasses
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 *
 * Version: 0.0.5
 */

var fs = require('fs');
var cheerio = require('cheerio');

var file = process.argv[2];
var blockClass = process.argv[3];

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
	var elemClass = blockClass + '__';
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

			} else if (clss.indexOf('_') === 0 && prevClass) {

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

	// Filter modifiers
	modifiers = modifiers.filter(function (clss) {
		return clss.indexOf('_') === 0;
	});

	// Add block prefix
	modifiers = modifiers.map(function (clss) {
		return '.' + blockClass + '.' + clss;
	});

	return modifiers;

}

function selectorsToString (input) {

	var output = '';

	// Format block
	output += input.block + ' {\n\t\n}\n';

	// Format elements
	input.elements.forEach(function (elem) {
		output += '\t' + elem + ' {\n\t\t\n\t}\n';
	});

	// Format modifiers
	input.modifiers.forEach(function (modifier) {
		output += modifier + ' {\n\t\n}\n';
	});

	return output;

}
